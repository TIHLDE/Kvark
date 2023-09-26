import { Box, Typography } from '@mui/material';

import WrappedSchaffold from '../WrappedSchaffold';

const Dots = () => {
  return (
    <WrappedSchaffold spacing='medium' variant='vertical'>
      <Typography sx={{ width: '90%' }} textTransform={'uppercase'} variant='h2'>
        I løpet av semesteret har du fått
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Typography fontSize={70} variant='h2'>
          15
        </Typography>
        <Typography textTransform={'uppercase'} variant='h2'>
          Prikker
        </Typography>
      </Box>

      <Typography fontSize={20} textAlign={'center'} textTransform={'uppercase'} variant='h2'>
        Oida.
      </Typography>
    </WrappedSchaffold>
  );
};

export default Dots;
