import { useState } from 'react';
import { useDeleteMembership, useUpdateMembership } from 'hooks/Membership';
import { useSnackbar } from 'hooks/Snackbar';
import { MembershipType } from 'types/Enums';

import { Stack, Collapse, Divider, ListItem, ListItemText, ListItemAvatar, Typography } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';
import { UserList } from 'types';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import StarIcon from '@mui/icons-material/Star';

import Paper from 'components/layout/Paper';
import VerifyDialog from 'components/layout/VerifyDialog';
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
        showSnackbar(`${user.first_name} ${user.last_name} ble promotert til leder`, 'success');
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  return (
    <Paper noOverflow noPadding>
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
        <Stack direction={{ xs: 'column', lg: 'row' }} gap={1} sx={{ p: 1 }}>
          <VerifyDialog onConfirm={promoteUserToLeader} startIcon={<StarIcon />} titleText={`Promoter ${user.first_name} ${user.last_name} til leder?`}>
            Promoter til leder
          </VerifyDialog>
          <VerifyDialog
            color='error'
            onConfirm={removeMemberFromGroup}
            startIcon={<HighlightOffIcon />}
            titleText={`Fjern ${user.first_name} ${user.last_name} fra gruppen?`}>
            Fjern medlem
          </VerifyDialog>
        </Stack>
      </Collapse>
    </Paper>
  );
};

export default MemberListItem;
