import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { MembershipType } from 'types/Enums';
import { useGroup } from 'api/hooks/Group';
import { useMemberships } from 'api/hooks/Membership';

// Material UI
import { makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

// Project components
import Http404 from 'containers/Http404';
import Navigation from 'components/navigation/Navigation';
import Banner from 'components/layout/Banner';
import Paper from 'components/layout/Paper';
import UpdateGroupModal from 'containers/GroupAdmin/components/UpdateGroupModal';
import MemberListItem from 'containers/GroupAdmin/components/MemberListItem';
import AddMemberModal from 'containers/GroupAdmin/components/AddMemberModal';
import MembersCard from 'containers/Pages/specials/Index/MembersCard';

const useStyles = makeStyles((theme) => ({
  gutterBottom: {
    marginBottom: theme.spacing(2),
  },
  list: {
    display: 'grid',
    gap: theme.spacing(1),
  },
}));

const Group = () => {
  const classes = useStyles();
  const { slug: slugParameter } = useParams();
  const slug = slugParameter.toLowerCase();
  const { data: membersData, isLoading: isLoadingMembers } = useMemberships(slug);
  const { data, isLoading: isLoadingGroups, isError } = useGroup(slug);

  const hasWriteAcccess = Boolean(data?.permissions.write);

  if (isError) {
    return <Http404 />;
  }

  if (isLoadingGroups || !data) {
    return <Navigation isLoading />;
  }

  const members = membersData?.filter((memberObject) => memberObject.membership_type === MembershipType.MEMBER).map((member) => member.user) || [];
  const membersSorted = members.sort((a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`));

  return (
    <Navigation
      banner={
        <Banner
          text={`${data.description}
              ${
                data.contact_email
                  ? `<br><span>
                    Kontakt: <a href='mailto:${data.contact_email}'>${data.contact_email}</a>
                  </span>`
                  : ''
              }`}
          title={data.name}>
          {hasWriteAcccess && <UpdateGroupModal group={data} />}
        </Banner>
      }
      fancyNavbar>
      <Helmet>
        <title>{data.name}</title>
      </Helmet>
      {isLoadingMembers || !membersSorted ? (
        <>
          <Paper className={classes.gutterBottom}>
            <Skeleton height='100px' variant='rect' />
          </Paper>
          <Paper>
            <Skeleton height='200px' variant='rect' />
          </Paper>
        </>
      ) : (
        <>
          {hasWriteAcccess ? (
            <Paper>
              {data?.leader && (
                <>
                  <Typography gutterBottom variant='h3'>
                    Leder:{' '}
                    <b>
                      {data.leader.first_name} {data.leader.last_name}{' '}
                    </b>{' '}
                  </Typography>
                </>
              )}
              <Typography gutterBottom variant='h3'>
                Medlemmer:
              </Typography>
              <div className={classes.list}>
                {membersSorted.map((member) => (
                  <MemberListItem key={member.user_id} slug={slug} user={member} />
                ))}
                <AddMemberModal groupSlug={slug} />
              </div>
            </Paper>
          ) : (
            <MembersCard slug={slug} />
          )}
        </>
      )}
    </Navigation>
  );
};

export default Group;
