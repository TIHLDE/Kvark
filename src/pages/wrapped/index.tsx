import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box, BoxProps, CircularProgress, Divider, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import Page from 'components/navigation/Page';

import Dots from './components/slides/Dots';
import Events from './components/slides/Events';
import Welcome from './components/slides/Welcome';

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

interface PlaybackBarProps extends BoxProps {
  slides: number;
  slide: number;
  percentage: number;
}

const PlaybackBar = ({ percentage, slide, slides, sx, ...props }: PlaybackBarProps) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: '0.5rem',
        height: '1rem',
        gridAutoColumns: 'minmax(0, 1fr)',
        gridTemplateRows: 'auto',
        gridAutoFlow: 'column',
        alignItems: 'center',
        ...sx,
      }}
      {...props}>
      {Array.from({ length: slides }, (_, index) => (
        <Box
          bgcolor={index <= slide ? 'unset' : 'primary.main'}
          key={index}
          sx={{
            background: index === slide ? `linear-gradient(90deg, green ${percentage}%, red ${percentage}%)` : index < slide ? 'green' : 'red',
            borderRadius: 1,
            width: 'auto',
            height: '0.2rem',
            boxSizing: 'unset',
          }}
        />
      ))}
    </Box>
  );
};

const slides = [Welcome, Events, Dots];

interface WrappedViewportProps extends BoxProps {
  /** The slide number */
  slide: number;

  /** A number between 0 and 100, representing the playback progress of the slide */
  percentage: number;
}

const WrappedViewport = ({ slide, percentage, sx, ...props }: WrappedViewportProps) => {
  const loading = false;

  return (
    <Box
      sx={{
        height: '90vh',
        width: 'auto',
        aspectRatio: '9/16',
        borderRadius: 1,
        backgroundColor: '#1D448C',
        justifyContent: 'center',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        ...sx,
      }}
      {...props}>
      <PlaybackBar
        percentage={percentage}
        slide={slide}
        slides={slides.length}
        sx={{
          position: 'absolute',
          top: 0,
          width: '90%',
        }}
      />
      {loading ? <CircularProgress /> : slides[Math.min(slide, slides.length - 1)]()}
    </Box>
  );
};

/**
 * Slides are defined below
 */

export default Wrapped;
