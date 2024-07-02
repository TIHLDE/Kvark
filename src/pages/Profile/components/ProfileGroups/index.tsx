import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useUserMembershipHistories, useUserMemberships } from 'hooks/User';

import MembershipHistoryItem, { MembershipHistoryItemLoading } from 'pages/Profile/components/ProfileGroups/MembershipHistoryItem';
import MembershipItem, { MembershipItemLoading } from 'pages/Profile/components/ProfileGroups/MembershipItem';

import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import { PaginateButton } from 'components/ui/button';
import { Separator } from 'components/ui/separator';

const Memberships = () => {
  const { userId } = useParams();
  const { data, isLoading, hasNextPage, isFetching, fetchNextPage } = useUserMemberships(userId);
  const memberships = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <>
      {!isLoading && !memberships.length && (
        <NotFoundIndicator header='Fant ingen medlemskap' subtitle={`${userId ? 'Brukeren' : 'Du'} er ikke medlem av noen grupper`} />
      )}
      {isLoading && <MembershipItemLoading />}
      <div className='grid lg:grid-cols-2 gap-2'>
        {memberships.map((membership) => (
          <MembershipItem key={membership.group.slug} membership={membership} />
        ))}
      </div>
      {hasNextPage && <PaginateButton className='w-full mt-4' isLoading={isFetching} nextPage={fetchNextPage} />}
    </>
  );
};

const MembershipHistories = () => {
  const { userId } = useParams();
  const { data, isLoading, hasNextPage, isFetching, fetchNextPage } = useUserMembershipHistories(userId);
  const membershipHistories = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <>
      {!isLoading && !membershipHistories.length && (
        <NotFoundIndicator header='Fant ingen tidligere medlemskap' subtitle={`${userId ? 'Brukeren' : 'Du'} har ikke vært medlem av noen grupper`} />
      )}
      {isLoading && <MembershipHistoryItemLoading />}
      <div className='grid lg:grid-cols-2 gap-2'>
        {membershipHistories.map((membership) => (
          <MembershipHistoryItem key={membership.group.slug} membershipHistory={membership} />
        ))}
      </div>
      {hasNextPage && <PaginateButton className='w-full mt-4' isLoading={isFetching} nextPage={fetchNextPage} />}
    </>
  );
};

const ProfileMemberships = () => (
  <div className='space-y-6'>
    <div className='space-y-2'>
      <h1 className='text-xl font-semibold'>Aktive medlemskap</h1>
      <Memberships />
    </div>
    <Separator />
    <div className='space-y-2'>
      <h1 className='text-xl font-semibold'>Tidligere medlemskap</h1>
      <MembershipHistories />
    </div>
  </div>
);

export default ProfileMemberships;
