import { Grid, Stack, Typography } from '@mui/material';

import { Reaction } from 'types';

import Paper from 'components/layout/Paper';

import Avatar from '../Avatar';

export const ReactionListItem = (reaction: Reaction) => {
  return (
    <Paper sx={{ padding: 2, marginY: 1 }}>
      <Stack alignItems={'center'} direction={'row'} gap={2}>
        <Grid item>
          <Avatar user={reaction.user} />
        </Grid>
        <Grid item>
          <Typography>
            {reaction.user?.first_name} {reaction.user?.last_name}
          </Typography>
        </Grid>
        <Grid item>
          <Typography fontSize={24}>{reaction.emoji}</Typography>
        </Grid>
      </Stack>
    </Paper>
  );
};
