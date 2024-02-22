import { Box, Typography } from '@mui/material';
import CountUp from 'react-countup';

import WrappedSchaffold from '../WrappedSchaffold';
import { fadeIn, spinIn, zoomIn } from './utils/animations';
import { MainSlideProps } from './utils/types';

const Dots = ({ data }: MainSlideProps) => {
  const dots = data?.dots_received ?? 0;
  const dotsPerc = data?.dots_percentile ?? 0;

  return (
    <WrappedSchaffold spacing='large' variant='vertical'>
      <Typography
        sx={{
          animation: `${spinIn} 1s ease-in-out`,
        }}
        textTransform={'uppercase'}
        variant='h2'>
        Dessuten har du
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          animation: `${zoomIn} 500ms ease-in-out .5s both`,
        }}>
        <Typography fontSize={70} variant='h2'>
          <CountUp duration={5} end={dots} start={100} />
        </Typography>
        <Typography textTransform={'uppercase'} variant='h2'>
          {dots === 0 || dots > 1 ? 'Nye prikker' : 'Ny prikk'}
        </Typography>
      </Box>
      <Typography
        fontSize={20}
        sx={{
          animation: `${fadeIn} 500ms ease-in-out 5s both`,
        }}
        textTransform={'uppercase'}
        variant='h2'>
        {dotsPerc > 0.6
          ? `Av 100 TIHLDE-medlemmer er altså ${Math.round(dotsPerc * 100)} av dem bedre til å følge arrangementsreglene enn det du er.`
          : `Av 100 TIHLDE-medlemmer tar du arrangementer mer seriøst enn ${Math.round(100 - dotsPerc * 100)} av dem. Du er en engel 😇`}
      </Typography>
    </WrappedSchaffold>
  );
};

export default Dots;
