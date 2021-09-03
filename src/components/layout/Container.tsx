import { Container as MuiContainer, ContainerProps as MuiContainerProps, styled } from '@mui/material';

export type ContainerProps = MuiContainerProps;

const Container = styled(MuiContainer)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  [theme.breakpoints.down('lg')]: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
  [theme.breakpoints.down('md')]: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
}));

export default Container;
