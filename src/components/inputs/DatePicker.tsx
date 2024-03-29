import {
  DatePicker as MuiDatePicker,
  DatePickerProps as MuiDatePickerProps,
  DateTimePicker as MuiDateTimePicker,
  DateTimePickerProps as MuiDateTimePickerProps,
} from '@mui/lab';
import { TextField as MuiTextField, TextFieldProps } from '@mui/material';
import { Controller, FieldError, FieldValues, Path, PathValue, RegisterOptions, UnpackNestedValue, UseFormReturn } from 'react-hook-form';

export type DatePickerProps<FormValues extends FieldValues = FieldValues> = TextFieldProps &
  Pick<UseFormReturn<FormValues>, 'formState' | 'control'> & {
    name: Path<FormValues>;
    rules?: RegisterOptions;
    label: string;
    defaultValue?: string;
    dateProps?: Partial<MuiDatePickerProps> & Partial<MuiDateTimePickerProps>;
    type: 'date' | 'date-time';
    onDateChange?: (date?: Date) => void;
  };

const DatePicker = <FormValues extends FieldValues>({
  type,
  name,
  label,
  control,
  formState,
  rules = {},
  defaultValue = '',
  dateProps,
  onDateChange,
  helperText,
  ...props
}: DatePickerProps<FormValues>) => {
  const { [name]: fieldError } = formState.errors;
  const error = fieldError as FieldError;
  const Picker = type === 'date' ? MuiDatePicker : MuiDateTimePicker;
  return (
    <Controller
      control={control}
      defaultValue={defaultValue as UnpackNestedValue<PathValue<FormValues, Path<FormValues>>>}
      name={name}
      render={({ field }) => (
        <Picker
          {...field}
          {...dateProps}
          ampm={false}
          inputFormat={type === 'date' ? 'dd/MM/yyyy' : 'dd/MM/yyyy HH:mm'}
          label={label}
          onChange={(e) => {
            field.onChange(e);
            if (onDateChange) {
              onDateChange(e as Date | undefined);
            }
          }}
          renderInput={(params) => (
            <MuiTextField
              margin='normal'
              variant='outlined'
              {...params}
              error={Boolean(error)}
              helperText={
                <>
                  {error?.message}
                  {helperText && Boolean(error) && <br />}
                  {helperText}
                </>
              }
              {...props}
            />
          )}
        />
      )}
      rules={rules}
    />
  );
};

export default DatePicker;
