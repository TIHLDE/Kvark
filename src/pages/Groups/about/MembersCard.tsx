import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { PaginateButton } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { useGroup } from '~/hooks/Group';
import { useMemberships } from '~/hooks/Membership';
import { useIsAuthenticated } from '~/hooks/User';
import AddGroupMember from '~/pages/Groups/about/AddGroupMember';
import MembershipListItem from '~/pages/Groups/about/MembershipListItem';
import type { Group } from '~/types';
import URLS from '~/URLS';
import { useMemo } from 'react';
import { Link } from 'react-router';

export type MembersCardProps = {
  groupSlug: Group['slug'];
};

const MembersCard = ({ groupSlug }: MembersCardProps) => {
  const isAuthenticated = useIsAuthenticated();
  const { data, hasNextPage, fetchNextPage, isLoading, isFetching } = useMemberships(groupSlug, { onlyMembers: true }, { enabled: isAuthenticated });
  const memberships = useMemo(() => (data !== undefined ? data.pages.map((page) => page.results).flat(1) : []), [data]);
  const { data: group } = useGroup(groupSlug);
  const hasWriteAcccess = Boolean(group?.permissions.write);
  const leader = group?.leader;

  if (isLoading || !group) {
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

  return (
    <>
      <div className='space-y-4'>
        {leader && (
          <div className='space-y-2'>
            <h1 className='text-xl font-bold'>Leder:</h1>
            <Link
              className='flex items-center space-x-2 p-4 border rounded-md bg-card hover:bg-secondary text-black dark:text-white'
              to={`${URLS.profile}${leader.user_id}/`}>
              <Avatar>
                <AvatarImage alt={leader.first_name} src={leader.image} />
                <AvatarFallback>{leader.first_name[0] + leader.last_name[0]}</AvatarFallback>
              </Avatar>
              <p>{`${leader.first_name} ${leader.last_name}`}</p>
            </Link>
          </div>
        )}
        {isAuthenticated && (
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <h1 className='text-xl font-bold'>Medlemmer:</h1>
              {hasWriteAcccess && <AddGroupMember groupSlug={groupSlug} />}
            </div>
            <div className='space-y-2'>
              {memberships.map((membership) => (
                <MembershipListItem isAdmin={hasWriteAcccess} key={membership.user.user_id} membership={membership} />
              ))}
            </div>
            {!memberships.length && <NotFoundIndicator header='Denne gruppen har ingen medlemmer' />}
            {hasNextPage && <PaginateButton isLoading={isFetching} nextPage={fetchNextPage} />}
          </div>
        )}
      </div>
    </>
  );
};

export default MembersCard;
