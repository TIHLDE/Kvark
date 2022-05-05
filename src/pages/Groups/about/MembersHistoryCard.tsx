import { Skeleton, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';

import { Group } from 'types';

import { useGroup } from 'hooks/Group';
import { useMembershipHistories } from 'hooks/Membership';

import MembershipHistoryListItem from 'pages/Groups/about/MembershipHistoryListItem';

import Pagination from 'components/layout/Pagination';

export type MembersHistoryCardProps = {
  groupSlug: Group['slug'];
};

const MembersHistoryCard = ({ groupSlug }: MembersHistoryCardProps) => {
  const { data, hasNextPage, fetchNextPage, isLoading, isFetching } = useMembershipHistories(groupSlug);
  const prevMemberships = useMemo(() => (data !== undefined ? data.pages.map((page) => page.results).flat(1) : []), [data]);
  const { data: group } = useGroup(groupSlug);
  const hasWriteAcccess = Boolean(group?.permissions.write);

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

  if (!prevMemberships.length) {
    return null;
  }

  return (
    <Stack gap={1} sx={{ mt: 1 }}>
      {Boolean(data?.pages?.length) && <Typography variant='h3'>Medlemshistorikk:</Typography>}
      <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} label='Last flere tidligere medlemmer' nextPage={() => fetchNextPage()}>
        <Stack gap={1}>
          {prevMemberships.map((membership) => (
            <MembershipHistoryListItem isAdmin={hasWriteAcccess} key={membership.id} membership={membership} />
          ))}
        </Stack>
      </Pagination>
    </Stack>
  );
};

export default MembersHistoryCard;
