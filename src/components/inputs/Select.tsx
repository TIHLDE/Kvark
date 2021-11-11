import FormControl, { FormControlProps } from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MuiSelect from '@mui/material/Select';
import { Path, Controller, RegisterOptions, UseFormReturn, FieldError, UnpackNestedValue, PathValue, FieldValues } from 'react-hook-form';

export type SelectProps<FormValues extends FieldValues = FieldValues> = FormControlProps &
  Pick<UseFormReturn<FormValues>, 'formState' | 'control'> & {
    name: Path<FormValues>;
    rules?: RegisterOptions;
    children: React.ReactNode;
    label: string;
    defaultValue?: string;
  };

// eslint-disable-next-line comma-spacing
const Select = <FormValues,>({ name, label, control, formState, rules = {}, defaultValue = '', children, ...props }: SelectProps<FormValues>) => {
  const labelId = `${name}-label`;
  const { [name]: fieldError } = formState.errors;
  const error = fieldError as FieldError;
  return (
    <FormControl fullWidth margin='normal' variant='outlined' {...props}>
      <InputLabel id={labelId} required={Boolean(error)}>
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
    </FormControl>
  );
};
export default Select;
