import { useState } from 'react';
import { UserList } from 'types/Types';
import { useActivateUser } from 'api/hooks/User';
import { useSnackbar } from 'api/hooks/Snackbar';
import { getUserClass, getUserStudyShort } from 'utils';

// Material UI Components
import { makeStyles } from '@material-ui/styles';
import { Typography, Collapse, Theme, useMediaQuery, Skeleton, Button, ListItem, ListItemText, Divider } from '@material-ui/core';

// Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreRounded';
import ExpandLessIcon from '@material-ui/icons/ExpandLessRounded';

// Project components
import Avatar from 'components/miscellaneous/Avatar';
import Paper from 'components/layout/Paper';
import ProfileSettings from 'containers/Profile/components/ProfileSettings';

const useStyles = makeStyles((theme) => ({
  avatar: {
    marginRight: theme.spacing(2),
  },
  paper: {
    marginBottom: theme.spacing(1),
    overflow: 'hidden',
    background: theme.palette.background.smoke,
  },
  wrapper: {
    alignItems: 'center',
  },
  secondaryText: {
    whiteSpace: 'break-spaces',
  },
  content: {
    display: 'grid',
    gridGap: theme.spacing(1),
    padding: theme.spacing(2),
  },
}));

export type PersonListItemProps = {
  user: UserList;
  is_TIHLDE_member?: boolean;
};

const PersonListItem = ({ user, is_TIHLDE_member = true }: PersonListItemProps) => {
  const classes = useStyles();
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
    <Paper className={classes.paper} noPadding>
      <ListItem button className={classes.wrapper} onClick={() => setExpanded((prev) => !prev)}>
        <Avatar className={classes.avatar} user={user} />
        <ListItemText
          classes={{ secondary: classes.secondaryText }}
          primary={`${user.first_name} ${user.last_name}`}
          secondary={!mdDown && `${getUserClass(user.user_class)} ${getUserStudyShort(user.user_study)}`}
        />
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItem>
      <Collapse in={expanded} mountOnEnter unmountOnExit>
        <Divider />
        <div className={classes.content}>
          <div>
            {mdDown && <Typography variant='subtitle1'>{`${getUserClass(user.user_class)} ${getUserStudyShort(user.user_study)}`}</Typography>}
            <Typography variant='subtitle1'>{`Brukernavn: ${user.user_id}`}</Typography>
          </div>
          {is_TIHLDE_member ? (
            <ProfileSettings isAdmin user={user} />
          ) : (
            <Button color='primary' fullWidth onClick={() => changeStatus()} variant='outlined'>
              Legg til medlem
            </Button>
          )}
        </div>
      </Collapse>
    </Paper>
  );
};

export default PersonListItem;

export const PersonListItemLoading = () => {
  const classes = useStyles();
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  return (
    <Paper className={classes.paper} noPadding>
      <ListItem className={classes.wrapper}>
        <ListItemText
          classes={{ secondary: classes.secondaryText }}
          primary={<Skeleton width={`${160 + 40 * Math.random()}px`} />}
          secondary={!mdDown && <Skeleton width={`${130 + 20 * Math.random()}px`} />}
        />
      </ListItem>
    </Paper>
  );
};
