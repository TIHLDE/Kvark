import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Switch } from '~/components/ui/switch';
import { cn } from '~/lib/utils';
import { ComponentProps } from 'react';

import { InputBaseProps } from '.';
import { useFieldContext } from '../AppForm';

type SwitchFieldProps = ComponentProps<typeof Switch> & Omit<InputBaseProps, 'required'>;

export function SwitchField({ label, description, ...props }: SwitchFieldProps) {
  const field = useFieldContext<boolean>();

  return (
    <FormItem className={cn('w-full flex justify-between items-center bg-white dark:bg-inherit rounded-md border group p-4', props.classNames?.formItem)}>
      <FormControl className={props.classNames?.formControl}>
        <>
          <div className='grid gap-1'>
            {label && (
              <FormLabel className={props.classNames?.formLabel}>
                {label} {props.required && <span className='text-red-300'>*</span>}
              </FormLabel>
            )}
            {description && <FormDescription className={props.classNames?.formDescription}>{description}</FormDescription>}
          </div>
          <Switch {...props} checked={field.state.value} onBlur={field.handleBlur} onCheckedChange={field.handleChange} />
        </>
      </FormControl>
      <FormMessage className={props.classNames?.formMessage} />
    </FormItem>
  );
}
