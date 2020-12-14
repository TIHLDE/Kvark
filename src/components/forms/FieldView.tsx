import React from 'react';
import { TextFormField, SelectFormField } from 'types/Types';
import { FormFieldType } from 'types/Enums';

// Material UI
import TextField from '@material-ui/core/TextField';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';

export type FieldViewProps = {
  field: TextFormField | SelectFormField;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  index: number;
};

const FieldView = ({ field, register, errors, index }: FieldViewProps) => {
  const error = errors?.answers && errors.answers[index]?.selected_options?.message;

  if (field.type === FormFieldType.TEXT_ANSWER) {
    return (
      <>
        <input name={`answers[${index}].field`} ref={register} type='hidden' value={field.id} />
        <TextField
          defaultValue=''
          error={Boolean(error)}
          fullWidth
          helperText={error && (error || 'Feltet er påkrevd')}
          inputRef={register}
          label={field.title}
          margin='normal'
          name={`answers[${index}].text_answer`}
          required={field.required}
          variant='outlined'
        />
      </>
    );
  } else if (field.type === FormFieldType.MULTIPLE_SELECT) {
    return (
      <FormControl component='fieldset' error={Boolean(error)} fullWidth margin='normal' required={field.required}>
        <FormLabel component='legend'>{field.title}</FormLabel>
        <input name={`answers[${index}].field`} ref={register} type='hidden' value={field.id} />
        <FormGroup>
          {field.options.map((option) => (
            <FormControlLabel
              control={<Checkbox inputRef={register} name={`answers[${index}].selected_options`} value={option.id} />}
              key={option.id}
              label={option.text}
            />
          ))}
        </FormGroup>
        {Boolean(error) && <FormHelperText>{error || 'Feltet er påkrevd'}</FormHelperText>}
      </FormControl>
    );
  } else {
    return (
      <FormControl component='fieldset' error={Boolean(error)} fullWidth margin='normal' required={field.required}>
        <FormLabel component='legend'>{field.title}</FormLabel>
        <input name={`answers[${index}].field`} ref={register} type='hidden' value={field.id} />
        <RadioGroup defaultValue={field.options[0].id} name={`answers[${index}].selected_options`}>
          {field.options.map((option) => (
            <FormControlLabel control={<Radio inputRef={register} value={option.id} />} key={option.id} label={option.text} />
          ))}
        </RadioGroup>
        {Boolean(error) && <FormHelperText>{error || 'Feltet er påkrevd'}</FormHelperText>}
      </FormControl>
    );
  }
};

export default FieldView;
