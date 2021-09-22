import { ReactElement } from 'react';
import { IconButton, Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';

type Modify<T, R> = Omit<T, keyof R> & R;

export type TooltipProps = Modify<
  MuiTooltipProps,
  {
    children?: ReactElement;
  }
>;

const Tooltip = (props: TooltipProps) => (
  <MuiTooltip arrow={true} placement='top' {...props}>
    <IconButton>
      <HelpOutline />
    </IconButton>
  </MuiTooltip>
);

export default Tooltip;
