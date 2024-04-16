import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Autocomplete, Checkbox, Chip, TextField, TextFieldProps } from '@mui/material';
import { useState } from 'react';
import { Controller, FieldError, FieldValues, Path, RegisterOptions, UseFormReturn } from 'react-hook-form';

import { Group, UserBase } from 'types';

import { useUsers } from 'hooks/User';
import { useDebounce } from 'hooks/Utils';

import MultiSelect from 'components/ui/multi-select';

export type UserSearchProps<FormValues extends FieldValues = FieldValues> = TextFieldProps &
  Pick<UseFormReturn<FormValues>, 'formState' | 'control'> & {
    name: Path<FormValues>;
    rules?: RegisterOptions;
    label: string;
    helperText?: React.ReactNode;
    /** Only search for users in a specific group */
    inGroup?: Group['slug'];
  } & (
    | {
        /** Whether the user should be able to select multiple users. A list of UserBase will be returned */
        multiple: true;
        /** Initial selected users */
        defaultValue?: Array<UserBase>;
      }
    | {
        /** Whether the user should be able to select multiple users. A list of UserBase will be returned */
        multiple?: false;
        /** Initial selected users */
        defaultValue?: UserBase | null;
      }
  );

/**
 * Search for users in TIHLDE. Should be used in a React-Hook-Form.
 * You can either find a single user or multiple.
 * Use the `inGroup`-prop to only search for users in a specific group.
 */
const UserSearch = <FormValues extends FieldValues>({
  name,
  label,
  multiple = false,
  control,
  formState,
  rules = {},
  helperText,
  inGroup,
  ...props
}: UserSearchProps<FormValues>) => {
  const { [name]: fieldError } = formState.errors;
  const error = fieldError as FieldError;

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useUsers({ search: debouncedSearch || undefined, in_group: inGroup });
  const options = data?.pages.map((page) => page.results);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Autocomplete
          disableCloseOnSelect={multiple}
          filterOptions={(x) => x}
          freeSolo
          getOptionLabel={(option) => (typeof option === 'string' ? option : `${option.first_name} ${option.last_name}`)}
          inputValue={search}
          isOptionEqualToValue={(option, value) => option.user_id === value.user_id}
          loading={isLoading}
          loadingText='Laster...'
          multiple={multiple}
          noOptionsText='Fant ingen brukere'
          onChange={(_, user) => onChange(user)}
          onInputChange={(_, newVal) => setSearch(newVal)}
          options={options?.[0] || []}
          renderInput={(params) => (
            <TextField
              error={Boolean(error)}
              helperText={
                <>
                  {error?.message}
                  {helperText && Boolean(error) && <br />}
                  {helperText}
                </>
              }
              label={label}
              margin='normal'
              variant='outlined'
              {...props}
              {...params}
            />
          )}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              {multiple && (
                <Checkbox checked={selected} checkedIcon={<CheckBoxIcon fontSize='small' />} icon={<CheckBoxBlankIcon fontSize='small' />} sx={{ mr: 1 }} />
              )}
              {`${option.first_name} ${option.last_name}`}
            </li>
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip {...getTagProps({ index })} key={option.user_id} label={`${option.first_name} ${option.last_name}`} variant='outlined' />
            ))
          }
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          value={value || (multiple ? [] : null)}
        />
      )}
      rules={rules}
    />
  );
};

type ShadUserSearchProps = {
  inGroup?: Group['slug'];
};

export const ShadUserSearch = ({ inGroup }: ShadUserSearchProps) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 150);

  const { data, isLoading } = useUsers({ search: debouncedSearch || undefined, in_group: inGroup });
  const options = data?.pages.map((page) => page.results);

  return (
    <MultiSelect
      options={options?.[0].map((user) => ({ label: `${user.first_name} ${user.last_name}`, value: user.user_id }))}
      placeholder='Søk etter bruker...'
      setValue={setSearch}
      value={search}
    />
  );
};

export default UserSearch;
