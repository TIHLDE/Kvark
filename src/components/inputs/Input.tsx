import { cn } from 'lib/utils';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';

type FormInputProps<TFormValues extends FieldValues> = {
  form: UseFormReturn<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  type?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
};

const FormInput = <TFormValues extends FieldValues>({
  form,
  name,
  label,
  type,
  description,
  placeholder,
  required,
  className,
  disabled = false,
}: FormInputProps<TFormValues>) => {
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
            <Input disabled={disabled} type={type || 'text'} {...field} placeholder={placeholder || 'Skriv her...'} />
          </FormControl>
          <FormMessage />
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
};

export default FormInput;
