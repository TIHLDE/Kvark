import MuiFormControl, { FormControlProps } from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MuiSelect from '@mui/material/Select';
import { cn } from 'lib/utils';
import { Controller, FieldError, FieldValues, Path, PathValue, RegisterOptions, UnpackNestedValue, UseFormReturn } from 'react-hook-form';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from 'components/ui/select';

export type SelectProps<FormValues extends FieldValues = FieldValues> = FormControlProps &
  Pick<UseFormReturn<FormValues>, 'formState' | 'control'> & {
    name: Path<FormValues>;
    rules?: RegisterOptions;
    children: React.ReactNode;
    label: string;
    defaultValue?: string;
    helperText?: React.ReactNode;
  };

const MuiOwnSelect = <FormValues extends FieldValues>({
  name,
  label,
  control,
  formState,
  rules = {},
  defaultValue = '',
  children,
  helperText,
  required,
  ...props
}: SelectProps<FormValues>) => {
  const labelId = `${name}-label`;
  const { [name]: fieldError } = formState.errors;
  const error = fieldError as FieldError;
  return (
    <MuiFormControl fullWidth margin='normal' variant='outlined' {...props}>
      <InputLabel id={labelId} required={required}>
        {label}
      </InputLabel>
      <Controller
        control={control}
        defaultValue={defaultValue as UnpackNestedValue<PathValue<FormValues, Path<FormValues>>>}
        name={name}
        render={({ field }) => (
          <MuiSelect {...field} error={Boolean(error)} label={label} labelId={labelId}>
            {children}
          </MuiSelect>
        )}
        rules={rules}
      />
      {Boolean(error) && (
        <FormHelperText error variant='outlined'>
          {error?.message}
        </FormHelperText>
      )}
      {helperText && <FormHelperText variant='outlined'>{helperText}</FormHelperText>}
    </MuiFormControl>
  );
};

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

export default MuiOwnSelect;
