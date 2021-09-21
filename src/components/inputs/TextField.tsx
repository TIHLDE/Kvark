import { forwardRef } from 'react';
import { UseFormReturn, FieldError, Path } from 'react-hook-form';

// Material UI Components
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';

import CustomTooltip from 'components/layout/ToolTip';

const useStyles = {
  grid: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  normal: {
    display: 'flex',
  },
};

export type TextFieldProps<FormValues> = MuiTextFieldProps &
  Pick<UseFormReturn<FormValues>, 'formState'> & {
    name: Path<FormValues> | string;
    tooltip?: string;
  };

// eslint-disable-next-line comma-spacing
const GenericTextField = <FormValues,>({ name, tooltip, formState, ...props }: TextFieldProps<FormValues>, ref: React.ForwardedRef<HTMLDivElement>) => {
  return (
    <div style={tooltip ? useStyles.grid : useStyles.normal}>
      <MuiTextField
        error={Boolean(formState.errors[name] as FieldError)}
        fullWidth
        helperText={(formState.errors[name] as FieldError)?.message}
        InputLabelProps={{ shrink: true }}
        inputRef={ref}
        margin='normal'
        name={name}
        placeholder={props.placeholder || 'Skriv her'}
        variant='outlined'
        {...props}
      />
      {tooltip ? <CustomTooltip title={tooltip} /> : ''}
    </div>
  );
};

const TextField = forwardRef(GenericTextField) as <FormValues>(
  props: TextFieldProps<FormValues> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof GenericTextField>;

export default TextField;
