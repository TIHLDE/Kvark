import { forwardRef } from 'react';
import { UseFormReturn, FieldError, Path, FieldValues } from 'react-hook-form';

// Material UI Components
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';

export type TextFieldProps<FormValues extends FieldValues = FieldValues> = MuiTextFieldProps &
  Pick<UseFormReturn<FormValues>, 'formState'> & {
    name: Path<FormValues> | string;
  };

const GenericTextField = <FormValues extends FieldValues>(
  { name, formState, helperText, ...props }: TextFieldProps<FormValues>,
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
      placeholder={props.placeholder || 'Skriv her'}
      variant='outlined'
      {...props}
    />
  );
};

const TextField = forwardRef(GenericTextField) as <FormValues>(
  props: TextFieldProps<FormValues> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof GenericTextField>;

export default TextField;
