import { Controller, RegisterOptions, UseFormMethods } from 'react-hook-form';
import { TextField as MuiTextField, TextFieldProps } from '@material-ui/core';
import {
  DatePicker as MuiDatePicker,
  DatePickerProps as MuiDatePickerProps,
  DateTimePicker as MuiDateTimePicker,
  DateTimePickerProps as MuiDateTimePickerProps,
} from '@material-ui/lab';

export type DatePickerProps = TextFieldProps &
  Pick<UseFormMethods, 'errors' | 'control'> & {
    name: string;
    rules?: RegisterOptions;
    label: string;
    defaultValue?: string;
    dateProps?: Partial<MuiDatePickerProps> & Partial<MuiDateTimePickerProps>;
    type: 'date' | 'date-time';
    onDateChange?: (date?: Date) => void;
  };

const DatePicker = ({ type, name, label, control, errors, rules = {}, defaultValue = '', dateProps, onDateChange, ...props }: DatePickerProps) => {
  const Picker = type === 'date' ? MuiDatePicker : MuiDateTimePicker;
  return (
    <Controller
      control={control}
      defaultValue={defaultValue}
      name={name}
      render={({ onChange, value }) => (
        <Picker
          {...dateProps}
          ampm={false}
          inputFormat={type === 'date' ? 'dd/MM/yyyy' : 'dd/MM/yyyy HH:mm'}
          label={label}
          onChange={(e) => {
            onChange(e);
            if (onDateChange) {
              onDateChange(e as Date | undefined);
            }
          }}
          renderInput={(params) => (
            <MuiTextField
              margin='normal'
              variant='outlined'
              {...params}
              error={Boolean(errors[name])}
              fullWidth
              helperText={errors[name]?.message}
              {...props}
            />
          )}
          value={value}
        />
      )}
      rules={rules}
    />
  );
};
export default DatePicker;
