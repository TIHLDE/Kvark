import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useGroup } from 'hooks/Group';
import { useMemberships } from 'hooks/Membership';
import { useGroupForms } from 'hooks/GroupForms';
import URLS from 'URLS';

// Material UI
import { Skeleton, Typography, List, ListItem, ListItemAvatar, ListItemText, Stack, ListItemButton, Icon, ListItemIcon, Button } from '@mui/material';
import ArrowIcon from '@mui/icons-material/ArrowForwardRounded';

// Project components
import Http404 from 'pages/Http404';
import Page from 'components/navigation/Page';
import Banner from 'components/layout/Banner';
import Paper from 'components/layout/Paper';
import UpdateGroupModal from 'pages/GroupAdmin/components/UpdateGroupModal';
import MemberListItem from 'pages/GroupAdmin/components/MemberListItem';
import AddMemberModal from 'pages/GroupAdmin/components/AddMemberModal';
import MembersCard from 'pages/GroupAdmin/components/MembersCard';
import Pagination from 'components/layout/Pagination';
import Avatar from 'components/miscellaneous/Avatar';
import { UserList } from 'types';
import MembersHistoryCard from 'pages/GroupAdmin/components/MembersHistoryCard';
import Expansion from 'components/layout/Expand';
import { useIsAuthenticated } from 'hooks/User';

const Group = () => {
  const { slug: slugParameter } = useParams<'slug'>();
  const slug = (slugParameter || '-').toLowerCase();
  const { data: membersData, hasNextPage, fetchNextPage, isLoading: isLoadingMembers, isFetching } = useMemberships(slug, { onlyMembers: true });
  const members = useMemo(() => (membersData !== undefined ? membersData.pages.map((page) => page.results).flat(1) : []), [membersData]);
  const { data: formsData, isLoading: isLoadingGroupForms, isFetching: isFetchingGroupForms } = useGroupForms(slug);
  const { data, isLoading: isLoadingGroups, isError } = useGroup(slug);

  const hasWriteAcccess = Boolean(data?.permissions.write);
  const isAuthenticated = useIsAuthenticated();

  if (isError) {
    return <Http404 />;
  }

  if (isLoadingGroups || !data) {
    return null;
  }

  return (
    <Page
      banner={
        <Banner text={`${data.description} \n${data.contact_email ? `Kontakt: ${data.contact_email}` : ''}`} title={data.name}>
          {hasWriteAcccess && <UpdateGroupModal group={data} />}
        </Banner>
      }
      options={{ title: data.name }}>
      {isAuthenticated && (
        <>
          {isLoadingGroupForms ? (
            <Paper sx={{ mb: 2 }}>
              <Stack spacing={1}>
                <Skeleton height={45} width={160} />
              </Stack>
            </Paper>
          ) : (
            <Paper sx={{ mb: 2 }}>
              {formsData !== undefined && formsData.length ? (
                <>
                  <Typography gutterBottom variant='h3'>
                    Gruppeskjemaer
                  </Typography>
                  <Typography sx={{ mb: 2 }} variant='subtitle2'>
                    Her kan du se og svare på skjemaer gruppen har laget for deg.
                  </Typography>
                  <Expansion flat header='Vis alle skjemaer'>
                    <List dense disablePadding>
                      {formsData?.map((form) => (
                        <Paper key={form.id} noOverflow noPadding>
                          <ListItemButton component={Link} to={`${URLS.form}${form.id}/`}>
                            <ListItemText primary={<Typography variant='h3'>{form.title}</Typography>} />
                            <ListItemIcon sx={{ minWidth: 0 }}>
                              <ArrowIcon />
                            </ListItemIcon>
                          </ListItemButton>
                        </Paper>
                      ))}
                    </List>
                  </Expansion>
                </>
              ) : (
                <Typography>Gruppen har ingen tilgjengelige skjemaer</Typography>
              )}
            </Paper>
          )}
        </>
      )}

      {isLoadingMembers ? (
        <Paper sx={{ mb: 2 }}>
          <Stack spacing={1}>
            <Skeleton height={45} width={160} />
            <Skeleton width={120} />
            <Skeleton height={45} width={190} />
            <Skeleton width={140} />
            <Skeleton width={150} />
            <Skeleton width={130} />
            <Skeleton width={160} />
          </Stack>
        </Paper>
      ) : (
        <>
          {hasWriteAcccess ? (
            <Paper sx={{ mb: 2 }}>
              {data?.leader && (
                <>
                  <Typography gutterBottom variant='h3'>
                    Leder:
                  </Typography>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar user={data.leader} />
                    </ListItemAvatar>
                    <ListItemText primary={`${data.leader.first_name} ${data.leader.last_name}`} />
                  </ListItem>
                </>
              )}
              <Typography gutterBottom variant='h3'>
                Medlemmer:
              </Typography>
              <Stack spacing={1}>
                <AddMemberModal groupSlug={slug} />
                <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} label='Last flere medlemmer' nextPage={() => fetchNextPage()}>
                  <Stack spacing={1}>
                    {members.map((member) => (
                      <MemberListItem key={member.user.user_id} slug={slug} user={member.user as UserList} />
                    ))}
                  </Stack>
                </Pagination>
              </Stack>
            </Paper>
          ) : (
            <MembersCard slug={slug} />
          )}
          <MembersHistoryCard slug={slug} />
        </>
      )}
    </Page>
  );
};

export default Group;
