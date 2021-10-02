import { useState, useEffect } from 'react';
import { Registration } from 'types';
import { getUserStudyShort, formatDate, getUserClass } from 'utils';
import { useDeleteEventRegistration, useUpdateEventRegistration, useEventById } from 'hooks/Event';
import parseISO from 'date-fns/parseISO';
import { useSnackbar } from 'hooks/Snackbar';

// Material-ui
import { Stack, Checkbox, Typography, Collapse, Button, ListItem, ListItemButton, ListItemText, ListItemAvatar, Divider } from '@mui/material';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';

// Icons
import Delete from '@mui/icons-material/DeleteRounded';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpwardRounded';

// Project components
import Avatar from 'components/miscellaneous/Avatar';
import Paper from 'components/layout/Paper';
import VerifyDialog from 'components/layout/VerifyDialog';

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

  const changeList = (onWait: boolean) => updateRegistration.mutate({ registration: { is_on_wait: onWait }, userId: registration.user_info.user_id });

  return (
    <Paper bgColor='smoke' noOverflow noPadding sx={{ mb: 1 }}>
      <ListItem disablePadding secondaryAction={!registration.is_on_wait && <Checkbox checked={checkedState} onChange={handleAttendedCheck} />}>
        <ListItemButton onClick={() => setExpanded((prev) => !prev)}>
          <ListItemAvatar>
            <Avatar user={registration.user_info} />
          </ListItemAvatar>
          <ListItemText
            primary={`${registration.user_info.first_name} ${registration.user_info.last_name}`}
            secondary={`${getUserClass(registration.user_info.user_class)} - ${getUserStudyShort(registration.user_info.user_study)}${
              registration.user_info.allergy !== '' ? `\nAllergier: ${registration.user_info.allergy}` : ''
            }${!registration.allow_photo ? `\nVil ikke bli tatt bilde av` : ''}`}
          />
          {expanded ? <ExpandLessIcon sx={{ mr: 2 }} /> : <ExpandMoreIcon sx={{ mr: 2 }} />}
        </ListItemButton>
      </ListItem>
      <Collapse in={expanded}>
        <Divider />
        <Stack gap={1} sx={{ p: 2 }}>
          <div>
            <Typography variant='subtitle1'>{`Epost: ${registration.user_info.email}`}</Typography>
            <Typography variant='subtitle1'>{`Påmeldt: ${formatDate(parseISO(registration.created_at))}`}</Typography>
          </div>
          <Stack direction={{ xs: 'column', md: 'row' }} gap={1}>
            {registration.is_on_wait ? (
              <VerifyDialog
                contentText={`Er du sikker på at du vil gi denne personen plass på dette arrangementet? ${
                  event && event.list_count >= event.limit
                    ? 'Arrangementet er fullt og vil få en ekstra plass slik at antall påmeldte ikke blir større enn kapasiteten.'
                    : ''
                }`}
                onConfirm={() => changeList(false)}
                startIcon={<ArrowUpwardIcon />}
                titleText={'Er du sikker?'}
                variant='outlined'>
                Flytt til påmeldte
              </VerifyDialog>
            ) : (
              <Button fullWidth onClick={() => changeList(true)} startIcon={<ArrowDownwardIcon />} variant='outlined'>
                Flytt til venteliste
              </Button>
            )}
            <VerifyDialog
              color='error'
              contentText={`Er du sikker på at du vil fjerne ${registration.user_info.first_name} ${registration.user_info.last_name} fra arrangementet?`}
              onConfirm={deleteHandler}
              startIcon={<Delete />}>
              Fjern deltager
            </VerifyDialog>
          </Stack>
        </Stack>
      </Collapse>
    </Paper>
  );
};

export default Participant;
