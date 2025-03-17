import { Checkbox } from '~/components/ui/checkbox';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { cn } from '~/lib/utils';
import { useEffect } from 'react';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

import { Label } from '../ui/label';

type FormMultiCheckboxProps<TFormValues extends FieldValues> = {
  form: UseFormReturn<TFormValues>;
  name: Path<TFormValues>;
  items: string[] | { value: string; label: string }[];
  label: string;
  type?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  multiple?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  onChange?: (newValue: string[]) => void;
};

const FormMultiCheckbox = <TFormValues extends FieldValues>({
  form,
  name,
  items,
  label,
  description,
  required,
  className,
  defaultValue,
  disabled = false,
  multiple = true,
  onChange,
}: FormMultiCheckboxProps<TFormValues>) => {
  useEffect(() => {
    const value = form.getValues(name);
    if (!value || (Array.isArray(value) && !value.length)) {
      // @ts-ignore
      form.setValue(name, []);
    }

    if (defaultValue && (!value || (Array.isArray(value) && !value.length))) {
      // @ts-ignore
      form.setValue(name, [defaultValue]);
    }
  }, [form.getValues(name)]);

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
                const itemValue = typeof item === 'object' ? item.value : item;
                return (
                  <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(typeof item === 'object' ? item.value : item)}
                        disabled={disabled}
                        onCheckedChange={(checked) => {
                          const newValue = field.value.filter((value: string) => value !== itemValue);
                          if (checked) {
                            if (multiple) {
                              newValue.push(itemValue);
                            } else {
                              newValue[0] = itemValue;
                            }
                          }

                          form.setValue(name, newValue);
                          if (onChange) {
                            onChange(newValue);
                          }

                          return field.onChange(newValue);
                        }}
                      />
                    </FormControl>
                    <FormLabel className='font-normal'>{typeof item === 'object' ? item.label : item}</FormLabel>
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

type FormMultiCheckboxComponentProps = {
  items: string[] | { value: string; label: string }[];
  label: string;
  type?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  multiple?: boolean;
  disabled?: boolean;
  value: string[];
  onChange: (newValue: string[]) => void;
};

export function FormMultiCheckboxComponent({ className, label, required, description, items, value, onChange, disabled }: FormMultiCheckboxComponentProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className='mb-4'>
        <Label className='text-base'>
          {label} {required && <span className='text-red-300'>*</span>}
        </Label>
        {description && <p className='text-sm text-muted-foreground'>{description}</p>}
      </div>
      {items.map((item, index) => {
        const itemValue = typeof item === 'object' ? item.value : item;
        return (
          <div className='mt-3' key={index}>
            <div className='flex flex-row items-start space-x-3'>
              <Checkbox
                checked={value.includes(itemValue)}
                disabled={disabled}
                onCheckedChange={(checked) => {
                  if (checked && !value.includes(itemValue)) {
                    onChange([...value, itemValue]);
                  }
                  if (!checked) {
                    onChange(value.filter((v) => v !== itemValue));
                  }
                }}
              />
              <Label className='font-normal'>{typeof item === 'object' ? item.label : item}</Label>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FormMultiCheckbox;
