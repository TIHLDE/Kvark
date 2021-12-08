import { useState, useMemo } from 'react';
import { GroupUserFine } from 'types';
import { useGroupUserFines } from 'hooks/Group';

// Material-ui
import { Collapse, ListItem, ListItemText, Stack, Typography, List, Divider } from '@mui/material';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';

// Project components
import Avatar from 'components/miscellaneous/Avatar';
import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import FineItem, { FineItemProps } from 'pages/Groups/fines/FineItem';
import { useFinesFilter } from 'pages/Groups/fines/FinesContext';

export type UserFineItemProps = Pick<FineItemProps, 'groupSlug' | 'isAdmin'> & {
  userFine: GroupUserFine;
};

const UserFineItem = ({ userFine, groupSlug, isAdmin }: UserFineItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const finesFilter = useFinesFilter();

  const { data, hasNextPage, isFetching, fetchNextPage } = useGroupUserFines(groupSlug, userFine.user.user_id, finesFilter, { enabled: expanded });
  const fines = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <Paper noOverflow noPadding>
      <ListItem button dense onClick={() => setExpanded((prev) => !prev)}>
        <Avatar sx={{ mr: 2 }} user={userFine.user} />
        <ListItemText primary={`${userFine.user.first_name} ${userFine.user.last_name}`} />
        <Typography sx={{ fontWeight: 'bold', ml: 1, mr: 3 }} variant='h3'>
          {userFine.fines_amount}
        </Typography>
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItem>
      <Collapse in={expanded} mountOnEnter>
        <Divider />
        <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
          <Stack component={List} gap={1} sx={{ p: [1, undefined, 2] }}>
            {fines.map((fine) => (
              <FineItem fine={fine} groupSlug={groupSlug} hideUserInfo isAdmin={isAdmin} key={fine.id} />
            ))}
          </Stack>
        </Pagination>
      </Collapse>
    </Paper>
  );
};

export default UserFineItem;
