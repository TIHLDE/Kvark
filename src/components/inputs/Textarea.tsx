import { cn } from 'lib/utils';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Textarea } from 'components/ui/textarea';

type FormTextareaProps<TFormValues extends FieldValues> = {
  form: UseFormReturn<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  maxLength?: number;
};

const FormTextarea = <TFormValues extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder,
  required,
  className,
  disabled,
  maxLength,
}: FormTextareaProps<TFormValues>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('w-full', className)}>
          <FormLabel>
            {label} {required && <span className='text-red-300'>*</span>}
          </FormLabel>
          <FormControl>
            <Textarea className='h-full' disabled={disabled} {...field} maxLength={maxLength} placeholder={placeholder || 'Skriv her...'} />
          </FormControl>
          <FormMessage />
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
};

export default FormTextarea;
