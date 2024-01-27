import { Box, BoxProps, CircularProgress } from '@mui/material';
import React from 'react';

import { WrappedStats } from 'types/Wrapped';

import PlaybackBar from './PlaybackBar';
import Events from './slides/Events';
import Fines from './slides/Fines';
import Welcome from './slides/Welcome';

const slides = [Welcome, Events, Fines];

interface WrappedViewportProps extends BoxProps {
  /** The slide number */
  slide: number;

  /** A number between 0 and 100, representing the playback progress of the slide */
  percentage: number;

  /** The full wrapped statistics data object. Each slide must parse
   * out its own relevant information.
   */
  data?: WrappedStats;
}

const WrappedViewport = ({ data, slide, percentage, sx, ...props }: WrappedViewportProps) => {
  const loading = false;
  const Component = slides[Math.min(slide, slides.length - 1)];

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
      {loading ? <CircularProgress /> : <Component data={data} />}
    </Box>
  );
};

export default WrappedViewport;
