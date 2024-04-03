import { ListItem, ListItemAvatar, ListItemButton, ListItemText, Skeleton, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';

import { Group } from 'types';

import { useGroup } from 'hooks/Group';
import { useMemberships } from 'hooks/Membership';
import { useIsAuthenticated } from 'hooks/User';

import AddGroupMember from 'pages/Groups/about/AddGroupMember';
import MembershipListItem from 'pages/Groups/about/MembershipListItem';

import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Button } from 'components/ui/button';

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

  return (
    <div className='space-y-4'>
      {leader && (
        <div className='space-y-2'>
            <h1 className='text-xl font-semibold'>
              Leder:
            </h1>
            <Button asChild className='bg-inherit flex justify-start w-full py-8' variant='outline'>
              <Link className='flex items-center space-x-4' to={`${URLS.profile}${leader.user_id}/`}>
                <Avatar>
                    <AvatarImage alt={leader.first_name} src={leader.image} />
                    <AvatarFallback>{leader.first_name[0] + leader.last_name[0]}</AvatarFallback>
                </Avatar>
                <h1 >
                  {`${leader.first_name} ${leader.last_name}`}
                </h1>
              </Link>
            </Button>
        </div>
      )}

      {isAuthenticated && (
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <h1 className='text-xl font-semibold'>
              Medlemmer:
            </h1>
            {hasWriteAcccess && <AddGroupMember groupSlug={groupSlug} />}
          </div>
          <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} label='Last flere medlemmer' nextPage={() => fetchNextPage()}>
            <div className='space-y-2'>
              {memberships.map((membership) => (
                <MembershipListItem isAdmin={hasWriteAcccess} key={membership.user.user_id} membership={membership} />
              ))} 
            </div>
            {!memberships.length && <NotFoundIndicator header='Denne gruppen har ingen medlemmer' />}
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default MembersCard;
