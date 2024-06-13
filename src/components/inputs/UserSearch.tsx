import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Autocomplete, Checkbox, Chip, TextField, TextFieldProps } from '@mui/material';
import { cn } from 'lib/utils';
import { useState } from 'react';
import { Controller, FieldError, FieldValues, Path, RegisterOptions, UseFormReturn } from 'react-hook-form';

import { Group, UserBase } from 'types';

import useMediaQuery, { MEDIUM_SCREEN } from 'hooks/MediaQuery';
import { useUsers } from 'hooks/User';
import { useDebounce } from 'hooks/Utils';

import { Button } from 'components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from 'components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from 'components/ui/drawer';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';

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

type SingleUserSearchProps<TFormValues extends FieldValues> = {
  form: UseFormReturn<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  required?: boolean;
  inGroup?: Group['slug'];
  className?: string;
};

// Search for users in TIHLDE. Must be used in a React-Hook-Form.
export const SingleUserSearch = <TFormValues extends FieldValues>({ form, name, label, required, inGroup, className }: SingleUserSearchProps<TFormValues>) => {
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<UserBase | null>(null);
  const debouncedSearch = useDebounce(search, 500);

  const isDesktop = useMediaQuery(MEDIUM_SCREEN);

  const { data, isLoading } = useUsers({ search: debouncedSearch || undefined, in_group: inGroup });

  const options = data?.pages.map((page) => page.results);

  if (isDesktop) {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className={cn('w-[400px]', className)}>
            <FormLabel>
              {label} {required && <span className='text-red-300'>*</span>}
            </FormLabel>
            <FormControl>
              <Popover onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild>
                  <Button className='w-full justify-start' variant='outline'>
                    {selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : 'Søk etter bruker'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align='start' className='w-[400px] p-0'>
                  <Command className='w-[400px]'>
                    <CommandInput onValueChange={setSearch} placeholder='Søk etter bruker...' value={search} />
                    <CommandList>
                      <CommandEmpty>{isLoading ? 'Søker...' : 'Ingen brukere funnet'}</CommandEmpty>
                      <CommandGroup>
                        {options &&
                          options[0].map((option, index) => (
                            <CommandItem
                              key={index}
                              onSelect={() => {
                                field.onChange(option);
                                setSelectedUser(option);
                              }}>
                              {`${option.first_name} ${option.last_name}`}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='w-full'>
          <FormLabel>
            {label} {required && <span className='text-red-300'>*</span>}
          </FormLabel>
          <FormControl>
            <Drawer onOpenChange={setOpen} open={open}>
              <DrawerTrigger asChild>
                <Button className='w-full justify-start' variant='outline'>
                  {selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : 'Søk etter bruker'}
                </Button>
              </DrawerTrigger>
              <DrawerContent className='bg-popover'>
                <Command>
                  <CommandInput onValueChange={setSearch} placeholder='Søk etter bruker...' value={search} />
                  <CommandList>
                    <CommandEmpty>{isLoading ? 'Søker...' : 'Ingen brukere funnet'}</CommandEmpty>
                    <CommandGroup>
                      {options &&
                        options[0].map((option, index) => (
                          <CommandItem
                            key={index}
                            onSelect={() => {
                              field.onChange(option);
                              setSelectedUser(option);
                              setOpen(false);
                            }}>
                            {`${option.first_name} ${option.last_name}`}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </DrawerContent>
            </Drawer>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default UserSearch;
