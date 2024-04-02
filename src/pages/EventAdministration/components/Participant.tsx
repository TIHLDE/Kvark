import ArrowDownwardIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpwardRounded';
import Delete from '@mui/icons-material/DeleteRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import { Checkbox, Collapse, Divider, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, Tooltip, Typography } from '@mui/material';
import parseISO from 'date-fns/parseISO';
import { useEffect, useState } from 'react';
import { formatDate, getUserAffiliation } from 'utils';

import { Registration } from 'types';

import { useDeleteEventRegistration, useEventById, useUpdateEventRegistration } from 'hooks/Event';
import { useSnackbar } from 'hooks/Snackbar';
import { useUserStrikes } from 'hooks/User';

import Paper from 'components/layout/Paper';
import VerifyDialog from 'components/layout/VerifyDialog';
import StrikeCreateDialog from 'components/miscellaneous/StrikeCreateDialog';
import StrikeListItem from 'components/miscellaneous/StrikeListItem';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';

export type ParticipantProps = {
  eventId: number;
  registration: Registration;
};

const Participant = ({ registration, eventId }: ParticipantProps) => {
  const updateRegistration = useUpdateEventRegistration(eventId);
  const deleteRegistration = useDeleteEventRegistration(eventId);
  const showSnackbar = useSnackbar();
  const [checkedState, setCheckedState] = useState(registration.has_attended);
  const [expanded, setExpanded] = useState(false);
  const { data: event } = useEventById(eventId);

  useEffect(() => {
    setCheckedState(registration.has_attended);
  }, [registration]);

  const deleteHandler = async () => {
    await deleteRegistration.mutate(registration.user_info.user_id, {
      onSuccess: () => {
        showSnackbar(`Deltageren ble fjernet`, 'success');
      },
    });
  };

  const moveHandler = (onWait: boolean) => {
    updateRegistration.mutate({ registration: { is_on_wait: onWait }, userId: registration.user_info.user_id });
  };

  const handleAttendedCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedState(event.target.checked);
    updateRegistration.mutate(
      { registration: { has_attended: event.target.checked }, userId: registration.user_info.user_id },
      {
        onSuccess: () => {
          showSnackbar(
            `${registration.user_info.first_name} ${registration.user_info.last_name} ble satt til ${!event.target.checked ? 'ikke ' : ''}ankommet`,
            'success',
          );
        },
        onError: () => {
          setCheckedState(!event.target.checked);
        },
      },
    );
  };

  const StrikesInfo = () => {
    const { data = [] } = useUserStrikes(registration.user_info.user_id);
    return (
      <>
        <Typography variant='subtitle1'>{`Alle prikker (${data.reduce((val, strike) => val + strike.strike_size, 0)}):`}</Typography>
        <Stack gap={1}>
          {data.map((strike) => (
            <StrikeListItem key={strike.id} strike={strike} user={registration.user_info} />
          ))}
          {!data.length && (
            <Typography variant='subtitle2'>{`${registration.user_info.first_name} ${registration.user_info.last_name} har ingen aktive prikker`}</Typography>
          )}
          <StrikeCreateDialog eventId={eventId} userId={registration.user_info.user_id}>
            Lag ny prikk
          </StrikeCreateDialog>
        </Stack>
      </>
    );
  };

  return (
    <Paper bgColor='smoke' noOverflow noPadding sx={{ mb: 1 }}>
      <ListItem
        disablePadding
        secondaryAction={
          !registration.is_on_wait && (
            <Tooltip title={checkedState ? 'Merk som ikke ankommet' : 'Merk som ankommet'}>
              <Checkbox checked={checkedState} onChange={handleAttendedCheck} />
            </Tooltip>
          )
        }>
        <ListItemButton onClick={() => setExpanded((prev) => !prev)}>
          <ListItemAvatar>
            <Avatar>
              <AvatarImage alt={registration.user_info.first_name} src={registration.user_info.image} />
              <AvatarFallback>{registration.user_info.first_name[0] + registration.user_info.last_name[0]}</AvatarFallback>
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${registration.user_info.first_name} ${registration.user_info.last_name}`}
            secondary={`${getUserAffiliation(registration.user_info)}${
              registration.user_info.allergy !== '' ? `\nAllergier: ${registration.user_info.allergy}` : ''
            }${!registration.allow_photo ? `\nVil ikke bli tatt bilde av` : ''}`}
          />
          {expanded ? <ExpandLessIcon sx={{ mr: 2 }} /> : <ExpandMoreIcon sx={{ mr: 2 }} />}
        </ListItemButton>
      </ListItem>
      <Collapse in={expanded} mountOnEnter unmountOnExit>
        <Divider />
        <Stack gap={1} sx={{ p: 2 }}>
          <div>
            <Typography variant='subtitle1'>{`Epost: ${registration.user_info.email}`}</Typography>
            <Typography variant='subtitle1'>{`Påmeldt: ${formatDate(parseISO(registration.created_at))}`}</Typography>
            {registration.wait_queue_number !== null && <Typography variant='subtitle1'>{`Ventelistenummer: ${registration.wait_queue_number}`}</Typography>}
          </div>
          <Stack direction={{ xs: 'column', md: 'row' }} gap={1}>
            {registration.is_on_wait && event && event.list_count >= event.limit ? (
              <VerifyDialog contentText='Du må flytte noen på ventelista før du kan flytte en deltager opp' startIcon={<ArrowUpwardIcon />}>
                Flytt til påmeldte
              </VerifyDialog>
            ) : registration.is_on_wait && event && event.list_count <= event.limit ? (
              <VerifyDialog
                contentText={`Er du sikker på at du vil gi denne personen plass på dette arrangementet?`}
                onConfirm={() => moveHandler(false)}
                startIcon={<ArrowUpwardIcon />}
                titleText={'Er du sikker?'}
                variant='outlined'>
                Flytt til påmeldte
              </VerifyDialog>
            ) : (
              <VerifyDialog
                contentText={`Er du sikker på at du vil flytte denne personen til ventelista?`}
                onConfirm={() => moveHandler(true)}
                startIcon={<ArrowDownwardIcon />}
                titleText={'Er du sikker?'}
                variant='outlined'>
                Flytt til venteliste
              </VerifyDialog>
            )}
            <VerifyDialog
              color='error'
              contentText={`Er du sikker på at du vil fjerne ${registration.user_info.first_name} ${registration.user_info.last_name} fra arrangementet?`}
              onConfirm={deleteHandler}
              startIcon={<Delete />}>
              Fjern deltager
            </VerifyDialog>
          </Stack>
          <Divider sx={{ my: 1 }} />
          <StrikesInfo />
        </Stack>
      </Collapse>
    </Paper>
  );
};

export default Participant;
