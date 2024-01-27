import { Box, keyframes, Typography } from '@mui/material';
import CountUp from 'react-countup';

import WrappedSchaffold from '../WrappedSchaffold';
import { fadeIn } from './utils/animations';
import { MainSlideProps } from './utils/types';

const slideInBackground = keyframes`
  0% {
    height: 0;
  }

  100% {
    height: 4.3rem;
  }
`;

const Events = ({ data }: MainSlideProps) => {
  const events = data?.events_attended ?? 0;
  const eventsPerc = data?.events_percentile ?? 0;

  return (
    <WrappedSchaffold spacing='large' variant='vertical'>
      <Typography
        sx={{
          '::before': {
            content: '""',
            position: 'absolute',
            bottom: '-1rem',
            left: '50%',
            height: 'calc(100% + 2rem)',
            width: 'calc(100% + 2rem)',
            transform: 'translate(-50%, 0)',
            background: '#001328',
            opacity: 0.3,
            borderRadius: '.5rem',
            zIndex: -1,
            animation: `${slideInBackground} 500ms ease-in-out`,
          },
          zIndex: 1,
          position: 'relative',
        }}
        textTransform={'uppercase'}
        variant='h2'>
        <Box
          sx={{
            animation: `${fadeIn} 500ms ease-in-out .2s both`,
          }}>
          Du har deltatt på
        </Box>
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          animation: `${fadeIn} 500ms ease-in-out .5s both`,
        }}>
        <Typography fontSize={70} variant='h2'>
          <CountUp duration={5} end={events} start={200} />
        </Typography>
        <Typography textTransform={'uppercase'} variant='h2'>
          {events === 0 || events > 1 ? 'Arrangementer' : 'Arrangement'}
        </Typography>
      </Box>

      <Typography
        fontSize={20}
        sx={{
          animation: `${fadeIn} 500ms ease-in-out 5s both`,
        }}
        textAlign={'center'}
        textTransform={'uppercase'}
        variant='h2'>
        {eventsPerc < 0.3
          ? `Du er altså blant de ${eventsPerc * 100}% minst ivrige EDBerne. Pytt Pytt..`
          : `
            Det er mer enn ${eventsPerc * 100}% av alle TIHLDEs medlemmer! 📈
            `}
      </Typography>
    </WrappedSchaffold>
  );
};

export default Events;
