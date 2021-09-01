import { TextFormField, SelectFormField } from 'types/Types';
import { FormFieldType } from 'types/Enums';
import { UseFormReturn } from 'react-hook-form';

import BoolArray from 'components/inputs/BoolArray';
import TextField from 'components/inputs/TextField';

export type FieldViewProps = Pick<UseFormReturn, 'formState' | 'register' | 'control' | 'getValues'> & {
  field: TextFormField | SelectFormField;
  index: number;
};

const FieldView = ({ register, field, formState, index, control, getValues }: FieldViewProps) => {
  if (field.type === FormFieldType.TEXT_ANSWER) {
    return (
      <>
        <input {...register(`answers.${index}.field`)} type='hidden' value={field.id} />
        <TextField formState={formState} label={field.title} {...register(`answers.${index}.text_answer`)} required={field.required} />
      </>
    );
  } else if (field.type === FormFieldType.MULTIPLE_SELECT) {
    return (
      <>
        <input {...register(`answers.${index}.field`)} type='hidden' value={field.id} />
        <BoolArray
          control={control}
          formState={formState}
          getPathToObject={(obj) => obj?.['answers']?.[index]?.['selected_options']}
          getValues={getValues}
          label={`${field.title} ${field.required ? '*' : ''}`}
          name={`answers.${index}.selected_options`}
          options={field.options.map((option) => ({ value: option.id || option.title, label: option.title }))}
          type='checkbox'
        />
      </>
    );
  } else {
    return (
      <>
        <input {...register(`answers.${index}.field`)} type='hidden' value={field.id} />
        <BoolArray
          control={control}
          defaultValue={field.options[0]?.id ? [field.options[0].id] : []}
          formState={formState}
          getPathToObject={(obj) => obj?.['answers']?.[index]?.['selected_options']}
          getValues={getValues}
          label={`${field.title} ${field.required ? '*' : ''}`}
          name={`answers.${index}.selected_options`}
          options={field.options.map((option) => ({ value: option.id || option.title, label: option.title }))}
          type='radio'
        />
      </>
    );
  }
};

export default FieldView;
