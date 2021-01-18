import { ReactNode } from 'react';
import MaterialPaper from '@material-ui/core/Paper';
import classnames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  main: {
    border: theme.palette.borderWidth + ' solid ' + theme.palette.divider,
  },
  padding: {
    padding: theme.spacing(3),
  },
  noBorder: {
    border: 'none',
  },
}));

export type PaperProps = {
  children: ReactNode;
  shadow?: boolean;
  noPadding?: boolean;
  className?: string;
};

const Paper = ({ shadow, noPadding, children, className }: PaperProps) => {
  const classes = useStyles();
  return (
    <MaterialPaper className={classnames(classes.main, !noPadding && classes.padding, shadow && classes.noBorder, className)} elevation={shadow ? 2 : 0}>
      {children}
    </MaterialPaper>
  );
};

export default Paper;
