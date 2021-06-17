import { forwardRef, Ref } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { Paper as MaterialPaper, PaperProps as MaterialPaperProps } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  border: {
    border: `${theme.palette.borderWidth} solid ${theme.palette.divider}`,
  },
  padding: {
    padding: theme.spacing(3),
  },
}));

export type PaperProps = MaterialPaperProps & {
  noBorder?: boolean;
  noPadding?: boolean;
};

const Paper = forwardRef(function Paper({ noBorder, noPadding, children, className, ...props }: PaperProps, ref: Ref<HTMLDivElement>) {
  const classes = useStyles();
  return (
    <MaterialPaper className={classnames(!noBorder && classes.border, !noPadding && classes.padding, className)} elevation={0} ref={ref} {...props}>
      {children}
    </MaterialPaper>
  );
});

export default Paper;
