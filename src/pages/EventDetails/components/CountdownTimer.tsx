import VIPPS from '~/assets/img/vipps.svg';
import LoadingSpinnner from '~/components/miscellaneous/LoadingSpinner';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { useCreatePaymentOrder } from '~/hooks/Payment';
import type { Event, Order } from '~/types';
import { differenceInMilliseconds, formatDistanceStrict, minutesToMilliseconds } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const getTimeDifference = (time: Date) => {
  const now = new Date();
  const myDate = new Date(time);

  // Add 10 minutes so that the user has time to pay
  const addedTime = minutesToMilliseconds(10);

  return differenceInMilliseconds(new Date(myDate.getTime() + addedTime), now);
};

const convertTime = (milliseconds: number) => {
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
  // Remove 10 minutes for displaying the actual time left
  const removedTime = minutesToMilliseconds(10);

  const [timeLeft, setTimeLeft] = useState(convertTime(getTimeDifference(payment_expiredate) - removedTime));
  const createPaymentOrder = useCreatePaymentOrder();

  useEffect(() => {
    if (new Date(payment_expiredate) < new Date()) {
      return;
    }

    const interval = setInterval(() => {
      const distance = getTimeDifference(payment_expiredate);

      if (distance && distance > 0) {
        setTimeLeft(convertTime(distance - removedTime));
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
        toast.error('Det skjedde en feil med oppretting av betalingsordre.');
      },
    });
  };

  if (new Date(payment_expiredate) <= new Date()) {
    return (
      <Card>
        <CardContent className='py-8 text-center space-y-4'>
          <h1>Betalingstiden har gått ut. Det er ikke lenger mulig å betale for dette arrangementet. Du vil bli satt på venteliste innen kort tid.</h1>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className='py-8 text-center space-y-4'>
        <Button className='hover:bg-inherit' disabled={createPaymentOrder.isPending} onClick={() => create({ event: event_id })} variant='ghost'>
          {createPaymentOrder.isPending ? <LoadingSpinnner /> : <img alt='Betal med vipps' src={VIPPS} />}
        </Button>
        <h1>Betal innen {timeLeft} for å beholde plassen på arrangementet.</h1>
      </CardContent>
    </Card>
  );
};

export default CountdownTimer;
