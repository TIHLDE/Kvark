import FormControl, { FormControlProps } from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MuiSelect from '@mui/material/Select';
import { Path, Controller, RegisterOptions, UseFormReturn, FieldError, UnpackNestedValue, PathValue } from 'react-hook-form';
import CustomTooltip from 'components/layout/ToolTip';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  grid: {
    display: 'grid',
    gridGap: theme.spacing(2),
    gridTemplateColumns: '1fr 40px',
    width: '100%',
  },
  normal: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    width: '100%',
  },
}));

export type SelectProps<FormValues> = FormControlProps &
  Pick<UseFormReturn<FormValues>, 'formState' | 'control'> & {
    name: Path<FormValues>;
    rules?: RegisterOptions;
    children: React.ReactNode;
    label: string;
    defaultValue?: string;
    tooltip?: string;
  };

// eslint-disable-next-line comma-spacing
const Select = <FormValues,>({ name, label, control, formState, tooltip, rules = {}, defaultValue = '', children, ...props }: SelectProps<FormValues>) => {
  const labelId = `${name}-label`;
  const classes = useStyles();
  return (
    <FormControl fullWidth margin='normal' variant='outlined' {...props}>
      <div className={tooltip ? classes.grid : classes.normal}>
        <InputLabel id={labelId} required={Boolean(formState.errors[name] as FieldError)}>
          {label}
        </InputLabel>
        <Controller
          control={control}
          defaultValue={defaultValue as UnpackNestedValue<PathValue<FormValues, Path<FormValues>>>}
          name={name}
          render={({ field }) => (
            <MuiSelect {...field} error={Boolean(formState.errors[name] as FieldError)} label={label} labelId={labelId}>
              {children}
            </MuiSelect>
          )}
          rules={rules}
        />

        {tooltip ? <CustomTooltip title={tooltip} /> : ''}
      </div>
      {Boolean(formState.errors[name] as FieldError) && (
        <FormHelperText error variant='outlined'>
          {(formState.errors[name] as FieldError)?.message}
        </FormHelperText>
      )}
    </FormControl>
  );
};
export default Select;
