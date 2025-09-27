import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { FormDescription, FormItem, FormLabel } from '~/components/ui/form';
import { cn } from '~/lib/utils';
import { ChevronRightIcon } from 'lucide-react';

import { useFieldContext } from '../AppForm';

type BoolExpandProps = {
  title: string;
  description: string;
  className?: string;
};

export default function BoolExpand({ title, description, children, className }: React.PropsWithChildren<BoolExpandProps>) {
  const field = useFieldContext<boolean>();

  // TODO: Add an indicator that displays if its disabled or enabled
  // Don't use a switch, this for some reason causes infinite loop when updating state (maybe because bubble up of the event?)

  return (
    <Collapsible
      className={cn('w-full bg-white dark:bg-inherit rounded-md border group', className)}
      open={field.state.value}
      onOpenChange={field.handleChange}>
      <CollapsibleTrigger asChild>
        <FormItem className='space-x-16 md:space-x-0 flex flex-row items-center justify-between p-4'>
          <div className='space-y-0.5'>
            <FormLabel className='text-base'>{title}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
          <ChevronRightIcon className='group-data-[state=open]:rotate-90 transition-transform' />
        </FormItem>
      </CollapsibleTrigger>
      <CollapsibleContent className='border border-t-secondary border-b-0 border-x-0 p-4'>{children}</CollapsibleContent>
    </Collapsible>
  );
}
