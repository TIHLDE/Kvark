import { useState } from 'react';
import { UseFormReturn, FieldError, Path, FieldValues, Controller, RegisterOptions } from 'react-hook-form';
import { Autocomplete, TextField, ListItemText, TextFieldProps, Chip, Checkbox } from '@mui/material';
import { useUsers } from 'hooks/User';
import { useDebounce } from 'hooks/Utils';
import { getUserClass, getUserStudyShort } from 'utils';

import CheckBoxBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { UserList } from 'types';

export type UserSearchProps<FormValues extends FieldValues = FieldValues> = TextFieldProps &
  Pick<UseFormReturn<FormValues>, 'formState' | 'control'> & {
    name: Path<FormValues>;
    rules?: RegisterOptions;
    label: string;
    helperText?: React.ReactNode;
    /** Whether the user should be able to select multiple users. A list of UserList will be returned */
    multiple?: boolean;
  };

const UserSearch = <FormValues extends FieldValues>({
  name,
  label,
  multiple = false,
  control,
  formState,
  rules = {},
  helperText,
  ...props
}: UserSearchProps<FormValues>) => {
  const { [name]: fieldError } = formState.errors;
  const error = fieldError as FieldError;
  const [selected, setSelected] = useState<Array<UserList> | UserList | null>(multiple ? [] : null);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useUsers({ search: debouncedSearch || undefined });
  const options = data?.pages.map((page) => page.results);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange } }) => (
        <Autocomplete
          disableCloseOnSelect={multiple}
          filterOptions={(x) => x}
          getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
          isOptionEqualToValue={(option, value) => option.user_id === value.user_id}
          loading={isLoading}
          loadingText='Laster...'
          multiple={multiple}
          noOptionsText='Fant ingen brukere'
          onChange={(_, user) => {
            onChange(user);
            setSelected(user);
          }}
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
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              {multiple && (
                <Checkbox checked={selected} checkedIcon={<CheckBoxIcon fontSize='small' />} icon={<CheckBoxBlankIcon fontSize='small' />} sx={{ mr: 1 }} />
              )}
              <ListItemText
                primary={`${option.first_name} ${option.last_name}`}
                secondary={`${getUserClass(option.user_class)} ${getUserStudyShort(option.user_study)}`}
              />
            </li>
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip {...getTagProps({ index })} key={option.user_id} label={`${option.first_name} ${option.last_name}`} variant='outlined' />
            ))
          }
          value={selected}
        />
      )}
      rules={rules}
    />
  );
};

export default UserSearch;
