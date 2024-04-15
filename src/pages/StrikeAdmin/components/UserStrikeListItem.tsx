import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import { Collapse, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { getUserAffiliation } from 'utils';

import { UserList } from 'types';

import { useUserStrikes } from 'hooks/User';

import Paper from 'components/layout/Paper';
import StrikeListItem from 'components/miscellaneous/StrikeListItem';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';

export type StrikeListProps = {
  user: UserList;
};

const StrikeList = ({ user }: StrikeListProps) => {
  const { data = [] } = useUserStrikes(user.user_id);
  return (
    <Stack spacing={1} sx={{ p: 2 }}>
      {data.map((strike) => (
        <StrikeListItem key={strike.id} strike={strike} user={user} />
      ))}
    </Stack>
  );
};

export type UserListItemProps = {
  user: UserList;
};

const UserStrikeListItem = ({ user }: UserListItemProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Paper bgColor='smoke' noOverflow noPadding sx={{ mb: 1 }}>
      <ListItem button onClick={() => setExpanded((prev) => !prev)}>
        <Avatar className='mr-4'>
          <AvatarImage alt={user.first_name} src={user.image} />
          <AvatarFallback>
            {user.first_name[0]}
            {user.last_name[0]}
          </AvatarFallback>
        </Avatar>
        <ListItemText primary={`${user.first_name} ${user.last_name}`} secondary={getUserAffiliation(user)} />
        <Typography sx={{ fontWeight: 'bold', ml: 1, mr: 3 }} variant='h3'>
          {user.number_of_strikes}
        </Typography>
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItem>
      <Collapse in={expanded} mountOnEnter>
        <StrikeList user={user} />
      </Collapse>
    </Paper>
  );
};

export default UserStrikeListItem;
