import { forwardRef } from 'react';
import { UseFormReturn, FieldError, Path } from 'react-hook-form';

// Material UI Components
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';

export type TextFieldProps<FormValues> = MuiTextFieldProps &
  Pick<UseFormReturn<FormValues>, 'formState'> & {
    name: Path<FormValues> | string;
  };

// eslint-disable-next-line comma-spacing
const GenericTextField = <FormValues,>({ name, formState, helperText, ...props }: TextFieldProps<FormValues>, ref: React.ForwardedRef<HTMLDivElement>) => (
  <MuiTextField
    error={Boolean(formState.errors[name] as FieldError)}
    fullWidth
    helperText={
      <>
        {(formState.errors[name] as FieldError)?.message}
        {helperText && Boolean(formState.errors[name] as FieldError) && <br />}
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

const TextField = forwardRef(GenericTextField) as <FormValues>(
  props: TextFieldProps<FormValues> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof GenericTextField>;

export default TextField;
