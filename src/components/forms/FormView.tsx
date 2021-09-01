import { Form } from 'types/Types';
import { UseFormReturn } from 'react-hook-form';

// Project components
import FieldView from 'components/forms/FieldView';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormViewProps = Pick<UseFormReturn<any>, 'formState' | 'register' | 'control' | 'getValues'> & {
  form: Form;
};

const FormView = ({ form, register, formState, control, getValues }: FormViewProps) => {
  return (
    <>
      {form.fields.map((field, index) => (
        <FieldView control={control} field={field} formState={formState} getValues={getValues} index={index} key={field.id} register={register} />
      ))}
    </>
  );
};

export default FormView;
