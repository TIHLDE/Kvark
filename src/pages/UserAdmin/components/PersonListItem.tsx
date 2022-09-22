import OpenInNewIcon from '@mui/icons-material/OpenInNewRounded';
import { Button, IconButton, ListItem, ListItemText, Skeleton, Stack, Theme, Typography, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import URLS from 'URLS';
import { getUserAffiliation } from 'utils';

import { UserList } from 'types';

import { useSnackbar } from 'hooks/Snackbar';
import { useActivateUser, useDeclineUser, useUser } from 'hooks/User';

import UserDeleteDialog from 'pages/Profile/components/ProfileSettings/UserDeleteDialog';
import UserSettings from 'pages/Profile/components/ProfileSettings/UserSettings';

import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import Dialog from 'components/layout/Dialog';
import { StandaloneExpand } from 'components/layout/Expand';
import Paper from 'components/layout/Paper';
import Avatar from 'components/miscellaneous/Avatar';

type FormValues = {
  reason: string;
};

const DeclineUser = ({ user }: Pick<PersonListItemProps, 'user'>) => {
  const [showDialog, setShowDialog] = useState(false);
  const showSnackbar = useSnackbar();
  const { handleSubmit, formState, register } = useForm<FormValues>();
  const declineUser = useDeclineUser();
  const decline = (data: FormValues) =>
    declineUser.mutate(
      { userId: user.user_id, reason: data.reason },
      {
        onSuccess: (data) => {
          setShowDialog(false);
          showSnackbar(data.detail, 'success');
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      },
    );

  return (
    <>
      <Button color='error' fullWidth onClick={() => setShowDialog(true)} variant='outlined'>
        Slett
      </Button>
      <Dialog
        contentText='Brukeren vil få beskjed via epost om at brukeren ble avslått sammen med begrunnelsen.'
        onClose={() => setShowDialog(false)}
        open={showDialog}
        titleText='Slett bruker'>
        <form onSubmit={handleSubmit(decline)}>
          <TextField formState={formState} label='Begrunnelse (valgfri)' minRows={2} multiline {...register('reason')} />
          <SubmitButton disabled={declineUser.isLoading} formState={formState}>
            Slett bruker
          </SubmitButton>
        </form>
      </Dialog>
    </>
  );
};

export type PersonListItemProps = {
  user: UserList;
  is_TIHLDE_member?: boolean;
};

const PersonListItem = ({ user, is_TIHLDE_member = true }: PersonListItemProps) => {
  const activateUser = useActivateUser();
  const showSnackbar = useSnackbar();
  const [expanded, setExpanded] = useState(false);
  const { data } = useUser(user.user_id, { enabled: expanded && is_TIHLDE_member });
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const activate = () =>
    activateUser.mutate(user.user_id, {
      onSuccess: (data) => {
        showSnackbar(data.detail, 'success');
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });

  return (
    <StandaloneExpand
      bgColor='smoke'
      expanded={expanded}
      icon={<Avatar sx={{ mr: 2 }} user={user} />}
      listItemProps={{
        secondaryAction: (
          <IconButton component='a' href={`${URLS.profile}${user.user_id}/`} rel='noopener noreferrer' target='_blank'>
            <OpenInNewIcon />
          </IconButton>
        ),
      }}
      onExpand={setExpanded}
      primary={`${user.first_name} ${user.last_name}`}
      secondary={!mdDown && getUserAffiliation(user)}
      sx={{ mb: 1 }}>
      <div>
        {mdDown && <Typography variant='subtitle1'>{getUserAffiliation(user)}</Typography>}
        <Typography variant='subtitle1'>{`Brukernavn: ${user.user_id}`}</Typography>
        <Typography variant='subtitle1'>
          Epost: <a href={`mailto:${user.email}`}>{user.email}</a>
        </Typography>
      </div>
      {is_TIHLDE_member ? (
        data && (
          <>
            <UserSettings isAdmin user={data} />
            <UserDeleteDialog isAdmin user={data} />
          </>
        )
      ) : (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
          <Button fullWidth onClick={activate} variant='outlined'>
            Legg til medlem
          </Button>
          <DeclineUser user={user} />
        </Stack>
      )}
    </StandaloneExpand>
  );
};

export default PersonListItem;

export const PersonListItemLoading = () => {
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  return (
    <Paper bgColor='smoke' noOverflow noPadding sx={{ mb: 1 }}>
      <ListItem>
        <ListItemText
          primary={<Skeleton width={`${160 + 40 * Math.random()}px`} />}
          secondary={!mdDown && <Skeleton width={`${130 + 20 * Math.random()}px`} />}
        />
      </ListItem>
    </Paper>
  );
};
