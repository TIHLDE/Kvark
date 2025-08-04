import { cn } from '~/lib/utils';
import { Loader2Icon } from 'lucide-react';
import { ComponentProps } from 'react';

export function LoadingSpinner({ className, ...props }: React.PropsWithChildren<ComponentProps<typeof Loader2Icon>>) {
  return (
    <div className='flex items-center gap-2'>
      <Loader2Icon {...props} className={cn('animate-spin', className)} />
      {props.children}
    </div>
  );
}
