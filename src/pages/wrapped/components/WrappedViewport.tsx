import { Box, BoxProps, CircularProgress } from '@mui/material';

import PlaybackBar from './PlaybackBar';
import Dots from './slides/Dots';
import Events from './slides/Events';
import Welcome from './slides/Welcome';

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

export default WrappedViewport;
