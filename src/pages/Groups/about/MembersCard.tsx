import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { UserBase, UserList } from 'types';
import URLS from 'URLS';
import { useGroup } from 'hooks/Group';
import { useMemberships } from 'hooks/Membership';

import { ListItem, ListItemButton, ListItemText, ListItemAvatar, Typography, Skeleton, Stack } from '@mui/material';

import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import Avatar from 'components/miscellaneous/Avatar';
import MemberListItem from 'pages/Groups/about/MemberListItem';
import AddGroupMember from 'pages/Groups/about/AddGroupMember';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

export type MembersCardProps = {
  slug: string;
  showAdmin?: boolean;
};

const MembersCard = ({ slug, showAdmin = false }: MembersCardProps) => {
  const { data, hasNextPage, fetchNextPage, isLoading, isFetching } = useMemberships(slug, { onlyMembers: true });
  const members = useMemo(() => (data !== undefined ? data.pages.map((page) => page.results).flat(1) : []), [data]);
  const { data: group } = useGroup(slug);
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

  type PersonProps = {
    user: UserBase;
  };

  const Person = ({ user }: PersonProps) => (
    <ListItem component={Paper} disablePadding noOverflow noPadding>
      <ListItemButton component={Link} to={`${URLS.profile}${user.user_id}/`}>
        <ListItemAvatar>
          <Avatar user={user} />
        </ListItemAvatar>
        <ListItemText primary={`${user.first_name} ${user.last_name}`} />
      </ListItemButton>
    </ListItem>
  );

  return (
    <>
      <Stack gap={2}>
        {leader && (
          <Stack gap={1}>
            <Typography variant='h3'>Leder:</Typography>
            <Person user={leader} />
          </Stack>
        )}
        <Stack gap={1}>
          <Stack alignItems='center' direction='row' gap={1} justifyContent='space-between'>
            <Typography variant='h3'>Medlemmer:</Typography>
            {hasWriteAcccess && showAdmin && <AddGroupMember groupSlug={slug} />}
          </Stack>
          <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} label='Last flere medlemmer' nextPage={() => fetchNextPage()}>
            <Stack gap={1}>
              {members.map((member) =>
                hasWriteAcccess && showAdmin ? (
                  <MemberListItem key={member.user.user_id} slug={group.slug} user={member.user as UserList} />
                ) : (
                  <Person key={member.user.user_id} user={member.user} />
                ),
              )}
            </Stack>
            {!members.length && <NotFoundIndicator header='Denne gruppen har ingen medlemmer' />}
          </Pagination>
        </Stack>
      </Stack>
    </>
  );
};

export default MembersCard;
