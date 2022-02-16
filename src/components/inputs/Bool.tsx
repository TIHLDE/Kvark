import {
  FormControlLabel,
  FormControlLabelProps,
  Checkbox as MuiCheckbox,
  FormControl as MuiFormControl,
  FormHelperText as MuiFormHelperText,
  Switch as MuiSwitch,
  styled,
} from '@mui/material';
import { Controller, FieldError, FieldValues, Path, PathValue, RegisterOptions, UnpackNestedValue, UseFormReturn } from 'react-hook-form';

export type BoolProps<FormValues extends FieldValues = FieldValues> = Omit<FormControlLabelProps, 'control'> &
  Pick<UseFormReturn<FormValues>, 'formState' | 'control'> & {
    name: Path<FormValues>;
    helperText?: React.ReactNode;
    rules?: RegisterOptions<FormValues>;
    type: 'checkbox' | 'switch';
  };

export const Switch = styled(MuiSwitch)(({ theme }) => ({
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

const Bool = <FormValues extends FieldValues>({ helperText, type, control, name, formState, rules = {}, ...props }: BoolProps<FormValues>) => {
  const Child = type === 'switch' ? Switch : MuiCheckbox;
  const { [name]: fieldError } = formState.errors;
  const error = fieldError as FieldError;
  return (
    <MuiFormControl component='fieldset' error={Boolean(error)} required={Boolean(rules.required)}>
      <Controller
        control={control}
        defaultValue={false as UnpackNestedValue<PathValue<FormValues, Path<FormValues>>>}
        name={name}
        render={({ field: { value, onChange } }) => (
          <FormControlLabel {...props} control={<Child checked={value as boolean} onChange={(e) => onChange(e.target.checked)} />} />
        )}
        rules={rules}
      />
      {helperText && <MuiFormHelperText>{helperText}</MuiFormHelperText>}
      <MuiFormHelperText>{error?.message}</MuiFormHelperText>
    </MuiFormControl>
  );
};

export default Bool;
