import { forwardRef } from 'react';
import { UseFormReturn, FieldError, Path } from 'react-hook-form';

// Material UI Components
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';

import CustomTooltip from 'components/layout/ToolTip';

const useStyles = makeStyles((theme) => ({
  grid: {
    display: 'grid',
    gridGap: theme.spacing(2),
    gridTemplateColumns: '1fr 40px',
    width: '100%',
  },
  normal: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    width: '100%',
  },
}));
export type TextFieldProps<FormValues> = MuiTextFieldProps &
  Pick<UseFormReturn<FormValues>, 'formState'> & {
    name: Path<FormValues> | string;
    tooltip?: string;
  };

// eslint-disable-next-line comma-spacing
const GenericTextField = <FormValues,>({ name, tooltip, formState, ...props }: TextFieldProps<FormValues>, ref: React.ForwardedRef<HTMLDivElement>) => {
  const classes = useStyles();
  return (
    <div className={tooltip ? classes.grid : classes.normal}>
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
