import { Paper as MuiPaper, PaperProps as MuiPaperProps, styled } from '@material-ui/core';

export type PaperProps = MuiPaperProps & {
  noBorder?: boolean;
  noPadding?: boolean;
  noOverflow?: boolean;
};

const Paper = styled(MuiPaper)<PaperProps>(({ theme, noBorder, noPadding, noOverflow }) => ({
  ...(!noPadding && { padding: theme.spacing(3) }),
  ...(!noBorder && { border: `${theme.palette.borderWidth} solid ${theme.palette.divider}` }),
  ...(noOverflow && { overflow: 'hidden' }),
}));

export default Paper;
