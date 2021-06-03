import { makeStyles } from '@material-ui/styles';
import { Button, Collapse, Divider, ListItem, ListItemText, ListItemAvatar } from '@material-ui/core';
import Paper from 'components/layout/Paper';
import { useState } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreRounded';
import ExpandLessIcon from '@material-ui/icons/ExpandLessRounded';
import { UserList } from 'types/Types';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import StarIcon from '@material-ui/icons/Star';
import { useDeleteMembership, useUpdateMembership } from 'api/hooks/Membership';
import useSnackbar from 'api/hooks/Snackbar';
import { MembershipType } from 'types/Enums';
import Dialog from 'components/layout/Dialog';
import Avatar from 'components/miscellaneous/Avatar';

const useStyles = makeStyles((theme) => ({
  red: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '&:hover': {
      borderColor: theme.palette.error.light,
    },
  },
  content: {
    display: 'grid',
    padding: theme.spacing(1),
    gap: theme.spacing(1),
    gridTemplateColumns: '1fr 1fr',
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: '1fr',
    },
  },
}));

export type MemberListItemProps = {
  user: UserList;
  slug: string;
};

const MemberListItem = ({ slug, user }: MemberListItemProps) => {
  const classes = useStyles();
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
    <Paper noPadding>
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
        <Divider />
        <div className={classes.content}>
          <Button fullWidth onClick={() => setConfirmSwitchLeader(true)} startIcon={<StarIcon />} variant='outlined'>
            Promoter til leder
          </Button>
          <Button className={classes.red} fullWidth onClick={() => setConfirmDeleteModal(true)} startIcon={<HighlightOffIcon />} variant='outlined'>
            Fjern medlem
          </Button>
        </div>
      </Collapse>
    </Paper>
  );
};

export default MemberListItem;
