import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { cn } from '~/lib/utils';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

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
        <FormInputBase className={cn('w-full', className)} description={description} label={label} required={required}>
          <Input disabled={disabled} type={type || 'text'} {...field} placeholder={placeholder || 'Skriv her...'} />
        </FormInputBase>
      )}
    />
  );
};

export default FormInput;

export function FormInputBase({
  children,
  label,
  description,
  required,
  className,
}: React.PropsWithChildren<{ required?: boolean; description?: string; label?: string; className?: string }>) {
  return (
    <FormItem className={className}>
      <FormLabel>
        {label} {required && <span className='text-red-300'>*</span>}
      </FormLabel>
      <FormControl>{children}</FormControl>
      <FormMessage />
      {description && <FormDescription>{description}</FormDescription>}
    </FormItem>
  );
}
