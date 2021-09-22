import { IconButton, Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';

export type TooltipProps = MuiTooltipProps;

const Tooltip = (props: MuiTooltipProps) => (
  <MuiTooltip arrow={true} placement='top' {...props}>
    <IconButton>
      <HelpOutline />
    </IconButton>
  </MuiTooltip>
);

export default Tooltip;
