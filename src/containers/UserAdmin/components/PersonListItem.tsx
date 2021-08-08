import { useState } from 'react';
import { UserList } from 'types/Types';
import { useActivateUser } from 'api/hooks/User';
import { useSnackbar } from 'api/hooks/Snackbar';
import { getUserClass, getUserStudyShort } from 'utils';

// Material UI Components
import { Typography, Collapse, Theme, useMediaQuery, Skeleton, Button, ListItem, ListItemText, Divider, Stack } from '@material-ui/core';

// Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreRounded';
import ExpandLessIcon from '@material-ui/icons/ExpandLessRounded';

// Project components
import Avatar from 'components/miscellaneous/Avatar';
import Paper from 'components/layout/Paper';
import ProfileSettings from 'containers/Profile/components/ProfileSettings';

export type PersonListItemProps = {
  user: UserList;
  is_TIHLDE_member?: boolean;
};

const PersonListItem = ({ user, is_TIHLDE_member = true }: PersonListItemProps) => {
  const activateUser = useActivateUser();
  const showSnackbar = useSnackbar();
  const [expanded, setExpanded] = useState(false);
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const changeStatus = () =>
    activateUser.mutate(user.user_id, {
      onSuccess: (data) => {
        showSnackbar(data.detail, 'success');
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });

  return (
    <Paper bgColor='smoke' noOverflow noPadding sx={{ mb: 1 }}>
      <ListItem button onClick={() => setExpanded((prev) => !prev)}>
        <Avatar sx={{ mr: 2 }} user={user} />
        <ListItemText
          primary={`${user.first_name} ${user.last_name}`}
          secondary={!mdDown && `${getUserClass(user.user_class)} ${getUserStudyShort(user.user_study)}`}
        />
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItem>
      <Collapse in={expanded} mountOnEnter unmountOnExit>
        <Divider />
        <Stack spacing={1} sx={{ p: 2 }}>
          <div>
            {mdDown && <Typography variant='subtitle1'>{`${getUserClass(user.user_class)} ${getUserStudyShort(user.user_study)}`}</Typography>}
            <Typography variant='subtitle1'>{`Brukernavn: ${user.user_id}`}</Typography>
            <Typography variant='subtitle1'>
              Epost: <a href={`mailto:${user.email}`}>{user.email}</a>
            </Typography>
          </div>
          {is_TIHLDE_member ? (
            <ProfileSettings isAdmin user={user} />
          ) : (
            <Button fullWidth onClick={() => changeStatus()} variant='outlined'>
              Legg til medlem
            </Button>
          )}
        </Stack>
      </Collapse>
    </Paper>
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
