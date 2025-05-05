import FieldView from '~/components/forms/FieldView';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import type { Form } from '~/types';
import { FieldValues, UseFormReturn } from 'react-hook-form';

export type FormViewProps<TFormValues extends FieldValues> = {
  form: Form;
  submitForm: UseFormReturn<TFormValues>;
  disabled?: boolean;
};

const FormView = <FormValues extends FieldValues>({ form, submitForm, disabled = false }: FormViewProps<FormValues>) => (
  <>
    {!form.fields.length && <h1 className='text-center'>Dette spørreskjemaet inneholder ingen spørsmål.</h1>}
    {form.fields.map((field, index) => (
      <FieldView disabled={disabled} formField={field} index={index} key={field.id} submitForm={submitForm} />
    ))}
  </>
);

type FormViewTemplateProps = {
  form: Form;
};

export const FormViewTemplate = ({ form }: FormViewTemplateProps) => (
  <div className='space-y-4'>
    {form.fields.map((field, index) => (
      <div className='space-y-1' key={index}>
        <Label>
          {field.title}
          {field.required && <span className='text-red-300'>*</span>}
        </Label>
        <Input className='w-full' disabled value={field.title} />
      </div>
    ))}
  </div>
);

export default FormView;
