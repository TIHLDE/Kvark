import { Paper as MuiPaper, PaperProps as MuiPaperProps, styled, Theme } from '@mui/material';

export type PaperProps = MuiPaperProps & {
  noBorder?: boolean;
  noPadding?: boolean;
  noOverflow?: boolean;
  bgColor?: keyof Theme['palette']['background'];
};

const Paper = styled(MuiPaper, {
  shouldForwardProp: (prop) => prop !== 'noBorder' && prop !== 'noPadding' && prop !== 'noOverflow' && prop !== 'bgColor',
})<PaperProps>(({ theme, noBorder, noPadding, noOverflow, bgColor }) => ({
  ...(!noPadding && { padding: theme.spacing(3) }),
  ...(!noBorder && { border: `${theme.palette.borderWidth} solid ${theme.palette.divider}` }),
  ...(noOverflow && { overflow: 'hidden' }),
  background: theme.palette.background[bgColor || 'paper'],
}));

export default Paper;
