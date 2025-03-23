import { useMemo } from 'react';
import { PaginateButton } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { useGroup } from '~/hooks/Group';
import { useMembershipHistories } from '~/hooks/Membership';
import MembershipHistoryListItem from '~/pages/Groups/about/MembershipHistoryListItem';
import type { Group } from '~/types';

export type MembersHistoryCardProps = {
  groupSlug: Group['slug'];
};

const MembersHistoryCard = ({ groupSlug }: MembersHistoryCardProps) => {
  const { data, hasNextPage, fetchNextPage, isLoading, isFetching } = useMembershipHistories(groupSlug);
  const prevMemberships = useMemo(() => (data !== undefined ? data.pages.flatMap((page) => page.results) : []), [data]);
  const { data: group } = useGroup(groupSlug);
  const hasWriteAcccess = Boolean(group?.permissions.write);

  if (isLoading) {
    return (
      <div className='space-y-2'>
        <Skeleton className='h-12 w-full' />
        <Skeleton className='h-12 w-full' />
        <Skeleton className='h-12 w-full' />
        <Skeleton className='h-12 w-full' />
        <Skeleton className='h-12 w-full' />
        <Skeleton className='h-12 w-full' />
      </div>
    );
  }

  if (!prevMemberships.length) {
    return null;
  }

  return (
    <div className='space-y-2'>
      {Boolean(data?.pages?.length) && <h1 className='text-xl font-bold'>Medlemshistorikk:</h1>}
      <div className='space-y-2'>
        {prevMemberships.map((membership) => (
          <MembershipHistoryListItem isAdmin={hasWriteAcccess} key={membership.id} membership={membership} />
        ))}
      </div>
      {hasNextPage && <PaginateButton isLoading={isFetching} nextPage={fetchNextPage} />}
    </div>
  );
};

export default MembersHistoryCard;
