import { useQuery } from '@tanstack/react-query';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import { Skeleton } from '~/components/ui/skeleton';
import { getGroupBySlugQuery, getGroupMembersQuery } from '~/api/queries/groups';
import type { Group } from '~/types';

import AddGroupMember from './AddGroupMember';
// TODO: Re-add MembershipListItem when member data includes user details

// TODO: Re-add auth protection — previously used useIsAuthenticated() from ~/hooks/User
// TODO: Re-add pagination — previously used useMemberships infinite query from ~/hooks/Membership
// TODO: The new API schema returns members as an array, not a paginated object with .results.
//       The group detail also doesn't include .permissions or .leader fields.

export type MembersCardProps = {
  groupSlug: Group['slug'];
};

const MembersCard = ({ groupSlug }: MembersCardProps) => {
  const { data: group } = useQuery(getGroupBySlugQuery(groupSlug));
  const { data: memberships, isLoading } = useQuery(getGroupMembersQuery(groupSlug, 0, {}, 100));
  // TODO: Re-add permissions check when API supports it
  const hasWriteAccess = false;

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

  const membersList = memberships ?? [];

  return (
    <>
      <div className='space-y-4'>
        {/* TODO: Re-add leader display when API includes leader field */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <h1 className='text-xl font-bold'>Medlemmer:</h1>
            {hasWriteAccess && <AddGroupMember groupSlug={groupSlug} />}
          </div>
          <div className='space-y-2'>
            {membersList.map((membership: { userId: string; groupSlug: string; role: string; createdAt: string; updatedAt: string }) => (
              <div key={membership.userId} className='flex items-center space-x-2 p-4 border rounded-md bg-card'>
                <p>{membership.userId} - {membership.role}</p>
              </div>
            ))}
          </div>
          {!membersList.length && <NotFoundIndicator header='Denne gruppen har ingen medlemmer' />}
        </div>
      </div>
    </>
  );
};

export default MembersCard;
