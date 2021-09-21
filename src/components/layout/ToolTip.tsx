import Tooltip from '@mui/material/Tooltip';
import { HelpOutline } from '@mui/icons-material';
export type TooltipProps = {
  title: string;
};

const CustomTooltip = ({ title, ...props }: TooltipProps) => {
  return (
    <Tooltip arrow={true} placement='top' title={title} {...props}>
      <HelpOutline />
    </Tooltip>
  );
};

export default CustomTooltip;
