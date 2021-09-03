import { Control, Controller, RegisterOptions, UseFormReturn, UseFormGetValues } from 'react-hook-form';

// Material UI Components
import { FormControlLabel, Radio, FormControlLabelProps, Checkbox, FormHelperText, FormControl, FormGroup, FormLabel } from '@material-ui/core';
import { Switch } from 'components/inputs/Bool';

export type IBoolArrayProps<OptionType> = Pick<FormControlLabelProps, 'label' | 'disabled'> &
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
     * The options that should be rendered
     */
    options: Array<OptionType>;
    /**
     * Key in each option that should be shown to the user
     */
    optionLabelKey: keyof OptionType;
    /**
     * Key in each option that should be returned as value: `{ [keyof optionValue]: optionValue }`.
     *
     * Ex.: Selected option: `{id: 2, label: 3}`, optionValueKey: `id`, returned: `[{ id: 2 }]`
     */
    optionValueKey: keyof OptionType;
    defaultValue?: Array<OptionType>;
    /**
     * Method that navigates to the object in the form that corresponds to the name,
     * necessary if you pass a array-formed name, ex: `answers.1.selected_options`.
     *
     * Defaults assuming the object can be found at the first-level in the object returned from `getValues()`
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getPathToObject?: (obj: any) => Array<string>;
  };

// eslint-disable-next-line comma-spacing
const BoolArray = <OptionType,>({
  defaultValue = [],
  getPathToObject,
  options,
  optionLabelKey,
  optionValueKey,
  helperText,
  type,
  control,
  getValues,
  name,
  formState,
  rules = {},
  disabled,
  label,
}: IBoolArrayProps<OptionType>) => {
  const error = getPathToObject ? getPathToObject(formState.errors) : formState.errors;
  const Child = type === 'switch' ? Switch : type === 'checkbox' ? Checkbox : Radio;
  const handleCheck = (checkedValue: OptionType[typeof optionValueKey]) => {
    if (type === 'radio') {
      return [{ [optionValueKey]: checkedValue }];
    }
    const values: OptionType[] | null = getPathToObject ? getPathToObject(getValues()) : getValues()[name];
    return values?.some((value) => value[optionValueKey] === checkedValue)
      ? values.filter((option) => option[optionValueKey] !== checkedValue)
      : [...(values ?? []), { [optionValueKey]: checkedValue }];
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
              {options.map((option, i) => (
                <FormControlLabel
                  control={
                    <Child
                      checked={field.value.some((o: OptionType) => o[optionValueKey] === option[optionValueKey])}
                      onChange={() => field.onChange(handleCheck(option[optionValueKey]))}
                    />
                  }
                  key={i}
                  label={option[optionLabelKey]}
                />
              ))}
            </>
          )}
          rules={rules}
        />
      </FormGroup>
      <FormHelperText error={Boolean(error)}>
        {error?.message} {helperText}
      </FormHelperText>
    </FormControl>
  );
};

export default BoolArray;
