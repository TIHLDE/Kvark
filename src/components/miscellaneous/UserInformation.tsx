import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Alert, AlertProps, Box, SxProps, Theme, Tooltip, TooltipProps, Typography, TypographyProps } from '@mui/material';
import { useState } from 'react';

import { usePersistedState } from 'hooks/Utils';

export type ShowMoreTextProps = {
  children: TypographyProps['children'];
  sx?: SxProps<Theme>;
};

export const ShowMoreText = ({ children, sx = [] }: ShowMoreTextProps) => {
  const [showAll, setShowAll] = useState(false);
  return (
    <Box
      component='span'
      onClick={() => setShowAll((prev) => !prev)}
      sx={[{ display: 'grid', gridTemplateColumns: '1fr auto' }, ...(Array.isArray(sx) ? sx : [sx])]}>
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
  children: TooltipProps['title'];
};

export const ShowMoreTooltip = ({ children }: ShowMoreTooltipProps) => (
  <Tooltip arrow sx={{ fontSize: 'inherit', ml: 0.5, mb: -0.25 }} title={children}>
    <HelpOutlineRoundedIcon />
  </Tooltip>
);

export type AlertOnceProps = AlertProps & {
  cookieKey: string;
  /** How long should the cookie live? Default: 1 year */
  duration?: number;
};

export const AlertOnce = ({ cookieKey, duration = 1000 * 3600 * 24 * 365, children, ...props }: AlertOnceProps) => {
  const [shouldShowAlert, setShouldShowAlert] = usePersistedState(cookieKey, true, duration);

  return (
    <>
      {shouldShowAlert && (
        <Alert {...props} onClose={() => setShouldShowAlert(false)}>
          {children}
        </Alert>
      )}
    </>
  );
};
