import { differenceInMilliseconds, formatDistanceStrict, minutesToMilliseconds } from 'date-fns';
import { nb } from 'date-fns/locale';
import milliseconds from 'date-fns/milliseconds';
import { cn } from 'lib/utils';
import { BadgeCheck, ChevronDown, ChevronRight, HandCoins } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Event, Order } from 'types';

import { useCreatePaymentOrder } from 'hooks/Payment';

import { Button, buttonVariants } from 'components/ui/button';
import ResponsiveDialog from 'components/ui/responsive-dialog';
import { ScrollArea } from 'components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'components/ui/tooltip';

import CountDown from './CountDown';
import PaymentOrderStatus from './PaymentOrderStatus';
import PaymentStatus from './PaymentStatus';

type PaymentInfoRegistrationProps = {
  hasPaidOrder: boolean;
  paymentExpireDate: Date;
  orders: Order[];
  eventId: Event['id'];
};

const PaymentInfoRegistration = ({ hasPaidOrder, paymentExpireDate, orders, eventId }: PaymentInfoRegistrationProps) => {
  return (
    <>
      <ResponsiveDialog
        description={''}
        title='Betalingsinformasjon'
        trigger={
          <Button className='w-full' variant='outline'>
            <p>{hasPaidOrder ? 'Deltager har betalt ' : 'Deltager har ikke betalt'}</p>
            <p>
              {' '}
              <HandCoins className={cn('w-5 h-5 stroke-[1.5px] ml-2', hasPaidOrder ? 'text-emerald-700' : 'text-red-700')} />
            </p>
          </Button>
        }>
        <ScrollArea>
          <div className='space-y-6'>
            <div className='flex justify-center '>
              <div>
                {/* {hasPaidOrder ? 'Deltakeren har betalt.' : <CountDown expiredate={paymentExpireDate}/>} */}
                <PaymentStatus expireDate={paymentExpireDate} hasPaid={hasPaidOrder} />
              </div>
            </div>

            {orders.map((order) => (
              <div className='space-y-2' key={order.order_id}>
                <PaymentOrderStatus status={order.status} />
                <p>
                  {new Date(order.created_at).toLocaleDateString('no-NO', {
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                  })}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </ResponsiveDialog>
    </>
  );
};

export default PaymentInfoRegistration;
