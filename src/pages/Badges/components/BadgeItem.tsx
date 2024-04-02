import { Skeleton, Stack, Typography } from '@mui/material';
import { ChevronRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';

import { Badge } from 'types';

import Paper from 'components/layout/Paper';
import { Avatar, AvatarImage } from 'components/ui/avatar';
import { Card, CardContent } from 'components/ui/card';

export type BadgeItemProps = {
  badge: Badge;
};

const BadgeItem = ({ badge }: BadgeItemProps) => (
  <Card className='hover:bg-secondary'>
    <CardContent className='p-0'>
      <Link className='flex items-center justify-between p-2 w-full' to={URLS.badges.badge_leaderboard(badge.id)}>
        <div className='flex items-center space-x-4'>
          <Avatar className='w-20 h-20'>
            <AvatarImage alt={badge.title} src={badge.image || ''} />
          </Avatar>
          <div>
            <h1>{badge.title}</h1>
            <h1 className='text-sm'>{badge.description}</h1>
            <h1 className='text-xs italic font-bold mt-2'>
              Ervervet av <span className='text-red-500'>{badge.total_completion_percentage.toFixed(1)}%</span>
            </h1>
          </div>
        </div>
        <ChevronRightIcon className='stroke-[1.5px]' />
      </Link>
    </CardContent>
  </Card>
);

export default BadgeItem;

export const BadgeItemLoading = () => (
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
