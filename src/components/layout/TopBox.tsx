import { styled } from '@material-ui/core';

export const ProfileTopBox = styled('div')(({ theme }) => ({
  height: 260,
  background: 'radial-gradient(circle at bottom, ' + theme.palette.colors.gradient.profile.top + ', ' + theme.palette.colors.gradient.profile.bottom + ')',
}));

export const PrimaryTopBox = styled('div')(({ theme }) => ({
  height: 220,
  background: theme.palette.colors.gradient.main.top,
}));

export const SecondaryTopBox = styled('div')(({ theme }) => ({
  height: 220,
  background: `radial-gradient(circle at bottom, ${theme.palette.colors.gradient.secondary.top}, ${theme.palette.colors.gradient.secondary.bottom})`,
}));
