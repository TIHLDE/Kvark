import { Button, ButtonProps, FormHelperText } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';

export type SubmitButtonProps = ButtonProps & Pick<UseFormReturn, 'formState'>;

const SubmitButton = ({ formState, children, disabled, ...props }: SubmitButtonProps) => {
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
