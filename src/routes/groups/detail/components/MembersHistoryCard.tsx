import { Skeleton } from '~/components/ui/skeleton';
import type { Group } from '~/types';

// TODO: Re-add membership history — previously used useMembershipHistories(groupSlug) from ~/hooks/Membership.
// The new query layer (~/api/queries/groups) does not yet have a membership history endpoint.
// The group detail API also does not include a .permissions field.

export type MembersHistoryCardProps = {
  groupSlug: Group['slug'];
};

const MembersHistoryCard = ({ groupSlug: _groupSlug }: MembersHistoryCardProps) => {
  // TODO: Replace with membership history query when available
  const isLoading = false;
  const prevMemberships: never[] = [];

  if (isLoading) {
    return (
      <div className='space-y-2'>
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
      <h1 className='text-xl font-bold'>Medlemshistorikk:</h1>
      {/* TODO: Re-add membership history list items when query is available */}
    </div>
  );
};

export default MembersHistoryCard;
