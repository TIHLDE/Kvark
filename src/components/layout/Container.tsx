import { forwardRef, Ref } from 'react';
import classnames from 'classnames';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import MuiContainer, { ContainerProps as MuiContainerProps } from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down('sm')]: {
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
    },
  },
}));

export type ContainerProps = MuiContainerProps;

const Container = forwardRef(function Container({ className, children, maxWidth = 'xl', ...props }: ContainerProps, ref: Ref<HTMLDivElement>) {
  const classes = useStyles();
  return (
    <MuiContainer className={classnames(classes.container, className)} maxWidth={maxWidth} ref={ref} {...props}>
      {children}
    </MuiContainer>
  );
});

export default Container;
