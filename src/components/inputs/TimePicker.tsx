import { TimePicker as MuiTimePicker, TimePickerProps as MuiTimePickerProps } from '@mui/lab';
import { TextField as MuiTextField, TextFieldProps } from '@mui/material';
import { Controller, FieldError, FieldValues, Path, PathValue, RegisterOptions, UnpackNestedValue, UseFormReturn } from 'react-hook-form';

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

  const customRules: RegisterOptions = {
    ...rules,
    validate: (value) => {
      const time = new Date(value);
      const hours = time.getHours();
      const minutes = time.getMinutes();
      if ((hours === 12 && minutes > 0) || hours > 12) {
        return 'Tiden kan ikke overstige 12 timer';
      }
      return true;
    },
  };

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
      rules={customRules}
    />
  );
};

export default TimePicker;
