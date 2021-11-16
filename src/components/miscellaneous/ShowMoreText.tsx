import { useState } from 'react';
import { Typography, TypographyProps, Box, Tooltip } from '@mui/material';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';

export type ShowMoreTextProps = {
  children: TypographyProps['children'];
};

export const ShowMoreText = ({ children }: ShowMoreTextProps) => {
  const [showAll, setShowAll] = useState(false);
  return (
    <Box component='span' onClick={() => setShowAll((prev) => !prev)} sx={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
      <Typography sx={showAll ? undefined : { overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} variant='caption'>
        {children}
      </Typography>
      {!showAll && (
        <Typography sx={{ ml: 0.5, cursor: 'pointer', color: (theme) => theme.palette.primary.main }} variant='caption'>
          Vis mer
        </Typography>
      )}
    </Box>
  );
};

export type ShowMoreTooltipProps = {
  children: string;
};

export const ShowMoreTooltip = ({ children }: ShowMoreTooltipProps) => (
  <Tooltip sx={{ fontSize: 'inherit', ml: 0.5, mb: -0.25 }} title={children}>
    <HelpOutlineRoundedIcon />
  </Tooltip>
);
