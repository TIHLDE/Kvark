import { cn } from 'lib/utils';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from 'components/ui/select';

type FormSelectProps<TFormValues extends FieldValues> = {
  form: UseFormReturn<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  options: {
    value: string | number;
    label: string;
    isHeader?: boolean;
  }[];
  placeholder?: string;
  required?: boolean;
  className?: string;
  description?: string;
};

export const FormSelect = <TFormValues extends FieldValues>({
  form,
  name,
  label,
  options,
  required,
  placeholder,
  className,
  description,
}: FormSelectProps<TFormValues>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('w-full', className)}>
          <FormLabel>
            {label} {required && <span className='text-red-300'>*</span>}
          </FormLabel>
          <Select defaultValue={field.value ? field.value.toString() : field.value} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder || 'Velg'} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectGroup key={option.value}>
                  {option.isHeader ? <SelectLabel>{option.label}</SelectLabel> : <SelectItem value={option.value.toString()}>{option.label}</SelectItem>}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
