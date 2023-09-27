import { Box, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useUserPaymentOrders } from 'hooks/User';

import PaymentOrderItem from 'pages/Payment/components/PaymentOrderItem';

import Pagination from 'components/layout/Pagination';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

const ProfilePaymentOrders = () => {
  const { userId } = useParams();
  const { data, hasNextPage, fetchNextPage, isLoading, isFetching } = useUserPaymentOrders(userId);
  const paymentOrders = useMemo(() => (data !== undefined ? data.pages.map((page) => page.results).flat(1) : []), [data]);

  return (
    <Stack gap={1}>
      {!data ? (
        // TODO: Loading component
        <></>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 1, mb: 1 }}>
            {
              paymentOrders?.map((order) => {
                return <PaymentOrderItem key={order.order_id} order={order} />;
              })
            }
        </Box>
      )}
    </Stack>
  );
};

export default ProfilePaymentOrders;
