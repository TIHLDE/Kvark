import { Divider, Typography } from '@mui/material';

import { useFetchWrapped } from 'hooks/Wrapped';

import Page from 'components/navigation/Page';

import Player from './components/Player';

/**
 * Fetch all statistics within this file as well.
 */

const Wrapped = () => {
  const { data, isLoading } = useFetchWrapped(new Date().getFullYear());
  return (
    <Page options={{ gutterTop: true }}>
      {isLoading ? 'Laster inn TIHLDE WRAPPED!' : <Player data={data} />}

      <Divider
        sx={{
          my: 3,
        }}
      />
      <Typography gutterBottom variant='h2'>
        Hva er TIHLDE Wrapped?
      </Typography>
      <Typography>TIHLDE Wrapped er en oppsummering av semesteret som har vært.</Typography>
    </Page>
  );
};

export default Wrapped;
