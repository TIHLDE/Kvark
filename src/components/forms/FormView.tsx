import { Form } from 'types';
import { UseFormReturn } from 'react-hook-form';

// Project components
import FieldView from 'components/forms/FieldView';

export type FormViewProps<FormValues> = Pick<UseFormReturn<FormValues>, 'formState' | 'register' | 'control' | 'getValues'> & {
  form: Form;
};

// eslint-disable-next-line comma-spacing
const FormView = <FormValues,>({ form, register, formState, control, getValues }: FormViewProps<FormValues>) => {
  return (
    <>
      {form.fields.map((field, index) => (
        <FieldView control={control} field={field} formState={formState} getValues={getValues} index={index} key={field.id} register={register} />
      ))}
    </>
  );
};

export default FormView;
