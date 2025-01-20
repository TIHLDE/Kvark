import { differenceInMilliseconds, formatDistanceStrict, minutesToMilliseconds } from 'date-fns';
import { nb } from 'date-fns/locale';
import milliseconds from 'date-fns/milliseconds';
import { useEffect, useState } from 'react';

import { Event, Order } from 'types';

import { useCreatePaymentOrder } from 'hooks/Payment';

import { Button, buttonVariants } from 'components/ui/button';
import ResponsiveDialog from 'components/ui/responsive-dialog';
import { ScrollArea } from 'components/ui/scroll-area';
import CountdownTimer from '../../EventDetails/components/CountdownTimer';

/* Notat: La til ny variabel paymentExpiredate, da de nye funk fra 
CountdownTimer.txt trengte en variabel som ikke var "?" Date; 
Dette fikk fikset feilmeldinger, samt en "}" nederst på siden.
*/

type PaymentInfoRegistrationProps = {
  hasPaidOrder: boolean;
  paymentExpireDate: Date;
  orders: Order[];
  eventId: Event['id'];
};

/*

 */

const PaymentInfoRegistration = ({ hasPaidOrder, paymentExpireDate, orders, eventId }: PaymentInfoRegistrationProps) => {
  return (
    <>
    <ResponsiveDialog
      description={''}
      title='Betalingsinformasjon'
      trigger={<Button className='w-full' variant='destructive'>
        OK!
      </Button>}
      children={
        <ScrollArea>
          {hasPaidOrder ? 'BETALT' : 'IKKE BETALT'}
          {paymentExpireDate ? 'Tiden har gått ut' : 'Det er mer tid igjen'}
          <CountdownTimer event_id={eventId} payment_expiredate={paymentExpireDate} />
          {orders}
        </ScrollArea>
        }
      />
    </>
  )}

export default PaymentInfoRegistration;
