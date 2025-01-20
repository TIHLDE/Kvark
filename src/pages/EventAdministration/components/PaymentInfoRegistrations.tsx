import { differenceInMilliseconds, formatDistanceStrict, minutesToMilliseconds } from 'date-fns';
import { nb } from 'date-fns/locale';
import milliseconds from 'date-fns/milliseconds';
import { useEffect, useState } from 'react';

import { Event, Order } from 'types';

import { useCreatePaymentOrder } from 'hooks/Payment';

import { Button, buttonVariants } from 'components/ui/button';
import ResponsiveDialog from 'components/ui/responsive-dialog';
import { ScrollArea } from 'components/ui/scroll-area';

/* Notat: La til ny variabel paymentExpiredate, da de nye funk fra 
CountdownTimer.txt trengte en variabel som ikke var "?" Date; 
Dette fikk fikset feilmeldinger, samt en "}" nederst på siden.
*/

type PaymentInfoRegistrationProps = {
  hasPaidOrder: boolean;
  expireDate?: Date;
  orders: Order[];
  eventId: Event['id'];
  paymentExpireDate: Date;
};

/* må finne ut hvor mye tid som har gått siden betalingen, da har brukeren 2 timer på seg 

const getTimeDifference = (time:Date) => {
  const now = new Date();
  const myDate = new Date();

  //Added 10 minutes so that user has time to pay
  const addedTime = minutesToMilliseconds(10);

  return differenceInMilliseconds(new Date(myDate.getTime() + addedTime), now);

}

const paymentCountDown = ({paymentExpiredate, eventId}): PaymentInfoRegistrationProps => {

}
*/

const PaymentInfoRegistration = ({ hasPaidOrder, expireDate, orders }: PaymentInfoRegistrationProps) => {
  return (
    <ResponsiveDialog
      description={''}
      title='Betalingsinformasjon'
      trigger={
        <Button className='w-full' variant='outline'>
          Betalingsinformasjon
        </Button>
      }>
      <ScrollArea>
        <p>{hasPaidOrder ? 'BETALT' : 'IKKE BETALT'}</p>
        <p> {expireDate ? 'Tiden har gått ut' : 'Det er mer tid igjen'}</p>
        <p> </p>
      </ScrollArea>
    </ResponsiveDialog>
  );
};
export default PaymentInfoRegistration;
