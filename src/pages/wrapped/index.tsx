import { Divider, Typography } from '@mui/material';

import Page from 'components/navigation/Page';
import Player from './components/Player';

const Wrapped = () => {
  return (
    <Page options={{ gutterTop: true }}>
      <Player />

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
