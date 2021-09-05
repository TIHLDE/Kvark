import { Button, ButtonProps, FormHelperText } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';

export type SubmitButtonProps<FormValues> = ButtonProps & Pick<UseFormReturn<FormValues>, 'formState'>;

// eslint-disable-next-line comma-spacing
const SubmitButton = <FormValues,>({ formState, children, disabled, ...props }: SubmitButtonProps<FormValues>) => {
  const isError = Boolean((Array.isArray(Object.keys(formState.errors)) ? Object.keys(formState.errors) : []).length);
  return (
    <>
      <Button disabled={disabled} fullWidth type='submit' variant='contained' {...props}>
        {children}
      </Button>
      {isError && (
        <FormHelperText error sx={{ textAlign: 'center' }}>
          Det er en eller feil i skjemaet som må rettes
        </FormHelperText>
      )}
    </>
  );
};
export default SubmitButton;
