import { Separator as SeparatorPrimitive } from '@base-ui-components/react/separator';
import { cn } from '~/lib/utils';

function Separator({ className, ...props }: SeparatorPrimitive.Props) {
  const isHorizontal = props.orientation === 'horizontal';
  return (
    <SeparatorPrimitive
    {...props}
      className={cn('shrink-0 bg-border', isHorizontal ? 'h-px w-full' : 'h-full w-px', className)}  
    />
  );
}

export { Separator };
