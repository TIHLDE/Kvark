import { Control, Controller, RegisterOptions, UseFormReturn } from 'react-hook-form';
import { TextField as MuiTextField, TextFieldProps } from '@material-ui/core';
import {
  DatePicker as MuiDatePicker,
  DatePickerProps as MuiDatePickerProps,
  DateTimePicker as MuiDateTimePicker,
  DateTimePickerProps as MuiDateTimePickerProps,
} from '@material-ui/lab';

export type DatePickerProps = TextFieldProps &
  Pick<UseFormReturn, 'formState'> & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
    name: string;
    rules?: RegisterOptions;
    label: string;
    defaultValue?: string;
    dateProps?: Partial<MuiDatePickerProps> & Partial<MuiDateTimePickerProps>;
    type: 'date' | 'date-time';
    onDateChange?: (date?: Date) => void;
  };

const DatePicker = ({ type, name, label, control, formState, rules = {}, defaultValue = '', dateProps, onDateChange, ...props }: DatePickerProps) => {
  const Picker = type === 'date' ? MuiDatePicker : MuiDateTimePicker;
  return (
    <Controller
      control={control}
      defaultValue={defaultValue}
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
              error={Boolean(formState.errors[name])}
              helperText={formState.errors[name]?.message}
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
