import { Box, BoxProps } from '@mui/material';

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
        zIndex: 2,
        opacity: 0.3,
        ...sx,
      }}
      {...props}>
      {Array.from({ length: slides }, (_, index) => (
        <Box
          bgcolor={index <= slide ? 'unset' : 'primary.main'}
          key={index}
          sx={{
            background: index === slide ? `linear-gradient(90deg, #001328 ${percentage}%, #2c69d8 ${percentage}%)` : index < slide ? '#001328' : '#2c69d8',
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

export default PlaybackBar;
