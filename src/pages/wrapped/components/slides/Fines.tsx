import { Box, Typography } from '@mui/material';

import WrappedSchaffold from '../WrappedSchaffold';
import { MainSlideProps } from './utils/types';

const Fines = ({ data }: MainSlideProps) => {
  const fines = data?.fines_received ?? 0;
  const finesPerc = data?.fines_percentile ?? 0;
  return (
    <WrappedSchaffold spacing='large' variant='vertical'>
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
          {data?.fines_received}
        </Typography>
        <Typography textTransform={'uppercase'} variant='h2'>
          {fines === 0 || fines > 1 ? 'bøter' : 'bot'}
        </Typography>
      </Box>

      <Typography fontSize={20} textAlign={'center'} textTransform={'uppercase'} variant='h2'>
        {finesPerc < 0.3
          ? `Det var da ikke så mye. Det har seg faktisk sånn at ${(1 - finesPerc) * 100}% av TIHLDEs medlemmer har mer enn deg.`
          : `Akkurat som det skal være! Det er mer enn ${finesPerc * 100}% av alle TIHLDEs medlemmer.`}
      </Typography>
    </WrappedSchaffold>
  );
};

export default Fines;
