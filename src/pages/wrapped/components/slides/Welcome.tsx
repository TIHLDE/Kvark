import { Box, BoxProps, keyframes, Typography } from '@mui/material';
import { useEffect } from 'react';

import { useConfetti } from 'hooks/Confetti';

import WrappedLogo from '../WrappedLogo';
import WrappedSchaffold from '../WrappedSchaffold';

const slideIn = keyframes`
  0%{
    opacity: 0;
    transform: translateY(1rem);
  }

  100%{
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulsate = keyframes`
    0%{
        transform: scale(1);
    }
    50%{
        transform: scale(1.3);
    }
    100%{
        transform: scale(1);
    }
`;

const Welcome = () => {
  const confetti = useConfetti();

  useEffect(() => {
    confetti.run();
  }, []);

  return (
    <WrappedSchaffold>
      <ColorBlob
        color={'#E916B3'}
        sx={{
          animation: `${pulsate} 4s ease-in-out infinite -1s`,
          margin: 'auto -40% 0 auto',
          inset: 0,
          width: '200%',
        }}
      />
      <ColorBlob
        color={'#164AE9'}
        sx={{
          animation: `${pulsate} 3s ease-in-out infinite`,
          margin: '0 auto auto auto',
          inset: 0,
          width: '200%',
        }}
      />
      <ColorBlob
        color={'#16E94C'}
        sx={{
          animation: `${pulsate} 3s ease-in-out infinite`,
          margin: '-50% auto auto auto',
          inset: 0,
          width: '200%',
        }}
      />
      <ColorBlob
        color={'rgba(0,19,40,1)'}
        sx={{
          animation: `${pulsate} 5s ease-in-out infinite -1.5s`,
          margin: 'auto',
          opacity: '0.5',
          inset: 0,
          width: '90%',
        }}
      />

      <Typography
        letterSpacing={'0.05em'}
        sx={{
          animation: `${slideIn} 400ms ease-in-out 0.5s both`,
        }}
        textTransform={'uppercase'}
        variant='h2'>
        Velkommen til
      </Typography>

      <Box
        sx={{
          animation: `${slideIn} 400ms ease-in-out 0.8s both`,
        }}>
        <WrappedLogo />
      </Box>

      <Typography
        fontSize={20}
        sx={{ zIndex: 10, animation: `${slideIn} 400ms ease-in-out 2s both`, width: '80%' }}
        textAlign={'center'}
        textTransform={'uppercase'}
        variant='h2'>
        Klar til å lære mer om semesteret som har vært?
      </Typography>
    </WrappedSchaffold>
  );
};

interface ColorBlobProps extends BoxProps {
  color: string;
}

const ColorBlob = ({ color, sx, ...props }: ColorBlobProps) => {
  return (
    <Box
      sx={{
        aspectRatio: 1,
        position: 'absolute',
        ...sx,
        background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 64%)`,
      }}
      {...props}
    />
  );
};

export default Welcome;
