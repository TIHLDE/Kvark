import styled from '@emotion/styled';
import { alpha, Box, Button, ButtonProps, ListItemButtonProps, Stack, Typography, useTheme } from '@mui/material';
import useDimensions from 'react-cool-dimensions';
import { Link } from 'react-router-dom';
import URLS from 'URLS';

import { OrderList } from 'types';
import { OrderPaymentStatus } from 'types/Enums';

import Paper from 'components/layout/Paper';

import VIPPSLOGO from 'assets/img/vippsLogo.svg';

const OrderListItemButton = styled(Button, { shouldForwardProp: (prop) => prop !== 'borderColor' })<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ButtonProps<any, { component?: any }> & { borderColor: string }
>(({ theme, borderColor }) => ({
  display: 'block',
  margin: 'auto',
  height: 'fit-content',
  width: '100%',
  color: borderColor,
  borderColor: alpha(borderColor, 0.5),
  borderRadius: theme.shape.borderRadius,
  padding: 2,
  borderWidth: 2,
  '&:hover': {
    borderColor: borderColor,
    borderWidth: 2,
  },
}));

type PaymentOrderItemProps = Pick<ListItemButtonProps, 'sx'> & {
  order: OrderList;
};

const PaymentOrderItem = ({ order, sx }: PaymentOrderItemProps) => {
  const { observe, width } = useDimensions();
  const theme = useTheme();

  const getColor = () => {
    switch (order.status) {
      case OrderPaymentStatus.INITIATE:
        return theme.palette.colors.payment_order.initiate;
      case OrderPaymentStatus.CANCEL:
        return theme.palette.colors.payment_order.cancel;
      case OrderPaymentStatus.CAPTURE:
        return theme.palette.colors.payment_order.capture;
      case OrderPaymentStatus.SALE:
        return theme.palette.colors.payment_order.sale;
      case OrderPaymentStatus.REFUND:
        return theme.palette.colors.payment_order.refund;
      case OrderPaymentStatus.RESERVE:
        return theme.palette.colors.payment_order.reserve;
      case OrderPaymentStatus.VOID:
        return theme.palette.colors.payment_order.void;
      default:
        return theme.palette.colors.payment_order.cancel;
    }
  };

  return (
    <OrderListItemButton borderColor={getColor()} component={Link} ref={observe} sx={sx} to={`${URLS.events}/`} variant='outlined'>
      <Stack component={Paper} direction={'row'} gap={1} noOverflow sx={{ width: '100%', p: 1, textAlign: 'start', height: '100%' }}>
        <Box alt='Vipps logo' component='img' loading='lazy' src={VIPPSLOGO} sx={{ objectFit: 'contain', px: 1, width: 120, height: 60 }} />
        <Stack>
          <Typography sx={{ fontWeight: 'bold' }} variant='h3'>
            {order.event?.title}
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', fontStyle: 'italic', fontWeight: 'bold', mt: 0.5 }} variant='subtitle2'>
            Status:{' '}
            <Box component='span' sx={{ color: (theme) => theme.palette.error.main }}>
              {order.status}
            </Box>
          </Typography>
        </Stack>
      </Stack>
    </OrderListItemButton>
  );
};

export default PaymentOrderItem;
