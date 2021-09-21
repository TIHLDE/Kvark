import { Button, ButtonProps, FormHelperText } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';
import CustomTooltip from 'components/layout/ToolTip';

export type SubmitButtonProps<FormValues> = ButtonProps &
  Pick<UseFormReturn<FormValues>, 'formState'> & {
    tooltip?: string;
  };

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
// eslint-disable-next-line comma-spacing
const SubmitButton = <FormValues,>({ tooltip, formState, children, disabled, ...props }: SubmitButtonProps<FormValues>) => {
  const isError = Boolean((Array.isArray(Object.keys(formState.errors)) ? Object.keys(formState.errors) : []).length);
  return (
    <div style={tooltip ? useStyles.grid : useStyles.normal}>
      <Button disabled={disabled} fullWidth type='submit' variant='contained' {...props}>
        {children}
      </Button>
      {isError && (
        <FormHelperText error sx={{ textAlign: 'center' }}>
          Det er en eller feil i skjemaet som må rettes
        </FormHelperText>
      )}
      {tooltip ? <CustomTooltip title={tooltip} /> : ''}
    </div>
  );
};
export default SubmitButton;
