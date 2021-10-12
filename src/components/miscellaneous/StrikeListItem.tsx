import { Fragment, useState } from 'react';
import { parseISO } from 'date-fns';
import { Strike, UserBase } from 'types';
import { formatDate } from 'utils';
import { useDeleteStrike } from 'hooks/Strike';
import { ListItem, ListItemText, ListItemButton, ListItemProps, Typography, Collapse, Stack, Divider } from '@mui/material';

// Icons
import Delete from '@mui/icons-material/DeleteRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';

import Paper from 'components/layout/Paper';
import VerifyDialog from 'components/layout/VerifyDialog';
import EventListItem from 'components/miscellaneous/ListItem';
export type StrikeProps = {
  strike: Strike;
  user: UserBase;
  /** Should the viewer see edit and delete options? */
  isAdmin?: boolean;
  allStrikes?: boolean;
} & ListItemProps;

const StrikeListItem = ({ strike, user, isAdmin = false, allStrikes = false, ...props }: StrikeProps) => {
  const deleteStrike = useDeleteStrike(user.user_id);
  const [expanded, setExpanded] = useState(false);
  const deleteHandler = () => deleteStrike.mutate(strike.id);
  const primaryText = allStrikes ? `${user.first_name} ${user.last_name}` : strike.description;
  return (
    <Paper noOverflow noPadding>
      <ListItem dense disablePadding {...props}>
        <ListItemButton onClick={() => setExpanded((prev) => !prev)}>
          <Typography sx={{ fontWeight: 'bold', ml: 1, mr: 3 }} variant='h3'>
            {strike.strike_size}
          </Typography>
          {description}
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
      </ListItem>
      <Collapse in={expanded}>
        <Divider />
        <Stack gap={1} sx={{ p: 2 }}>
          <div>
            {allStrikes && (
              <Fragment>
                <Typography variant='subtitle2'>{`Begrunnelse: ${strike.description}`}</Typography>
              </Fragment>
            )}

            {isAdmin && Boolean(strike.creator) && (
              <Typography variant='subtitle2'>{`Opprettet av: ${strike.creator?.first_name} ${strike.creator?.last_name}`}</Typography>
            )}
            <Typography variant='subtitle2'>{`Opprettet: ${formatDate(parseISO(strike.created_at))}`}</Typography>
          </div>
          {strike.event !== undefined && <EventListItem event={strike.event} />}
          {isAdmin && (
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
