import { useMemo } from 'react';

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

  const formatter_month = new Intl.DateTimeFormat('no-NO', { month: 'long' });

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
              <ListItem key={member.user.user_id}>
                <ListItemAvatar>
                  <Avatar user={member.user} />
                </ListItemAvatar>
                <ListItemText
                  primary={`${member.user.first_name} ${member.user.last_name}`}
                  secondary={`${formatter_month.format(parseISO(member.start_date))} ${parseISO(member.start_date).getFullYear()} til ${formatter_month.format(
                    parseISO(member.end_date),
                  )} ${parseISO(member.end_date).getFullYear()} - ${getMembershipType(member.membership_type)}`}
                />
              </ListItem>
            ))}
          </List>
        </Pagination>
      </Grid>
    </Paper>
  );
};

export default MembersHistoryCard;
