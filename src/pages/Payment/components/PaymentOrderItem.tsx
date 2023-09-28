import { Box, ListItemButton, ListItemButtonProps, Skeleton, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { urlEncode } from 'utils';

import { OrderList } from 'types';
import { OrderPaymentStatus } from 'types/Enums';

import Paper from 'components/layout/Paper';

import VIPPSLOGO from 'assets/img/vippsLogo.svg';

type PaymentOrderItemProps = Pick<ListItemButtonProps, 'sx'> & {
  order: OrderList;
};

const PaymentOrderItem = ({ order, sx }: PaymentOrderItemProps) => {
  const getStatusText = () => {
    switch (order.status) {
      case OrderPaymentStatus.SALE:
        return 'Orderen er betalt. Trykk for å se arrangementet.';

      case OrderPaymentStatus.INITIATE:
        return 'Du har enda ikke betalt. Trykk for å betale.';

      case OrderPaymentStatus.REFUND:
        return 'Din betaling blir refundert innen kort tid.';

      case OrderPaymentStatus.CANCEL:
        return 'Din ordre er kansellert.';
      default:
        break;
    }
  };

  return (
    <ListItemButton
      component={Link}
      focusRipple
      sx={{ p: 0, height: '100%', overflow: 'hidden', borderRadius: (theme) => `${theme.shape.borderRadius}px`, ...sx }}
      to={order.status === OrderPaymentStatus.INITIATE ? order.payment_link : `${URLS.events}${order.event?.id}/${urlEncode(order.event?.title)}/`}>
      <Stack component={Paper} direction='row' gap={1} noOverflow sx={{ width: '100%', p: 1, textAlign: 'start', height: '100%' }}>
        <Box alt={'Vippslogo'} component='img' loading='lazy' src={VIPPSLOGO} sx={{ objectFit: 'contain', px: 1, width: 120, height: 60 }} />
        <Stack>
          <Typography sx={{ fontWeight: 'bold' }} variant='h3'>
            {order.event.title}
          </Typography>
          <Typography sx={{ fontSize: '1rem', fontStyle: 'italic', mt: 1.5 }} variant='body2'>
            {getStatusText()}
          </Typography>
          {/* <Typography sx={{ fontSize: '0.7rem', fontStyle: 'italic', fontWeight: 'bold', mt: 0.5 }} variant='subtitle2'>
            Ervervet av{' '}
            <Box component='span' sx={{ color: (theme) => theme.palette.error.main }}>
              {badge.total_completion_percentage.toFixed(1)}%
            </Box>
          </Typography> */}
        </Stack>
      </Stack>
    </ListItemButton>
  );
};

export default PaymentOrderItem;
