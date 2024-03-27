import EditIcon from '@mui/icons-material/EditRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Button, Collapse, Divider, IconButton, ListItem, ListItemAvatar, ListItemButton, ListItemText, MenuItem, Stack, Typography } from '@mui/material';
import { parseISO } from 'date-fns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate, getMembershipType, getUserAffiliation } from 'utils';

import { MembershipHistory, MembershipHistoryMutate } from 'types';
import { MembershipType } from 'types/Enums';

import { useDeleteMembershipHistory, useUpdateMembershipHistory } from 'hooks/Membership';
import { useSnackbar } from 'hooks/Snackbar';

import DatePicker from 'components/inputs/DatePicker';
import Select from 'components/inputs/Select';
import SubmitButton from 'components/inputs/SubmitButton';
import Dialog from 'components/layout/Dialog';
import Paper from 'components/layout/Paper';
import VerifyDialog from 'components/layout/VerifyDialog';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';

export type MembershipHistoryListItemProps = {
  membership: MembershipHistory;
  isAdmin?: boolean;
};

type FormValues = Pick<MembershipHistoryMutate, 'membership_type'> & {
  start_date: Date;
  end_date: Date;
};

const MembershipHistoryListItem = ({ membership, isAdmin }: MembershipHistoryListItemProps) => {
  const user = membership.user;
  const [expanded, setExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const deleteMembershipHistory = useDeleteMembershipHistory(membership.group.slug, membership.id);
  const updateMembershipHistory = useUpdateMembershipHistory(membership.group.slug, membership.id);
  const showSnackbar = useSnackbar();
  const { handleSubmit, getValues, formState, control } = useForm<FormValues>({
    defaultValues: { end_date: parseISO(membership.end_date), start_date: parseISO(membership.start_date), membership_type: membership.membership_type },
  });

  const removeMemberFromGroup = () =>
    deleteMembershipHistory.mutate(null, {
      onSuccess: (data) => showSnackbar(data.detail, 'success'),
      onError: (e) => showSnackbar(e.detail, 'error'),
    });

  const update = (data: FormValues) =>
    updateMembershipHistory.mutate(
      { ...data, start_date: data.start_date.toJSON(), end_date: data.end_date.toJSON() },
      {
        onSuccess: () => showSnackbar('Det tidligere medlemskapet ble oppdatert', 'success'),
        onError: (e) => showSnackbar(e.detail, 'error'),
      },
    );

  return (
    <Paper noOverflow noPadding>
      <ListItem
        disablePadding
        secondaryAction={isAdmin && <IconButton onClick={() => setExpanded((prev) => !prev)}>{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>}>
        <ListItemButton component={Link} to={`${URLS.profile}${user.user_id}/`}>
          <ListItemAvatar>
            <Avatar>
              <AvatarImage alt={user.first_name} src={user.image} />
              <AvatarFallback>{user.first_name[0] + user.last_name[0]}</AvatarFallback>
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${user.first_name} ${user.last_name}`}
            secondary={`${formatDate(parseISO(membership.start_date), { time: false, fullMonth: true })} -> ${formatDate(parseISO(membership.end_date), {
              time: false,
              fullMonth: true,
            })} - ${getMembershipType(membership.membership_type)}`}
          />
        </ListItemButton>
      </ListItem>
      <Collapse in={expanded && isAdmin} mountOnEnter>
        <Typography sx={{ whiteSpace: 'break-spaces', p: 2 }}>
          {`E-post: ${user.email}
${getUserAffiliation(user)}`}
        </Typography>
        <Divider />
        <Stack direction={{ xs: 'column', lg: 'row' }} gap={1} sx={{ p: 1 }}>
          <Dialog onClose={() => setEditOpen(false)} open={editOpen} titleText='Rediger tidligere medlemskap'>
            <form onSubmit={handleSubmit(update)}>
              <DatePicker
                control={control}
                disabled={updateMembershipHistory.isLoading}
                formState={formState}
                fullWidth
                label='Start medlemskap'
                name='start_date'
                required
                rules={{
                  required: 'Feltet er påkrevd',
                  validate: { beforeEndDate: (value) => value < getValues().end_date || 'Start på medlemskap må være før slutt på medlemskap' },
                }}
                type='date-time'
              />
              <DatePicker
                control={control}
                disabled={updateMembershipHistory.isLoading}
                formState={formState}
                fullWidth
                label='Slutt medlemskap'
                name='end_date'
                required
                rules={{ required: 'Feltet er påkrevd' }}
                type='date-time'
              />
              <Select control={control} disabled={updateMembershipHistory.isLoading} formState={formState} label='Type medlemskap' name='membership_type'>
                <MenuItem value={MembershipType.LEADER}>Leder</MenuItem>
                <MenuItem value={MembershipType.MEMBER}>Medlem</MenuItem>
              </Select>
              <SubmitButton disabled={updateMembershipHistory.isLoading} formState={formState} sx={{ mt: 1 }}>
                Oppdater
              </SubmitButton>
            </form>
          </Dialog>
          <Button color='primary' fullWidth onClick={() => setEditOpen(true)} startIcon={<EditIcon />} variant='outlined'>
            Rediger
          </Button>
          <VerifyDialog
            color='error'
            onConfirm={removeMemberFromGroup}
            startIcon={<HighlightOffIcon />}
            titleText={`Fjern ${user.first_name} ${user.last_name} fra gruppens medlemshistorikk?`}>
            Slett medlemskap
          </VerifyDialog>
        </Stack>
      </Collapse>
    </Paper>
  );
};

export default MembershipHistoryListItem;
