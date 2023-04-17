import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import { forwardRef } from 'react';
import { FieldError, FieldValues, Path, UseFormReturn } from 'react-hook-form';

export type TextFieldProps<FormValues extends FieldValues = FieldValues> = MuiTextFieldProps &
  Pick<UseFormReturn<FormValues>, 'formState'> & {
    name: Path<FormValues> | string;
  };

const GenericTextField = <FormValues extends FieldValues>(
  { name, formState, helperText, placeholder, ...props }: TextFieldProps<FormValues>,
  ref: React.ForwardedRef<HTMLDivElement>,
) => {
  const { [name]: fieldError } = formState.errors;
  const error = fieldError as FieldError;
  return (
    <MuiTextField
      error={Boolean(error)}
      fullWidth
      helperText={
        <>
          {error?.message}
          {helperText && Boolean(error) && <br />}
          {helperText}
        </>
      }
      InputLabelProps={{ shrink: true }}
      inputRef={ref}
      margin='normal'
      name={name}
      placeholder={placeholder || 'Skriv her'}
      variant='outlined'
      {...props}
    />
  );
};

const TextField = forwardRef(GenericTextField) as <FormValues extends FieldValues>(
  props: TextFieldProps<FormValues> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof GenericTextField>;

export default TextField;
