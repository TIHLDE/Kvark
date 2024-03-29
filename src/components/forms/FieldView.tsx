import { Typography } from '@mui/material';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

import { SelectFormField, TextFormField } from 'types';
import { FormFieldType } from 'types/Enums';

import BoolArray from 'components/inputs/BoolArray';
import TextField from 'components/inputs/TextField';

export type FieldViewProps<FormValues> = Pick<UseFormReturn<FormValues>, 'formState' | 'register' | 'control' | 'getValues'> & {
  field: TextFormField | SelectFormField;
  index: number;
  disabled?: boolean;
};

const FieldView = <FormValues extends FieldValues>({ register, field, formState, index, control, getValues, disabled = false }: FieldViewProps<FormValues>) => (
  <>
    <input {...register(`answers.${index}.field.id` as Path<FormValues>)} type='hidden' value={field.id} />
    {field.type === FormFieldType.TEXT_ANSWER ? (
      <>
        <Typography sx={{ color: (theme) => theme.palette.text[disabled ? 'disabled' : 'primary'] }}>{`${field.title} ${
          field.required ? '*' : ''
        }`}</Typography>
        <TextField
          disabled={disabled}
          formState={formState}
          {...register(`answers.${index}.answer_text` as Path<FormValues>)}
          maxRows={3}
          multiline
          required={field.required}
        />
      </>
    ) : field.type === FormFieldType.MULTIPLE_SELECT ? (
      <BoolArray
        control={control}
        disabled={disabled}
        formState={formState}
        getPathToObject={(obj) => obj?.['answers']?.[index]?.['selected_options']}
        getValues={getValues}
        label={field.title}
        name={`answers.${index}.selected_options` as Path<FormValues>}
        optionLabelKey='title'
        options={field.options}
        optionValueKey='id'
        required={field.required}
        type='checkbox'
      />
    ) : (
      <BoolArray
        control={control}
        defaultValue={[field.options[0]]}
        disabled={disabled}
        formState={formState}
        getPathToObject={(obj) => obj?.['answers']?.[index]?.['selected_options']}
        getValues={getValues}
        label={field.title}
        name={`answers.${index}.selected_options` as Path<FormValues>}
        optionLabelKey='title'
        options={field.options}
        optionValueKey='id'
        required={field.required}
        type='radio'
      />
    )}
  </>
);

export default FieldView;
