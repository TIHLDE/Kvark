import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

import { SelectFormField, TextFormField } from 'types';
import { FormFieldType } from 'types/Enums';

import FormInput from 'components/inputs/Input';
import FormMultiCheckbox from 'components/inputs/MultiCheckbox';

export type FieldViewProps<TFormValues extends FieldValues> = {
  formField: TextFormField | SelectFormField;
  index: number;
  disabled?: boolean;
  submitForm: UseFormReturn<TFormValues>;
};

const FieldView = <FormValues extends FieldValues>({ formField, index, submitForm, disabled = false }: FieldViewProps<FormValues>) => (
  <>
    <input {...submitForm.register(`answers.${index}.field.id` as Path<FormValues>)} type='hidden' value={formField.id} />
    {formField.type === FormFieldType.TEXT_ANSWER ? (
      <FormInput
        disabled={disabled}
        form={submitForm}
        label={formField.title}
        name={`answers[${index}].answer_text` as Path<FormValues>}
        required={formField.required}
      />
    ) : formField.type === FormFieldType.MULTIPLE_SELECT ? (
      <div className='space-y-2'>
        <FormMultiCheckbox
          form={submitForm}
          items={formField.options.map((option) => ({ value: option.id || '', label: option.title }))}
          label={formField.title}
          name={`answers[${index}].selected_options` as Path<FormValues>}
          required={formField.required}
        />
        <p className='text-muted-foreground text-sm'>Velg en eller flere svaralternativer</p>
      </div>
    ) : (
      <div className='space-y-2'>
        <FormMultiCheckbox
          defaultValue={formField.options[0].id}
          form={submitForm}
          items={formField.options.map((option) => ({ value: option.id || '', label: option.title }))}
          label={formField.title}
          multiple={false}
          name={`answers[${index}].selected_options` as Path<FormValues>}
          required={formField.required}
        />
        <p className='text-muted-foreground text-sm'>Velg ett svaralternativ</p>
      </div>
    )}
  </>
);

export default FieldView;
