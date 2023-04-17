import { Box, ListItemButton, ListItemButtonProps, Skeleton, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import URLS from 'URLS';

import { paidHistory } from 'types';

import Paper from 'components/layout/Paper';

export type PaidItemProps = Pick<ListItemButtonProps, 'sx'> & {
  paidHistory: paidHistory;
};

const PaidItem = ({ paidHistory, sx }: PaidItemProps) => (
  <ListItemButton
    component={Link}
    focusRipple
    sx={{ p: 0, height: '100%', overflow: 'hidden', borderRadius: (theme) => `${theme.shape.borderRadius}px`, ...sx }}
    to={URLS.badges.badge_leaderboard(paidHistory.id)}>
    <Typography sx={{ fontWeight: 'bold' }} variant='h3'>
      {paidHistory.title}
    </Typography>
    <Typography variant='body2'>{paidHistory.description}</Typography>
  </ListItemButton>
);

export default PaidItem;

export const PaidItemLoading = () => (
  <Stack component={Paper} direction='row' gap={1} noOverflow sx={{ width: '100%', p: 1, textAlign: 'start', height: '100%' }}>
    <Skeleton sx={{ borderRadius: (theme) => `${theme.shape.borderRadius}px`, px: 1, width: 80, height: 80 }} variant='rectangular' />
    <Stack>
      <Typography sx={{ fontWeight: 'bold' }} variant='h3'>
        <Skeleton height={35} width={110} />
      </Typography>
      <Typography variant='body2'>
        <Skeleton width={100} />
      </Typography>
      <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }} variant='subtitle2' width={140}>
        <Skeleton />
      </Typography>
    </Stack>
  </Stack>
);
