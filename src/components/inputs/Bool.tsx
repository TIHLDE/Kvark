import { Control, Controller, RegisterOptions, UseFormReturn } from 'react-hook-form';

// Material UI Components
import {
  styled,
  FormControlLabel,
  FormControlLabelProps,
  Checkbox as MuiCheckbox,
  Switch as MuiSwitch,
  FormControl as MuiFormControl,
  FormHelperText as MuiFormHelperText,
} from '@material-ui/core';

export type IBoolProps = Omit<FormControlLabelProps, 'control'> &
  Pick<UseFormReturn, 'formState'> & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
    name: string;
    helperText?: string;
    rules?: RegisterOptions;
    type: 'checkbox' | 'switch';
  };

const Switch = styled(MuiSwitch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&:before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&:after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const Bool = ({ helperText, type, control, name, formState, rules = {}, ...props }: IBoolProps) => {
  const Child = type === 'switch' ? Switch : MuiCheckbox;
  return (
    <MuiFormControl component='fieldset' error={Boolean(formState.errors[name])} required={Boolean(rules.required)}>
      <Controller
        control={control}
        defaultValue={false}
        name={name}
        render={({ field: { value, onChange } }) => (
          <FormControlLabel {...props} control={<Child checked={value} onChange={(e) => onChange(e.target.checked)} />} />
        )}
        rules={rules}
      />
      <MuiFormHelperText>
        {formState.errors[name]?.message} {helperText}
      </MuiFormHelperText>
    </MuiFormControl>
  );
};

export default Bool;
