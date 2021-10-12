import { useState } from 'react';
import { UserList } from 'types';
import { getUserStudyShort, getUserClass } from 'utils';
import { useUserStrikes } from 'hooks/User';

// Material-ui
import { makeStyles } from '@mui/styles';
import { Collapse, ListItem, ListItemText } from '@mui/material';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';

// Project components
import Avatar from 'components/miscellaneous/Avatar';
import Paper from 'components/layout/Paper';
import StrikeListItem from 'components/miscellaneous/StrikeListItem';

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
    paddingRight: theme.spacing(8),
    alignItems: 'center',
  },
  content: {
    display: 'grid',
    gridGap: theme.spacing(1),
    padding: theme.spacing(2),
  },
  actions: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: theme.spacing(1),
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: '1fr',
    },
  },
}));

export type UserListItemProps = {
  user: UserList;
};

const UserListItem = ({ user }: UserListItemProps) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const { data = [] } = useUserStrikes(user.user_id);
  return (
    <Paper className={classes.paper} noPadding>
      <ListItem button className={classes.wrapper} onClick={() => setExpanded((prev) => !prev)}>
        <Avatar className={classes.avatar} user={user} />
        <ListItemText primary={`${user.first_name} ${user.last_name}`} secondary={`${getUserClass(user.user_class)} - ${getUserStudyShort(user.user_study)}`} />
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItem>
      <Collapse in={expanded}>
        {data.map((strike) => (
          <StrikeListItem isAdmin key={strike.id} strike={strike} user={user} />
        ))}
      </Collapse>
    </Paper>
  );
};

export default UserListItem;
