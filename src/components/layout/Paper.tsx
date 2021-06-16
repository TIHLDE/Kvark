import { ReactNode } from 'react';
import MaterialPaper from '@material-ui/core/Paper';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  border: {
    border: theme.palette.borderWidth + ' solid ' + theme.palette.divider,
  },
  padding: {
    padding: theme.spacing(3),
  },
}));

export type PaperProps = {
  children: ReactNode;
  noBorder?: boolean;
  noPadding?: boolean;
  className?: string;
};

const Paper = ({ noBorder, noPadding, children, className }: PaperProps) => {
  const classes = useStyles();
  return (
    <MaterialPaper className={classnames(!noBorder && classes.border, !noPadding && classes.padding, className)} elevation={0}>
      {children}
    </MaterialPaper>
  );
};

export default Paper;
