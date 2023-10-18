import styled from '@emotion/styled';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { differenceInMilliseconds, formatDistanceStrict } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useEffect, useState } from 'react';

import { Event, Order } from 'types';

import { useCreatePaymentOrder } from 'hooks/Payment';
import { useSnackbar } from 'hooks/Snackbar';

import Paper from 'components/layout/Paper';

import VIPPS from 'assets/img/vipps.svg';

const ContentPaper = styled(Paper)({
  height: 'fit-content',
  overflowX: 'auto',
});

const getTimeDifference = (time?: Date) => {
  if (!time) {
    return;
  }

  const now = new Date();
  const myDate = new Date(time);

  return differenceInMilliseconds(myDate, now);
};

const convertTime = (milliseconds?: number) => {
  if (!milliseconds) {
    return;
  }

  const now = new Date();

  return formatDistanceStrict(new Date(now.getTime() + milliseconds), now, {
    locale: nb,
  });
};

type Registration = {
  payment_expiredate: Date;
  event_id: Event['id'];
};

const CountdownTimer = ({ payment_expiredate, event_id }: Registration) => {
  const [timeLeft, setTimeLeft] = useState(convertTime(getTimeDifference(payment_expiredate)));
  const createPaymentOrder = useCreatePaymentOrder();
  const showSnackbar = useSnackbar();

  useEffect(() => {
    const interval = setInterval(() => {
      const distance = getTimeDifference(payment_expiredate);

      if (distance && distance > 0) {
        setTimeLeft(convertTime(distance));
      } else {
        window.location.reload();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const create = (data: Partial<Order>) => {
    createPaymentOrder.mutate(data, {
      onSuccess: (data) => {
        const payment_link = data.payment_link;
        window.location.replace(payment_link || '');
      },
      onError: () => {
        showSnackbar('Det skjedde en feil med oppretting betalingsordre.', 'error');
      },
    });
  };

  if (new Date(payment_expiredate) <= new Date()) {
    return null;
  }

  return (
    <ContentPaper>
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <Button disabled={createPaymentOrder.isLoading} onClick={() => create({ event: event_id })}>
          {createPaymentOrder.isLoading ? <CircularProgress /> : <img alt='Betal med vipps' src={VIPPS} />}
        </Button>
      </Box>
      <Typography align='center' sx={{ color: (theme) => theme.palette.text.primary }}>
        Betal innen {timeLeft} for å beholde plassen på arrangementet.
      </Typography>
    </ContentPaper>
  );
};

export default CountdownTimer;
