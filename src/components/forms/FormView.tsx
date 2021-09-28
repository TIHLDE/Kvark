import { Form } from 'types';
import { UseFormReturn } from 'react-hook-form';
import { Typography, TypographyProps } from '@mui/material';

// Project components
import FieldView from 'components/forms/FieldView';

export type FormViewProps<FormValues> = Pick<UseFormReturn<FormValues>, 'formState' | 'register' | 'control' | 'getValues'> & {
  form: Form;
  disabled?: boolean;
  alignText?: TypographyProps['align'];
};

// eslint-disable-next-line comma-spacing
const FormView = <FormValues,>({ form, register, formState, control, getValues, disabled = false, alignText }: FormViewProps<FormValues>) => (
  <>
    {!form.fields.length && (
      <Typography align={alignText} variant='body2'>
        Dette spørreskjemaet inneholder ingen spørsmål.
      </Typography>
    )}
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

export default FormView;
