import { AvatarImage } from '@radix-ui/react-avatar';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import type { OrderList } from '~/types';

import OrderStatus from './OrderStatus';

interface OrderListItemProps {
  order: OrderList;
}

export default function OrderListItem({ order }: OrderListItemProps) {
  return (
    <div className='w-full rounded-lg bg-card border p-4 shadow-sm space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <p className='font-medium'>{order.event.title}</p>
          <OrderStatus status={order.status} />
        </div>

        <p>
          {new Date(order.created_at).toLocaleDateString('no-NO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })}
        </p>
      </div>

      <div className='flex items-center space-x-2'>
        <Avatar>
          <AvatarImage alt={order.user.first_name} src={order.user.image} />
          <AvatarFallback>{order.user && order.user.first_name[0] + order.user.last_name[0]}</AvatarFallback>
        </Avatar>
        <h1>
          {order.user.first_name} {order.user.last_name}
        </h1>
      </div>

      <div className='flex items-center justify-end'>
        <p>69 NOK</p>
      </div>
    </div>
  );
}
