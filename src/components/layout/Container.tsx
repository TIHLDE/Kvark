import { Container as MuiContainer, ContainerProps as MuiContainerProps, styled } from '@material-ui/core';

export type ContainerProps = MuiContainerProps;

const Container = styled(MuiContainer)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
}));

export default Container;
