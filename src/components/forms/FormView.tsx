import { Form } from 'types';
import { UseFormReturn } from 'react-hook-form';

// Project components
import FieldView from 'components/forms/FieldView';

export type FormViewProps<FormValues> = Pick<UseFormReturn<FormValues>, 'formState' | 'register' | 'control' | 'getValues'> & {
  form: Form;
  disabled?: boolean;
};

// eslint-disable-next-line comma-spacing
const FormView = <FormValues,>({ form, register, formState, control, getValues, disabled = false }: FormViewProps<FormValues>) => {
  return (
    <>
      {form.fields.map((field, index) => (
        <FieldView
          control={control}
          disabled={disabled}
          field={field}
          formState={formState}
          getValues={getValues}
          index={index}
          key={field.id}
          register={register}
        />
      ))}
    </>
  );
};

export default FormView;
