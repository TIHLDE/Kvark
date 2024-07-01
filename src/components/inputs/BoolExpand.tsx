import { cn } from 'lib/utils';
import { ReactNode, useEffect, useState } from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'components/ui/collapsible';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from 'components/ui/form';
import { Switch } from 'components/ui/switch';

type BoolExpandProps<TFormValues extends FieldValues> = {
  form: UseFormReturn<TFormValues>;
  name: Path<TFormValues>;
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
};

const BoolExpand = <TFormValues extends FieldValues>({ form, name, title, description, children, className }: BoolExpandProps<TFormValues>) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => setExpanded(form.watch(name)), [form.watch(name)]);

  return (
    <Collapsible className={cn('w-full bg-white dark:bg-inherit rounded-md border', className)} onOpenChange={setExpanded} open={expanded}>
      <CollapsibleTrigger asChild>
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem className='space-x-16 md:space-x-0 flex flex-row items-center justify-between p-4'>
              <div className='space-y-0.5'>
                <FormLabel className='text-base'>{title}</FormLabel>
                <FormDescription>{description}</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    setExpanded(!expanded);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className='border border-t-secondary border-b-0 border-x-0 p-4'>{children}</CollapsibleContent>
    </Collapsible>
  );
};

export default BoolExpand;
