import { Button, makeStyles, Typography } from '@material-ui/core';
import Banner from 'components/layout/Banner';
import Paper from 'components/layout/Paper';
import { Skeleton } from '@material-ui/lab';
import Navigation from 'components/navigation/Navigation';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import Http404 from 'containers/Http404';
import { useGroup } from 'api/hooks/Group';
import { useMemberships } from 'api/hooks/Membership';
import { useState } from 'react';
import UpdateGroupModal from 'containers/GroupAdmin/components/UpdateGroupModal';
import MemberListItem from 'containers/GroupAdmin/components/MemberListItem';
import AddMemberModal from './components/AddMemberModal';
import MembersCard from 'containers/Pages/specials/Index/MembersCard';

const useStyles = makeStyles((theme) => ({
  gutterBottom: {
    marginBottom: theme.spacing(2),
  },
  button: {
    textTransform: 'none',
  },
}));

const Group = () => {
  const classes = useStyles();
  const { slug: slugParameter } = useParams();
  const slug = slugParameter.toLowerCase();

  const [updateGroupModalIsOpen, setUpdateGroupModalIsOpen] = useState(false);
  const [addMemberModalIsOpen, setAddMemberModalIsOpen] = useState(false);

  const { data, isLoading: isLoadingGroups, isError } = useGroup(slug);

  const hasWriteAcccess = Boolean(data?.permissions.write);

  const { data: membersData, isLoading: isLoadingMembers } = useMemberships(slug);
  if (isError) {
    return <Http404 />;
  }

  const members = membersData?.filter((memberObject) => memberObject.membership_type === 'MEMBER').map((member) => member.user);
  const membersSorted = members?.sort((a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`));
  return (
    <Navigation banner={<Banner title={data?.name} />} fancyNavbar>
      <Helmet>
        <title>{data?.name}</title>
      </Helmet>
      {isLoadingGroups || isLoadingMembers || !data || !membersSorted ? (
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
          <UpdateGroupModal group={data} handleClose={() => setUpdateGroupModalIsOpen(false)} modalIsOpen={updateGroupModalIsOpen} />
          <AddMemberModal groupSlug={slug} handleClose={() => setAddMemberModalIsOpen(false)} modalIsOpen={addMemberModalIsOpen} />
          <Paper className={classes.gutterBottom}>
            <Typography gutterBottom variant='subtitle1'>
              {data?.description}
            </Typography>
            <Typography gutterBottom variant='subtitle1'>
              <b>Kontakt: </b> {data?.contact_email}
            </Typography>
            {hasWriteAcccess && (
              <Button color='primary' onClick={() => setUpdateGroupModalIsOpen(true)} startIcon={<EditIcon />} variant='contained'>
                Rediger gruppe
              </Button>
            )}
          </Paper>
          {hasWriteAcccess ? (
            <Paper className={classes.gutterBottom}>
              {data?.leader && (
                <Typography gutterBottom variant='subtitle1'>
                  <b>Leder: </b> {data.leader.first_name} {data.leader.last_name} 👑
                </Typography>
              )}
              <Typography gutterBottom variant='subtitle1'>
                <b>Medlemmer:</b>
              </Typography>
              {membersSorted.map((member) => (
                <MemberListItem key={member.user_id} slug={slug} user={member} />
              ))}
              <Button color='primary' onClick={() => setAddMemberModalIsOpen(true)} startIcon={<AddIcon />} variant='contained'>
                Legg til medlem
              </Button>
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
