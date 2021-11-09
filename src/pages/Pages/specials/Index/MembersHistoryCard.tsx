import { useMemo } from 'react';
import { MembershipHistory } from 'types';

import { ListItem, ListItemText, ListItemAvatar, List, Grid, Typography, Skeleton } from '@mui/material';
import { parseISO } from 'date-fns';

import Paper from 'components/layout/Paper';
import { useMembershipHistories } from 'hooks/Membership';
import Pagination from 'components/layout/Pagination';
import { useGroup } from 'hooks/Group';
import Avatar from 'components/miscellaneous/Avatar';
import { getMembershipType } from 'utils';

export type MembersHistoryCardProps = {
  slug: string;
};

const MembersHistoryCard = ({ slug }: MembersHistoryCardProps) => {
  const { data, hasNextPage, fetchNextPage, isLoading, isFetching } = useMembershipHistories(slug);
  const prevMembers = useMemo(() => (data !== undefined ? data.pages.map((page) => page.results).flat(1) : []), [data]);
  const { data: group } = useGroup(slug);
  const leader = group?.leader;

  if (isLoading) {
    return (
      <Paper>
        <Skeleton height='100px' variant='rectangular' />
      </Paper>
    );
  }

  if (!data?.pages?.length && !leader) {
    return null;
  }

  type PersonProps = {
    membership: MembershipHistory;
  };

  const Person = ({ membership }: PersonProps) => (
    <ListItem>
      <ListItemAvatar>
        <Avatar user={membership.user} />
      </ListItemAvatar>
      <ListItemText
        primary={`${membership.user.first_name} ${membership.user.last_name}`}
        secondary={`${parseISO(membership.start_date).getFullYear()} til ${parseISO(membership.end_date).getFullYear()} - ${getMembershipType(
          membership.membership_type,
        )}`}
      />
    </ListItem>
  );

  return (
    <Paper sx={{ mb: ({ spacing }) => spacing(2) }}>
      <Grid container spacing={2}>
        {Boolean(data?.pages?.length) && (
          <Grid item xs={12}>
            <Typography variant='h3'>Tidligere medlemmer:</Typography>
          </Grid>
        )}
        <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} label='Last flere medlemmer' nextPage={() => fetchNextPage()}>
          <List>
            {prevMembers.map((member) => (
              <Person key={member.user.user_id} membership={member} />
            ))}
          </List>
        </Pagination>
      </Grid>
    </Paper>
  );
};

export default MembersHistoryCard;
