import React from 'react';
import { Form } from 'types/Types';

// Project components
import FieldView from 'components/forms/FieldView';

export type FormViewProps = {
  form: Form;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
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
