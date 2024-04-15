import { Checkbox, FormControl, FormControlLabel, FormControlLabelProps, FormGroup, FormHelperText, FormLabel, Radio } from '@mui/material';
import { Controller, FieldError, Path, PathValue, RegisterOptions, UnpackNestedValue, UseFormReturn } from 'react-hook-form';

import { Switch } from 'components/inputs/Bool';

export type BoolArrayProps<OptionType, FormValues> = Pick<FormControlLabelProps, 'label' | 'disabled'> &
  // TODO: Fix type
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Pick<UseFormReturn<FormValues>, 'formState' | 'control' | 'getValues'> & {
    name: Path<FormValues>;
    helperText?: string;
    rules?: RegisterOptions;
    required?: boolean;
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

const BoolArray = <OptionType, FormValues>({
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
  required,
}: BoolArrayProps<OptionType, FormValues>) => {
  const error = getPathToObject ? getPathToObject(formState.errors) : formState.errors;
  const Child = type === 'switch' ? Switch : type === 'checkbox' ? Checkbox : Radio;
  const handleCheck = (checkedValue: OptionType[typeof optionValueKey]) => {
    if (type === 'radio') {
      return [{ [optionValueKey]: checkedValue }];
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const values: OptionType[] = (getPathToObject ? getPathToObject(getValues()) : getValues()[name]) || [];
    const valueAlreadyChecked = values.some((value) => value[optionValueKey] === checkedValue);
    return valueAlreadyChecked ? values.filter((option) => option[optionValueKey] !== checkedValue) : [...(values ?? []), { [optionValueKey]: checkedValue }];
  };
  return (
    <FormControl component='fieldset' disabled={disabled} fullWidth>
      <FormLabel component='legend' sx={{ color: (theme) => theme.palette.text.primary }}>
        {`${label} ${required ? '*' : ''}`}
      </FormLabel>
      <FormGroup>
        <Controller
          // TODO: Fix type
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          control={control}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          defaultValue={defaultValue as UnpackNestedValue<PathValue<FormValues, Path<FormValues>>>}
          name={name}
          render={({ field }) => (
            <>
              {options.map((option, i) => (
                <FormControlLabel
                  control={
                    <Child
                      checked={(field.value as Array<OptionType>).some((o: OptionType) => o[optionValueKey] === option[optionValueKey])}
                      onChange={() => field.onChange(handleCheck(option[optionValueKey]))}
                    />
                  }
                  key={i}
                  label={option[optionLabelKey] as unknown as string}
                />
              ))}
            </>
          )}
          rules={rules}
        />
      </FormGroup>
      <FormHelperText error={Boolean(error)}>
        {(error as FieldError)?.message} {helperText}
      </FormHelperText>
    </FormControl>
  );
};

export default BoolArray;
