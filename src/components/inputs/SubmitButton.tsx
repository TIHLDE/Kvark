import { Button, ButtonProps, FormHelperText } from '@material-ui/core';
import { UseFormMethods } from 'react-hook-form';

export type SubmitButtonProps = ButtonProps & Pick<UseFormMethods, 'errors'>;

const SubmitButton = ({ errors = {}, children, disabled, ...props }: SubmitButtonProps) => {
  const isError = Boolean((Array.isArray(Object.keys(errors)) ? Object.keys(errors) : []).length);
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
