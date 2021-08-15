import { forwardRef } from 'react';
import { UseFormReturn } from 'react-hook-form';

// Material UI Components
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@material-ui/core/TextField';

export type TextFieldProps = MuiTextFieldProps &
  Pick<UseFormReturn, 'formState'> & {
    name: string;
  };

const TextField = forwardRef(({ name, formState, ...props }: TextFieldProps, ref) => {
  return (
    <MuiTextField
      error={Boolean(formState.errors[name])}
      fullWidth
      helperText={formState.errors[name]?.message}
      InputLabelProps={{ shrink: true }}
      inputRef={ref}
      margin='normal'
      name={name}
      placeholder={props.placeholder || 'Skriv her'}
      variant='outlined'
      {...props}
    />
  );
});

TextField.displayName = 'TextField';
export default TextField;
