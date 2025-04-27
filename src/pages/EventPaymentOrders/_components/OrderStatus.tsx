import { Badge } from '~/components/ui/badge';
import { CheckIcon } from 'lucide-react';

interface OrderStatusProps {
  status: string;
}

export default function OrderStatus({ status }: OrderStatusProps) {
  if (status === 'SALE') {
    return (
      <Badge className='gap-1' variant='outline'>
        <CheckIcon aria-hidden='true' className='text-emerald-500' size={12} />
        Betalt
      </Badge>
    );
  }

  if (status === 'INITIATE') {
    return (
      <Badge className='gap-1.5' variant='outline'>
        <span aria-hidden='true' className='size-1.5 rounded-full bg-amber-500'></span>
        Venter
      </Badge>
    );
  }

  if (status === 'CANCEL') {
    return (
      <Badge className='gap-1.5' variant='outline'>
        <span aria-hidden='true' className='size-1.5 rounded-full bg-destructive'></span>
        Avbrutt
      </Badge>
    );
  }
}
