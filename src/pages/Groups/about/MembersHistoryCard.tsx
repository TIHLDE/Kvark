import { ListItem, ListItemAvatar, ListItemButton, ListItemText, Skeleton, Stack, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import nbLocale from 'date-fns/locale/nb';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { getMembershipType } from 'utils';

import { useMembershipHistories } from 'hooks/Membership';

import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import Avatar from 'components/miscellaneous/Avatar';

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
    <Stack gap={1} sx={{ mt: 1 }}>
      {Boolean(data?.pages?.length) && <Typography variant='h3'>Medlemshistorikk:</Typography>}
      <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} label='Last flere medlemmer' nextPage={() => fetchNextPage()}>
        <Stack gap={1}>
          {prevMembers.map((member) => (
            <ListItem component={Paper} disablePadding key={`${member.user.user_id}_${member.end_date}`} noOverflow noPadding>
              <ListItemButton component={Link} sx={{ py: 0 }} to={`${URLS.profile}${member.user.user_id}/`}>
                <ListItemAvatar>
                  <Avatar user={member.user} />
                </ListItemAvatar>
                <ListItemText
                  primary={`${member.user.first_name} ${member.user.last_name}`}
                  secondary={`${format(parseISO(member.start_date), 'MMMM yyyy', { locale: nbLocale })} til ${format(parseISO(member.end_date), 'MMMM yyyy', {
                    locale: nbLocale,
                  })} - ${getMembershipType(member.membership_type)}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </Stack>
      </Pagination>
    </Stack>
  );
};

export default MembersHistoryCard;
