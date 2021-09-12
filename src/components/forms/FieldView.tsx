import { TextFormField, SelectFormField } from 'types';
import { FormFieldType } from 'types/Enums';
import { UseFormReturn, Path } from 'react-hook-form';

import BoolArray from 'components/inputs/BoolArray';
import TextField from 'components/inputs/TextField';

export type FieldViewProps<FormValues> = Pick<UseFormReturn<FormValues>, 'formState' | 'register' | 'control' | 'getValues'> & {
  field: TextFormField | SelectFormField;
  index: number;
};

// eslint-disable-next-line comma-spacing
const FieldView = <FormValues,>({ register, field, formState, index, control, getValues }: FieldViewProps<FormValues>) => (
  <>
    <input {...register(`answers.${index}.field.id` as Path<FormValues>)} type='hidden' value={field.id} />
    {field.type === FormFieldType.TEXT_ANSWER ? (
      <TextField formState={formState} label={field.title} {...register(`answers.${index}.answer_text` as Path<FormValues>)} required={field.required} />
    ) : field.type === FormFieldType.MULTIPLE_SELECT ? (
      <BoolArray
        control={control}
        formState={formState}
        getPathToObject={(obj) => obj?.['answers']?.[index]?.['selected_options']}
        getValues={getValues}
        label={`${field.title} ${field.required ? '*' : ''}`}
        name={`answers.${index}.selected_options` as Path<FormValues>}
        optionLabelKey='title'
        options={field.options}
        optionValueKey='id'
        type='checkbox'
      />
    ) : (
      <BoolArray
        control={control}
        defaultValue={field.required ? [field.options[0]] : []}
        formState={formState}
        getPathToObject={(obj) => obj?.['answers']?.[index]?.['selected_options']}
        getValues={getValues}
        label={`${field.title} ${field.required ? '*' : ''}`}
        name={`answers.${index}.selected_options` as Path<FormValues>}
        optionLabelKey='title'
        options={field.options}
        optionValueKey='id'
        type='radio'
      />
    )}
  </>
);

export default FieldView;
