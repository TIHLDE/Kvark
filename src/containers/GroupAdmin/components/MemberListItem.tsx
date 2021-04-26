import { Box, Button, Collapse, Divider, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import Paper from 'components/layout/Paper';
import { useState } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreRounded';
import ExpandLessIcon from '@material-ui/icons/ExpandLessRounded';
import { User } from 'types/Types';
import { getUserClass, getUserStudyShort } from 'utils';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import StarIcon from '@material-ui/icons/Star';
import classNames from 'classnames';
import { useDeleteMembership, useUpdateMembership } from 'api/hooks/Membership';
import useSnackbar from 'api/hooks/Snackbar';
import { MembershipType } from 'types/Enums';
import Dialog from 'components/layout/Dialog';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  button: {
    textTransform: 'none',
  },
  gutterBottom: {
    marginBottom: theme.spacing(2),
  },
}));

type MemberListItemProps = {
  user: User;
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
    <Paper className={classes.root} noPadding>
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
        <ListItemText primary={`${user.first_name} ${user.last_name}`} secondary={`${getUserClass(user.user_class)}. ${getUserStudyShort(user.user_study)}`} />
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItem>
      <Collapse in={expanded}>
        <Divider />
        <Box display='flex' flexDirection='column' padding={1}>
          <Button
            className={classNames(classes.button, classes.gutterBottom)}
            fullWidth
            onClick={() => setConfirmDeleteModal(true)}
            size='large'
            startIcon={<HighlightOffIcon />}
            variant='outlined'>
            Fjern medlem
          </Button>
          <Button className={classes.button} fullWidth onClick={() => setConfirmSwitchLeader(true)} size='large' startIcon={<StarIcon />} variant='outlined'>
            Promoter til leder
          </Button>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default MemberListItem;
