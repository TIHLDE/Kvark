import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import WrappedViewport from './WrappedViewport';

const Player = () => {
  const [slide, setSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervalCallback = () => {
      setProgress(progress + 1);

      if (progress >= 100) {
        setSlide(slide + 1);
        setProgress(0);
      }
    };

    const interval = setInterval(intervalCallback, 70);

    return () => {
      window.clearInterval(interval);
    };
  }, [progress]);

  const incrementSlide = () => {
    setSlide(slide + 1);
  };

  const decrementSlide = () => {
    if (slide < 1) {
      return;
    }
    setSlide(slide - 1);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        width: 'fit-content',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
        position: 'relative',
      }}>
      <IconButton
        onClick={decrementSlide}
        sx={{
          ':hover': {
            transform: 'translateX(-.1rem)',
          },
          transition: 'transform 150ms ease-in-out',
        }}>
        <ArrowBack />
      </IconButton>
      <WrappedViewport percentage={progress} slide={slide} />
      <IconButton
        onClick={incrementSlide}
        sx={{
          ':hover': {
            transform: 'translateX(.1rem)',
          },
          transition: 'transform 150ms ease-in-out',
        }}>
        <ArrowForward />
      </IconButton>
    </Box>
  );
};

export default Player;
