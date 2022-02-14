import { styled } from '@mui/material';

export const PrimaryTopBox = styled('div')(({ theme }) => ({
  height: 160,
  background: theme.palette.colors.gradient.main.top,
}));

export const SecondaryTopBox = styled('div')(({ theme }) => ({
  height: 160,
  background: `radial-gradient(circle at bottom, ${theme.palette.colors.gradient.secondary.top}, ${theme.palette.colors.gradient.secondary.bottom})`,
}));
