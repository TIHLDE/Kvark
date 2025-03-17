import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '~/components/ui/form';
import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';
import { cn } from '~/lib/utils';
import type { ReactNode } from 'react';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

type FormBasicSwitchProps<TFormValues extends FieldValues> = {
  form: UseFormReturn<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  className?: string;
};

const FormBasicSwitch = <TFormValues extends FieldValues>({ form, name, label, className }: FormBasicSwitchProps<TFormValues>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className={cn('flex items-center space-x-2', className)}>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              <Label>{label}</Label>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export const FormDetailSwitch = <TFormValues extends FieldValues>({
  form,
  name,
  label,
  description,
  className,
}: FormBasicSwitchProps<TFormValues> & { description: ReactNode }) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('space-x-4 md:space-x-20 flex flex-row md:items-center justify-between rounded-md border p-4', className)}>
          <div className='space-y-0.5'>
            <FormLabel className='text-base'>{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default FormBasicSwitch;
