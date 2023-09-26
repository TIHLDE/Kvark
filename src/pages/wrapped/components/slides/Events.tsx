import { Box, Typography } from '@mui/material';

import WrappedSchaffold from '../WrappedSchaffold';

const Events = () => {
  return (
    <WrappedSchaffold spacing='large' variant='vertical'>
      <Typography textTransform={'uppercase'} variant='h2'>
        Du har deltatt på
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
          69
        </Typography>
        <Typography textTransform={'uppercase'} variant='h2'>
          Arrangementer
        </Typography>
      </Box>

      <Typography fontSize={20} textAlign={'center'} textTransform={'uppercase'} variant='h2'>
        Det er mer enn 99% av alle TIHLDEs medlemmer! 📈
      </Typography>
    </WrappedSchaffold>
  );
};

export default Events;
