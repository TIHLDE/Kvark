import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Alert, AlertProps, Box, SvgIconProps, SxProps, Theme, Tooltip, TooltipProps, Typography, TypographyProps } from '@mui/material';
import { useState } from 'react';

import { usePersistedState } from 'hooks/Utils';

export type ShowMoreTextProps = {
  children: TypographyProps['children'];
  variant?: TypographyProps['variant'];
  sx?: SxProps<Theme>;
};

export const ShowMoreText = ({ children, variant = 'caption', sx = [] }: ShowMoreTextProps) => {
  const [showAll, setShowAll] = useState(false);
  return (
    <Box
      component='span'
      onClick={() => setShowAll((prev) => !prev)}
      sx={[{ display: 'grid', gridTemplateColumns: '1fr auto' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Typography sx={showAll ? { whiteSpace: 'break-spaces' } : { overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} variant={variant}>
        {children}
      </Typography>
      {!showAll && (
        <Typography sx={{ ml: 0.5, cursor: 'pointer', color: (theme) => theme.palette.primary.main }} variant={variant}>
          Vis mer
        </Typography>
      )}
    </Box>
  );
};

export type ShowMoreTooltipProps = SvgIconProps & {
  children: TooltipProps['title'];
};

export const ShowMoreTooltip = ({ children, ...props }: ShowMoreTooltipProps) => (
  <Tooltip arrow sx={{ fontSize: 'inherit', ml: 0.5, mb: -0.25 }} title={children}>
    <HelpOutlineRoundedIcon {...props} />
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
