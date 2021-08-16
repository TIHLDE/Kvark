import { Form } from 'types/Types';
import { UseFormReturn } from 'react-hook-form';

// Project components
import FieldView from 'components/forms/FieldView';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormViewProps = Pick<UseFormReturn<any>, 'formState' | 'register'> & {
  form: Form;
};

const FormView = ({ form, register, formState }: FormViewProps) => {
  return (
    <>
      {form.fields.map((field, index) => (
        <FieldView field={field} formState={formState} index={index} key={field.id} register={register} />
      ))}
    </>
  );
};

export default FormView;
