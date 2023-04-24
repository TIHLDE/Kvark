import { TimePicker as MuiTimePicker, TimePickerProps as MuiTimePickerProps } from '@mui/lab';
import { TextField as MuiTextField, TextFieldProps } from '@mui/material';
import { Controller, FieldError, FieldValues, Path, PathValue, RegisterOptions, UnpackNestedValue, UseFormReturn } from 'react-hook-form';

// TODO: finish TimePicker component

// for now, use this function
export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
  const minutesStr = remainingMinutes < 10 ? `0${remainingMinutes}` : `${remainingMinutes}`;
  return `${hoursStr}:${minutesStr}`;
}

export type TimePickerProps<FormValues extends FieldValues = FieldValues> = TextFieldProps &
  Pick<UseFormReturn<FormValues>, 'formState' | 'control'> & {
    name: Path<FormValues>;
    rules?: RegisterOptions;
    label: string;
    defaultValue?: string;
    timeProps?: Partial<MuiTimePickerProps>;
    type: 'time';
    onTimeChange?: (time?: Date) => void;
  };

const TimePicker = <FormValues extends FieldValues>({
  name,
  label,
  control,
  formState,
  rules = {},
  defaultValue = '',
  timeProps,
  onTimeChange,
  helperText,
  ...props
}: TimePickerProps<FormValues>) => {
  const { [name]: fieldError } = formState.errors;
  const error = fieldError as FieldError;
  const Picker = MuiTimePicker;
  return (
    <Controller
      control={control}
      defaultValue={defaultValue as UnpackNestedValue<PathValue<FormValues, Path<FormValues>>>}
      name={name}
      render={({ field }) => (
        <Picker
          {...field}
          {...timeProps}
          ampm={false}
          label={label}
          onChange={(e) => {
            field.onChange(e);
            if (onTimeChange) {
              onTimeChange(e as unknown as Date);
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

export default TimePicker;
