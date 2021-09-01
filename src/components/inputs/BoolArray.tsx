import { Control, Controller, RegisterOptions, UseFormReturn, UseFormGetValues } from 'react-hook-form';

// Material UI Components
import { FormControlLabel, Radio, FormControlLabelProps, Checkbox as MuiCheckbox, FormHelperText, FormControl, FormGroup, FormLabel } from '@material-ui/core';
import { Switch } from 'components/inputs/Bool';

export type IBoolArrayProps = Omit<FormControlLabelProps, 'control'> &
  Pick<UseFormReturn, 'formState'> & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getValues: UseFormGetValues<any>;
    name: string;
    helperText?: string;
    rules?: RegisterOptions;
    type: 'checkbox' | 'switch' | 'radio';
    /**
     * The options that should be rendered with an id that is returned in the array if selected
     */
    options: Array<{
      label: string;
      value: string;
    }>;
    defaultValue?: Array<string>;
    /**
     * Method that navigates to the object in the form that corresponds to the name,
     * necessary if you pass a array-formed name, ex: `answers.1.selected_options`
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getPathToObject?: (obj: any) => Array<string>;
  };

const BoolArray = ({
  defaultValue = [],
  getPathToObject,
  options,
  helperText,
  type,
  control,
  getValues,
  name,
  formState,
  rules = {},
  disabled,
  label,
}: IBoolArrayProps) => {
  const Child = type === 'switch' ? Switch : type === 'checkbox' ? MuiCheckbox : Radio;
  const handleCheck = (checkedString: string) => {
    if (type === 'radio') {
      return [checkedString];
    }
    const values = getPathToObject ? getPathToObject(getValues()) : getValues();
    return values?.includes(checkedString) ? values?.filter((id: string) => id !== checkedString) : [...(values ?? []), checkedString];
  };
  return (
    <FormControl component='fieldset' disabled={disabled} fullWidth>
      <FormLabel component='legend' sx={{ color: (theme) => theme.palette.text.primary }}>
        {label}
      </FormLabel>
      <FormGroup>
        <Controller
          control={control}
          defaultValue={defaultValue}
          name={name}
          render={({ field }) => (
            <>
              {options.map((option) => (
                <FormControlLabel
                  control={
                    <Child
                      checked={field.value.includes(option.value)}
                      onChange={() => {
                        field.onChange(handleCheck(option.value));
                      }}
                    />
                  }
                  key={option.value}
                  label={option.label}
                />
              ))}
            </>
          )}
          rules={rules}
        />
      </FormGroup>
      <FormHelperText error={Boolean(getPathToObject ? getPathToObject(formState.errors) : formState.errors)}>
        {(getPathToObject ? getPathToObject(formState.errors) : formState.errors)?.message} {helperText}
      </FormHelperText>
    </FormControl>
  );
};

export default BoolArray;
