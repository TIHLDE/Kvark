import { useState } from 'react';
import { UserList } from 'types';
import { getUserStudyShort, getUserClass } from 'utils';
import { useUserStrikes } from 'hooks/User';

// Material-ui
import { Collapse, ListItem, ListItemText, Stack } from '@mui/material';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';

// Project components
import Avatar from 'components/miscellaneous/Avatar';
import Paper from 'components/layout/Paper';
import StrikeListItem from 'components/miscellaneous/StrikeListItem';

export type UserListItemProps = {
  user: UserList;
};

const UserListItem = ({ user }: UserListItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const { data = [] } = useUserStrikes(user.user_id);
  return (
    <Paper bgColor='smoke' noOverflow noPadding sx={{ mb: 1 }}>
      <ListItem button onClick={() => setExpanded((prev) => !prev)}>
        <Avatar sx={{ mr: 2 }} user={user} />
        <ListItemText primary={`${user.first_name} ${user.last_name}`} secondary={`${getUserClass(user.user_class)} - ${getUserStudyShort(user.user_study)}`} />
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItem>
      <Collapse in={expanded}>
        <Stack spacing={1} sx={{ p: 2 }}>
          {data.map((strike) => (
            <StrikeListItem isAdmin key={strike.id} strike={strike} user={user} />
          ))}
        </Stack>
      </Collapse>
    </Paper>
  );
};

export default UserListItem;
