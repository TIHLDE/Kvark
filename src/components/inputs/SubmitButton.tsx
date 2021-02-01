import Button, { ButtonProps } from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import { UseFormMethods } from 'react-hook-form';

export type SubmitButtonProps = ButtonProps & Pick<UseFormMethods, 'errors'>;

const SubmitButton = ({ errors = {}, children, disabled, ...props }: SubmitButtonProps) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const errorList = Array.isArray(Object.keys(errors)) ? Object.keys(errors).map((error) => errors[error].message) : [];
  return (
    <>
      <Button color='primary' disabled={disabled || Boolean(errorList.length)} fullWidth type='submit' variant='contained' {...props}>
        {children}
      </Button>
      {errorList.map((error, i) => (
        <FormHelperText error key={i} style={{ textAlign: 'center' }}>
          {error}
        </FormHelperText>
      ))}
    </>
  );
};
export default SubmitButton;
