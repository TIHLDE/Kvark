import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import StarIcon from '@mui/icons-material/Star';
import { Collapse, Divider, IconButton, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import { parseISO } from 'date-fns';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate, getUserAffiliation } from 'utils';

import { Membership, UserList } from 'types';
import { MembershipType } from 'types/Enums';

import { useDeleteMembership, useUpdateMembership } from 'hooks/Membership';
import { useSnackbar } from 'hooks/Snackbar';

import Paper from 'components/layout/Paper';
import VerifyDialog from 'components/layout/VerifyDialog';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';

export type MembershipListItemProps = {
  membership: Membership;
  isAdmin?: boolean;
};

const MembershipListItem = ({ membership, isAdmin }: MembershipListItemProps) => {
  const user = membership.user as UserList;
  const [expanded, setExpanded] = useState(false);
  const deleteMembership = useDeleteMembership(membership.group.slug, user.user_id);
  const updateMembership = useUpdateMembership(membership.group.slug, user.user_id);
  const showSnackbar = useSnackbar();

  const removeMemberFromGroup = () =>
    deleteMembership.mutate(null, {
      onSuccess: (data) => showSnackbar(data.detail, 'success'),
      onError: (e) => showSnackbar(e.detail, 'error'),
    });

  const promoteUserToLeader = () =>
    updateMembership.mutate(MembershipType.LEADER, {
      onSuccess: () => showSnackbar(`${user.first_name} ${user.last_name} ble promotert til leder`, 'success'),
      onError: (e) => showSnackbar(e.detail, 'error'),
    });

  return (
    <Paper noOverflow noPadding>
      <ListItem
        disablePadding
        secondaryAction={isAdmin && <IconButton onClick={() => setExpanded((prev) => !prev)}>{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>}>
        <ListItemButton component={Link} to={`${URLS.profile}${user.user_id}/`}>
          <ListItemAvatar>
            <Avatar>
              <AvatarImage alt={user.first_name} src={user.image} />
              <AvatarFallback>{user.first_name[0] + user.last_name[0]}</AvatarFallback>
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${user.first_name} ${user.last_name}`}
            secondary={`${formatDate(parseISO(membership.created_at), { time: false, fullMonth: true })} -> nå`}
          />
        </ListItemButton>
      </ListItem>
      <Collapse in={expanded && isAdmin} mountOnEnter>
        <Typography sx={{ whiteSpace: 'break-spaces', p: 2 }}>
          {`Allergier: ${user.allergy ? user.allergy : 'Har ingen allergier'}
E-post: ${user.email}
${getUserAffiliation(user)}`}
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

export default MembershipListItem;
