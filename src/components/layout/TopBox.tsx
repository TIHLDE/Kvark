import { styled } from '@mui/material';

export const ProfileTopBox = styled('div')(({ theme }) => ({
  height: 240,
  background: 'radial-gradient(circle at bottom, ' + theme.palette.colors.gradient.profile.top + ', ' + theme.palette.colors.gradient.profile.bottom + ')',
}));

export const PrimaryTopBox = styled('div')(({ theme }) => ({
  height: 160,
  background: theme.palette.colors.gradient.main.top,
}));

export const SecondaryTopBox = styled('div')(({ theme }) => ({
  height: 160,
  background: `radial-gradient(circle at bottom, ${theme.palette.colors.gradient.secondary.top}, ${theme.palette.colors.gradient.secondary.bottom})`,
}));
