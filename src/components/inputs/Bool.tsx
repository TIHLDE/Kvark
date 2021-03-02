import { Controller, RegisterOptions, UseFormMethods } from 'react-hook-form';

// Material UI Components
import MuiFormControlLabel, { FormControlLabelProps } from '@material-ui/core/FormControlLabel';
import MuiCheckbox from '@material-ui/core/Checkbox';
import MuiSwitch from '@material-ui/core/Switch';
import MuiFormControl from '@material-ui/core/FormControl';
import MuiFormHelperText from '@material-ui/core/FormHelperText';

export type IBoolProps = Omit<FormControlLabelProps, 'control'> &
  Pick<UseFormMethods, 'control' | 'errors'> & {
    name: string;
    helperText?: string;
    rules?: RegisterOptions;
    type: 'checkbox' | 'switch';
  };

const Bool = ({ helperText, type, control, name, errors = {}, rules = {}, ...props }: IBoolProps) => {
  const Child = type === 'switch' ? MuiSwitch : MuiCheckbox;
  return (
    <MuiFormControl component='fieldset' error={Boolean(errors[name])} required={Boolean(rules.required)}>
      <Controller
        control={control}
        name={name}
        render={({ onChange, value }) => (
          <MuiFormControlLabel {...props} control={<Child checked={value} color='primary' onChange={(e) => onChange(e.target.checked)} />} />
        )}
        rules={rules}
      />
      <MuiFormHelperText>
        {errors[name]?.message} {helperText}
      </MuiFormHelperText>
    </MuiFormControl>
  );
};

export default Bool;
