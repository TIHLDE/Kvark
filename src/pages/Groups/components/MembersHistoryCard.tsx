import { useMemo } from 'react';

import { ListItem, ListItemText, ListItemAvatar, Typography, Skeleton, Stack } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { useMembershipHistories } from 'hooks/Membership';
import Pagination from 'components/layout/Pagination';
import Avatar from 'components/miscellaneous/Avatar';
import { getMembershipType } from 'utils';

export type MembersHistoryCardProps = {
  slug: string;
};

const MembersHistoryCard = ({ slug }: MembersHistoryCardProps) => {
  const { data, hasNextPage, fetchNextPage, isLoading, isFetching } = useMembershipHistories(slug);
  const prevMembers = useMemo(() => (data !== undefined ? data.pages.map((page) => page.results).flat(1) : []), [data]);

  if (isLoading) {
    return (
      <Stack spacing={1}>
        <Skeleton height={45} width={160} />
        <Skeleton width={120} />
        <Skeleton height={45} width={190} />
        <Skeleton width={140} />
        <Skeleton width={150} />
        <Skeleton width={130} />
        <Skeleton width={160} />
      </Stack>
    );
  }

  if (!prevMembers.length) {
    return null;
  }

  return (
    <Stack gap={1}>
      {Boolean(data?.pages?.length) && <Typography variant='h3'>Tidligere medlemmer:</Typography>}
      <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} label='Last flere medlemmer' nextPage={() => fetchNextPage()}>
        <Stack gap={1}>
          {prevMembers.map((member) => (
            <ListItem disablePadding key={member.user.user_id}>
              <ListItemAvatar>
                <Avatar user={member.user} />
              </ListItemAvatar>
              <ListItemText
                primary={`${member.user.first_name} ${member.user.last_name}`}
                secondary={`${format(parseISO(member.start_date), 'MMMM yyyy')} til ${format(parseISO(member.end_date), 'MMMM yyyy')} - ${getMembershipType(
                  member.membership_type,
                )}`}
              />
            </ListItem>
          ))}
        </Stack>
      </Pagination>
    </Stack>
  );
};

export default MembersHistoryCard;
