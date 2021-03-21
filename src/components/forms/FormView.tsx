import { Form } from 'types/Types';
import { UseFormMethods } from 'react-hook-form';

// Project components
import FieldView from 'components/forms/FieldView';

export type FormViewProps = Pick<UseFormMethods, 'register' | 'errors'> & {
  form: Form;
};

const FormView = ({ form, register, errors }: FormViewProps) => {
  return (
    <>
      {form.fields.map((field, index) => (
        <FieldView errors={errors} field={field} index={index} key={field.id} register={register} />
      ))}
    </>
  );
};

export default FormView;
