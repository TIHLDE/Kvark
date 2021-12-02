import { useState } from 'react';
import { useDeleteMembership, useUpdateMembership } from 'hooks/Membership';
import { useSnackbar } from 'hooks/Snackbar';
import { MembershipType } from 'types/Enums';

import { Button, Collapse, Divider, ListItem, ListItemText, ListItemAvatar, Grid, Typography } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';
import { UserList } from 'types';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import StarIcon from '@mui/icons-material/Star';

import Paper from 'components/layout/Paper';
import Dialog from 'components/layout/Dialog';
import Avatar from 'components/miscellaneous/Avatar';
import { getUserClass, getUserStudyShort } from 'utils';

export type MemberListItemProps = {
  user: UserList;
  slug: string;
};

const MemberListItem = ({ slug, user }: MemberListItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const deleteMembership = useDeleteMembership(slug, user.user_id);
  const updateMembership = useUpdateMembership(slug, user.user_id);
  const showSnackbar = useSnackbar();
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [confirmSwitchLeader, setConfirmSwitchLeader] = useState(false);
  const handleClose = () => {
    setConfirmDeleteModal(false);
    setConfirmSwitchLeader(false);
  };

  const removeMemberFromGroup = () => {
    deleteMembership.mutate(null, {
      onSuccess: (data) => {
        showSnackbar(data.detail, 'success');
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  const promoteUserToLeader = () => {
    updateMembership.mutate(MembershipType.LEADER, {
      onSuccess: () => {
        showSnackbar('Brukeren ble promotert til leder', 'success');
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  return (
    <Paper noOverflow noPadding>
      <Dialog
        onClose={handleClose}
        onConfirm={removeMemberFromGroup}
        open={confirmDeleteModal}
        titleText={`Fjern ${user.first_name} ${user.last_name} fra gruppen?`}
      />
      <Dialog
        onClose={handleClose}
        onConfirm={promoteUserToLeader}
        open={confirmSwitchLeader}
        titleText={`Promoter ${user.first_name} ${user.last_name} til leder?`}
      />
      <ListItem button onClick={() => setExpanded((prev) => !prev)}>
        <ListItemAvatar>
          <Avatar user={user} />
        </ListItemAvatar>
        <ListItemText primary={`${user.first_name} ${user.last_name}`} />
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItem>
      <Collapse in={expanded}>
        <Typography sx={{ whiteSpace: 'break-spaces', p: 2 }}>
          {`Allergier: ${user.allergy ? user.allergy : 'Har ingen allergier'}
E-post: ${user.email}
${getUserClass(user.user_class)} - ${getUserStudyShort(user.user_study)}`}
        </Typography>
        <Divider />
        <Grid container spacing={1} sx={{ p: 1 }}>
          <Grid item lg={6} xs={12}>
            <Button fullWidth onClick={() => setConfirmSwitchLeader(true)} startIcon={<StarIcon />} variant='outlined'>
              Promoter til leder
            </Button>
          </Grid>
          <Grid item lg={6} xs={12}>
            <Button color='error' fullWidth onClick={() => setConfirmDeleteModal(true)} startIcon={<HighlightOffIcon />} variant='outlined'>
              Fjern medlem
            </Button>
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default MemberListItem;
