import { useState } from 'react';
import { parseISO } from 'date-fns';
import { Strike } from 'types';
import { formatDate } from 'utils';
import { ListItem, ListItemText, ListItemButton, ListItemProps, Typography, Collapse, Stack, Divider } from '@mui/material';
import Paper from 'components/layout/Paper';
import EventListItem from 'components/miscellaneous/ListItem';

export type StrikeListType = Partial<Strike> & Pick<Strike, 'created_at' | 'creator' | 'description' | 'expires_at' | 'id' | 'strike_size'>;

export type StrikeProps = {
  strike: StrikeListType;
  titleType: 'user_info' | 'description';
} & ListItemProps;

const StrikeListItem = ({ strike, titleType, ...props }: StrikeProps) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Paper noOverflow noPadding>
      <ListItem dense disablePadding secondaryAction={<Typography variant='h3'>{strike.strike_size}</Typography>} {...props}>
        <ListItemButton onClick={() => setExpanded((prev) => !prev)}>
          <ListItemText
            primary={
              titleType === 'user_info' ? `${strike.user?.first_name} ${strike.user?.last_name}` : titleType === 'description' ? strike.description : 'Prikk'
            }
            secondary={`Utløper ${formatDate(parseISO(strike.expires_at))}`}
          />
        </ListItemButton>
      </ListItem>
      <Collapse in={expanded}>
        <Divider />
        <Stack gap={1} sx={{ p: 2 }}>
          <div>
            {titleType !== 'description' && <Typography variant='subtitle2'>{`Begrunnelse: ${strike.description}`}</Typography>}
            {strike.creator !== undefined && (
              <Typography variant='subtitle2'>{`Opprettet av: ${strike.creator.first_name} ${strike.creator.last_name}`}</Typography>
            )}
            <Typography variant='subtitle2'>{`Opprettet: ${formatDate(parseISO(strike.created_at))}`}</Typography>
          </div>
          {strike.event !== undefined && <EventListItem event={strike.event} />}
        </Stack>
      </Collapse>
    </Paper>
  );
};

export default StrikeListItem;
