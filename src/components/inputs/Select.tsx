import FormControl, { FormControlProps } from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MuiSelect from '@mui/material/Select';
import { Path, Controller, RegisterOptions, UseFormReturn, FieldError, UnpackNestedValue, PathValue } from 'react-hook-form';

export type SelectProps<FormValues> = FormControlProps &
  Pick<UseFormReturn<FormValues>, 'formState' | 'control'> & {
    name: Path<FormValues>;
    rules?: RegisterOptions;
    children: React.ReactNode;
    label: string;
    defaultValue?: string;
    helperText?: React.ReactNode;
  };

// eslint-disable-next-line comma-spacing
const Select = <FormValues,>({ name, label, control, formState, rules = {}, defaultValue = '', children, helperText, ...props }: SelectProps<FormValues>) => {
  const labelId = `${name}-label`;
  return (
    <FormControl fullWidth margin='normal' variant='outlined' {...props}>
      <InputLabel id={labelId} required={Boolean(formState.errors[name] as FieldError)}>
        {label}
      </InputLabel>
      <Controller
        control={control}
        defaultValue={defaultValue as UnpackNestedValue<PathValue<FormValues, Path<FormValues>>>}
        name={name}
        render={({ field }) => (
          <MuiSelect {...field} error={Boolean(formState.errors[name] as FieldError)} label={label} labelId={labelId}>
            {children}
          </MuiSelect>
        )}
        rules={rules}
      />
      {Boolean(formState.errors[name] as FieldError) && (
        <FormHelperText error variant='outlined'>
          {(formState.errors[name] as FieldError)?.message}
        </FormHelperText>
      )}
      {helperText && <FormHelperText variant='outlined'>{helperText}</FormHelperText>}
    </FormControl>
  );
};
export default Select;
