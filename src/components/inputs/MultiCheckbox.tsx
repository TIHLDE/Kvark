import { cn } from 'lib/utils';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

import { Checkbox } from 'components/ui/checkbox';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';

type FormMultiCheckboxProps<TFormValues extends FieldValues> = {
  form: UseFormReturn<TFormValues>;
  name: Path<TFormValues>;
  items: string[];
  label: string;
  type?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
};

const FormMultiCheckbox = <TFormValues extends FieldValues>({
  form,
  name,
  items,
  label,
  description,
  required,
  className,
}: FormMultiCheckboxProps<TFormValues>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className={cn('w-full', className)}>
          <div className='mb-4'>
            <FormLabel className='text-base'>
              {label} {required && <span className='text-red-300'>*</span>}
            </FormLabel>
            {description && <FormDescription className='text-sm'>{description}</FormDescription>}
          </div>
          {items.map((item, index) => (
            <FormField
              control={form.control}
              key={index}
              name={name}
              render={({ field }) => {
                return (
                  <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                    <FormControl>
                      <Checkbox
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        checked={field.value?.includes(item)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, item])
                            : field.onChange(
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                field.value?.filter((value: string) => value !== item),
                              );
                        }}
                      />
                    </FormControl>
                    <FormLabel className='font-normal'>{item}</FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormMultiCheckbox;
