import { TextFormField, SelectFormField } from 'types/Types';
import { FormFieldType } from 'types/Enums';
import { UseFormReturn } from 'react-hook-form';

// Material UI
import { TextField, RadioGroup, FormLabel, FormControl, FormGroup, FormControlLabel, FormHelperText, Checkbox, Radio } from '@material-ui/core';

export type FieldViewProps = Pick<UseFormReturn, 'formState' | 'register'> & {
  field: TextFormField | SelectFormField;
  index: number;
};

const FieldView = ({ register, field, formState, index }: FieldViewProps) => {
  const error = formState.errors?.answers && formState.errors.answers[index]?.selected_options?.message;

  if (field.type === FormFieldType.TEXT_ANSWER) {
    const fieldRegister = register(`answers.${index}.text_answer`);
    return (
      <>
        <input {...register(`answers.${index}.field`)} type='hidden' value={field.id} />
        <TextField
          defaultValue=''
          error={Boolean(error)}
          fullWidth
          helperText={error && (error || 'Feltet er påkrevd')}
          inputRef={fieldRegister.ref}
          label={field.title}
          margin='normal'
          name={fieldRegister.name}
          onChange={fieldRegister.onChange}
          required={field.required}
          variant='outlined'
        />
      </>
    );
  } else if (field.type === FormFieldType.MULTIPLE_SELECT) {
    const fieldRegister = register(`answers.${index}.selected_options`);
    return (
      <FormControl component='fieldset' error={Boolean(error)} fullWidth margin='normal' required={field.required}>
        <FormLabel component='legend'>{field.title}</FormLabel>
        <input {...register(`answers.${index}.field`)} type='hidden' value={field.id} />
        <FormGroup>
          {field.options.map((option) => (
            <FormControlLabel
              control={
                <Checkbox
                  inputRef={fieldRegister.ref}
                  name={fieldRegister.name}
                  onBlur={fieldRegister.onBlur}
                  onChange={fieldRegister.onChange}
                  value={option.id}
                />
              }
              key={option.id}
              label={option.title}
            />
          ))}
        </FormGroup>
        {Boolean(error) && <FormHelperText>{error || 'Feltet er påkrevd'}</FormHelperText>}
      </FormControl>
    );
  } else {
    const fieldRegister = register(`answers.${index}.selected_options`);
    return (
      <FormControl component='fieldset' error={Boolean(error)} fullWidth margin='normal' required={field.required}>
        <FormLabel component='legend'>{field.title}</FormLabel>
        <input {...register(`answers.${index}.field`)} type='hidden' value={field.id} />
        <RadioGroup defaultValue={field.options[0]?.id} name={`answers.${index}.selected_options`}>
          {field.options.map((option) => (
            <FormControlLabel control={<Radio inputRef={fieldRegister.ref} value={option.id} />} key={option.id} label={option.title} />
          ))}
        </RadioGroup>
        {Boolean(error) && <FormHelperText>{error || 'Feltet er påkrevd'}</FormHelperText>}
      </FormControl>
    );
  }
};

export default FieldView;
