import { Button } from '~/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '~/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '~/components/ui/drawer';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import useMediaQuery, { MEDIUM_SCREEN } from '~/hooks/MediaQuery';
import { useUsers } from '~/hooks/User';
import { useDebounce } from '~/hooks/Utils';
import { cn } from '~/lib/utils';
import type { Group, UserBase } from '~/types';
import { useState } from 'react';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

import MultiSelect from './MultiSelect';

type SingleUserSearchProps<TFormValues extends FieldValues> = {
  form: UseFormReturn<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  required?: boolean;
  inGroup?: Group['slug'];
  className?: string;
  user?: UserBase | null;
};

// Search for users in TIHLDE. Must be used in a React-Hook-Form.
export const SingleUserSearch = <TFormValues extends FieldValues>({
  form,
  name,
  label,
  required,
  inGroup,
  className,
  user,
}: SingleUserSearchProps<TFormValues>) => {
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
                    {user && !selectedUser
                      ? `${user.first_name} ${user.last_name}`
                      : selectedUser
                        ? `${selectedUser.first_name} ${selectedUser.last_name}`
                        : 'Søk etter bruker'}
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
                                setOpen(false);
                              }}
                            >
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
                            }}
                          >
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

type MultiUserSearchProps<TFormValues extends FieldValues> = {
  form: UseFormReturn<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  required?: boolean;
  inGroup?: Group['slug'];
  description?: string;
};

// Search for multiple users in TIHLDE. Must be used in a React-Hook-Form.
export const MultiUserSearch = <TFormValues extends FieldValues>({ form, name, label, required, inGroup, description }: MultiUserSearchProps<TFormValues>) => {
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 500);

  const { data } = useUsers({ search: debouncedSearch || undefined, in_group: inGroup });

  const options = data?.pages.map((page) => page.results);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label} {required && <span className='text-red-300'>*</span>}
          </FormLabel>
          <FormControl>
            <MultiSelect
              onChange={(values) => {
                field.onChange(values.map(({ value }) => value));
              }}
              options={
                options?.[0].map((option) => ({
                  value: option.user_id,
                  label: `${option.first_name} ${option.last_name}`,
                })) || []
              }
              setSearch={setSearch}
            />
          </FormControl>
          <FormMessage />
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
};
