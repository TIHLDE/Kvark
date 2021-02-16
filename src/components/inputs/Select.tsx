import FormControl, { FormControlProps } from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MuiSelect from '@material-ui/core/Select';
import { Controller, RegisterOptions, UseFormMethods } from 'react-hook-form';

export type IProps = FormControlProps &
  Pick<UseFormMethods, 'errors' | 'control'> & {
    name: string;
    rules?: RegisterOptions;
  } & {
    children: React.ReactNode;
    label: string;
    defaultValue?: string;
  };

const Select = ({ name, label, control, errors = {}, rules = {}, defaultValue = '', children, ...props }: IProps) => {
  const labelId = `${name}-label`;
  return (
    <FormControl fullWidth margin='normal' variant='outlined' {...props}>
      <InputLabel id={labelId} required={Boolean(errors[name])}>
        {label}
      </InputLabel>
      <Controller
        as={
          <MuiSelect error={Boolean(errors[name])} label={label} labelId={labelId}>
            {children}
          </MuiSelect>
        }
        control={control}
        defaultValue={defaultValue}
        name={name}
        rules={rules}
      />
      {Boolean(errors[name]) && (
        <FormHelperText error variant='outlined'>
          {errors[name]}
        </FormHelperText>
      )}
    </FormControl>
  );
};
export default Select;
