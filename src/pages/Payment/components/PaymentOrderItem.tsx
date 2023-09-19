import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { alpha, Box, Button, ButtonProps, ListItem, ListItemButton, ListItemButtonProps, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import useDimensions from 'react-cool-dimensions';
import { Link } from 'react-router-dom';

import { OrderList } from 'types';

import Paper from 'components/layout/Paper';
import AspectRatioImg from 'components/miscellaneous/AspectRatioImg';

import VIPPSLOGO from 'assets/img/vippsLogo.svg';

type PaymentOrderItemProps = Pick<ListItemButtonProps, 'sx'> & {
  order: OrderList;
};

const PaymentOrderItem = ({ order, sx }: PaymentOrderItemProps) => {
  return (
    <ListItem sx={{ p: 0, height: '100%', overflow: 'hidden', borderRadius: (theme) => `${theme.shape.borderRadius}px`, ...sx }}>
      <Stack component={Paper} direction={'row'} gap={1} noOverflow sx={{ width: '100%', p: 1, textAlign: 'start', height: '100%' }}>
        <Box alt='Vipps logo' component='img' loading='lazy' src={VIPPSLOGO} sx={{ objectFit: 'contain', px: 1, width: 120, height: 60 }} />
        <Stack>
          <Typography sx={{ fontWeight: 'bold' }} variant='h3'>
            {order.event.title}
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', fontStyle: 'italic', fontWeight: 'bold', mt: 0.5 }} variant='subtitle2'>
            Status:{' '}
            <Box component='span' sx={{ color: (theme) => theme.palette.error.main }}>
              {order.status}
            </Box>
          </Typography>
        </Stack>
      </Stack>
    </ListItem>
  );
};

export default PaymentOrderItem;
