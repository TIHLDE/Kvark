import FormControl, { FormControlProps } from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MuiSelect from '@material-ui/core/Select';
import { Control, Controller, RegisterOptions, UseFormReturn } from 'react-hook-form';

export type SelectProps = FormControlProps &
  Pick<UseFormReturn, 'formState'> & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
    name: string;
    rules?: RegisterOptions;
    children: React.ReactNode;
    label: string;
    defaultValue?: string;
  };

const Select = ({ name, label, control, formState, rules = {}, defaultValue = '', children, ...props }: SelectProps) => {
  const labelId = `${name}-label`;
  return (
    <FormControl fullWidth margin='normal' variant='outlined' {...props}>
      <InputLabel id={labelId} required={Boolean(formState.errors[name])}>
        {label}
      </InputLabel>
      <Controller
        control={control}
        defaultValue={defaultValue}
        name={name}
        render={({ field }) => (
          <MuiSelect {...field} error={Boolean(formState.errors[name])} label={label} labelId={labelId}>
            {children}
          </MuiSelect>
        )}
        rules={rules}
      />
      {Boolean(formState.errors[name]) && (
        <FormHelperText error variant='outlined'>
          {formState.errors[name]}
        </FormHelperText>
      )}
    </FormControl>
  );
};
export default Select;
