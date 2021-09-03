import { TextFormField, SelectFormField } from 'types/Types';
import { FormFieldType } from 'types/Enums';
import { UseFormReturn } from 'react-hook-form';

import BoolArray from 'components/inputs/BoolArray';
import TextField from 'components/inputs/TextField';

export type FieldViewProps = Pick<UseFormReturn, 'formState' | 'register' | 'control' | 'getValues'> & {
  field: TextFormField | SelectFormField;
  index: number;
};

const FieldView = ({ register, field, formState, index, control, getValues }: FieldViewProps) => (
  <>
    <input {...register(`answers.${index}.field.id`)} type='hidden' value={field.id} />
    {field.type === FormFieldType.TEXT_ANSWER ? (
      <TextField formState={formState} label={field.title} {...register(`answers.${index}.answer_text`)} required={field.required} />
    ) : field.type === FormFieldType.MULTIPLE_SELECT ? (
      <BoolArray
        control={control}
        formState={formState}
        getPathToObject={(obj) => obj?.['answers']?.[index]?.['selected_options']}
        getValues={getValues}
        label={`${field.title} ${field.required ? '*' : ''}`}
        name={`answers.${index}.selected_options`}
        optionLabelKey='title'
        options={field.options}
        optionValueKey='id'
        type='checkbox'
      />
    ) : (
      <BoolArray
        control={control}
        defaultValue={[field.options[0]]}
        formState={formState}
        getPathToObject={(obj) => obj?.['answers']?.[index]?.['selected_options']}
        getValues={getValues}
        label={`${field.title} ${field.required ? '*' : ''}`}
        name={`answers.${index}.selected_options`}
        optionLabelKey='title'
        options={field.options}
        optionValueKey='id'
        type='radio'
      />
    )}
  </>
);

export default FieldView;
