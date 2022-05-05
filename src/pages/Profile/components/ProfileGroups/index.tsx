import { Box, Divider, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useUserMembershipHistories, useUserMemberships } from 'hooks/User';

import MembershipHistoryItem, { MembershipHistoryItemLoading } from 'pages/Profile/components/ProfileGroups/MembershipHistoryItem';
import MembershipItem, { MembershipItemLoading } from 'pages/Profile/components/ProfileGroups/MembershipItem';

import Pagination from 'components/layout/Pagination';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

const Memberships = () => {
  const { userId } = useParams();
  const { data, isLoading, hasNextPage, isFetching, fetchNextPage } = useUserMemberships(userId);
  const memberships = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} label='Last flere medlemskap' nextPage={() => fetchNextPage()}>
      {!isLoading && !memberships.length && (
        <NotFoundIndicator header='Fant ingen medlemskap' subtitle={`${userId ? 'Brukeren' : 'Du'} er ikke medlem av noen grupper`} />
      )}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 1 }}>
        {isLoading && <MembershipItemLoading />}
        {memberships.map((membership) => (
          <MembershipItem key={membership.group.slug} membership={membership} />
        ))}
      </Box>
    </Pagination>
  );
};

const MembershipHistories = () => {
  const { userId } = useParams();
  const { data, isLoading, hasNextPage, isFetching, fetchNextPage } = useUserMembershipHistories(userId);
  const membershipHistories = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} label='Last flere medlemskap' nextPage={() => fetchNextPage()}>
      {!isLoading && !membershipHistories.length && (
        <NotFoundIndicator header='Fant ingen tidligere medlemskap' subtitle={`${userId ? 'Brukeren' : 'Du'} har ikke vært medlem av noen grupper`} />
      )}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 1 }}>
        {isLoading && <MembershipHistoryItemLoading />}
        {membershipHistories.map((membership) => (
          <MembershipHistoryItem key={membership.group.slug} membershipHistory={membership} />
        ))}
      </Box>
    </Pagination>
  );
};

const ProfileMemberships = () => (
  <Stack gap={1}>
    <Typography variant='h3'>Aktive medlemskap</Typography>
    <Memberships />
    <Divider />
    <Typography variant='h3'>Tidligere medlemskap</Typography>
    <MembershipHistories />
  </Stack>
);

export default ProfileMemberships;
