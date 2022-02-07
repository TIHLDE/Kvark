import Delete from '@mui/icons-material/DeleteRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import { Collapse, Divider, ListItem, ListItemButton, ListItemProps, ListItemText, Stack, Typography } from '@mui/material';
import { parseISO } from 'date-fns';
import { useState } from 'react';
import { formatDate } from 'utils';

import { Strike, UserBase } from 'types';

import { useDeleteStrike } from 'hooks/Strike';
import { useUserPermissions } from 'hooks/User';

import Paper from 'components/layout/Paper';
import VerifyDialog from 'components/layout/VerifyDialog';
import EventListItem from 'components/miscellaneous/EventListItem';

export type StrikeProps = {
  strike: Strike;
  user: UserBase;
  displayUserInfo?: boolean;
} & ListItemProps;

const StrikeListItem = ({ strike, user, displayUserInfo = false, ...props }: StrikeProps) => {
  const { data: permissions } = useUserPermissions();
  const deleteStrike = useDeleteStrike(user.user_id);
  const [expanded, setExpanded] = useState(false);
  const deleteHandler = () => deleteStrike.mutate(strike.id);
  const primaryText = displayUserInfo ? `${user.first_name} ${user.last_name}` : strike.description;
  return (
    <Paper noOverflow noPadding>
      <ListItem dense disablePadding {...props}>
        <ListItemButton onClick={() => setExpanded((prev) => !prev)}>
          <Typography sx={{ fontWeight: 'bold', ml: 0.5, mr: 2 }} variant='h3'>
            {strike.strike_size}
          </Typography>
          <ListItemText primary={primaryText} secondary={`Utløper ${formatDate(parseISO(strike.expires_at))}`} />
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
      </ListItem>
      <Collapse in={expanded}>
        <Divider />
        <Stack gap={1} sx={{ p: 2 }}>
          <div>
            {permissions?.permissions.strike.read && Boolean(strike.creator) && (
              <Typography variant='subtitle2'>{`Opprettet av: ${strike.creator?.first_name} ${strike.creator?.last_name}`}</Typography>
            )}
            <Typography variant='subtitle2'>{`Opprettet: ${formatDate(parseISO(strike.created_at))}`}</Typography>
            {displayUserInfo && <Typography variant='subtitle2'>{`Begrunnelse: ${strike.description}`}</Typography>}
          </div>
          {strike.event !== undefined && <EventListItem event={strike.event} />}
          {permissions?.permissions.strike.destroy && (
            <VerifyDialog color='error' contentText={`Er du sikker på at du vil slette denne prikken?`} onConfirm={deleteHandler} startIcon={<Delete />}>
              Slett prikk
            </VerifyDialog>
          )}
        </Stack>
      </Collapse>
    </Paper>
  );
};

export default StrikeListItem;
