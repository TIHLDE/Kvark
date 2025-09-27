import { Badge } from '~/components/ui/badge';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '~/components/ui/command';
import { CommandEmpty } from 'cmdk';
import { XIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as React from 'react';

export type UserSelectOption = {
  id: string;
  name: string;
};

export type UserSelectProps = {
  placeholder?: string;
  users: UserSelectOption[];
  onSearchChange: (search: string) => void;
  onChange?: (value: string[]) => void;
  value?: string[];
  multiple?: boolean;
};

export default function UserSelect(props: UserSelectProps) {
  const { value, onChange, users, multiple, placeholder, onSearchChange } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [internalSelected, setInternalSelected] = useState<UserSelectOption[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  // Determine if component is controlled
  const isControlled = Object.hasOwn(props, 'value');

  // Get current selected based on controlled/uncontrolled mode
  const selected = useMemo(() => {
    if (isControlled && value && users.length) {
      return users.filter((user) => value.includes(user.id));
    }
    return internalSelected;
  }, [isControlled, value, users, internalSelected]);

  // Update internal state when external value changes (for controlled mode)
  useEffect(() => {
    if (isControlled && value && users.length) {
      const nextSelected = users.filter((user) => value.includes(user.id));
      setInternalSelected(nextSelected);
    }
  }, [isControlled, value, users]);

  // Emit changes for both controlled and uncontrolled modes
  const handleSelectionChange = useCallback(
    (newSelected: UserSelectOption[]) => {
      if (!isControlled) {
        setInternalSelected(newSelected);
      }
      onChange?.(newSelected.map((s) => s.id));
    },
    [isControlled, onChange],
  );

  const handleUnselect = useCallback(
    (option: UserSelectOption) => {
      const newSelected = selected.filter((s) => s.id !== option.id);
      handleSelectionChange(newSelected);
    },
    [selected, handleSelectionChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (inputValue === '') {
          const newSelected = selected.slice(0, -1);
          handleSelectionChange(newSelected);
        }
      }
    },
    [inputValue, selected, handleSelectionChange],
  );

  const selectables = useMemo(() => {
    const selectedIds = new Set(selected.map((s) => s.id));
    return users.filter((option) => !selectedIds.has(option.id));
  }, [users, selected]);

  return (
    <Command className='overflow-visible bg-transparent' onKeyDown={handleKeyDown}>
      <div className='group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'>
        <div className='flex flex-wrap gap-1'>
          {selected.map((option) => {
            return (
              <Badge key={option.id} variant='secondary'>
                {option.name}
                <button
                  className='ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2'
                  onClick={() => handleUnselect(option)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}>
                  <XIcon className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                </button>
              </Badge>
            );
          })}
          <CommandInput
            hideIcon
            className='h-6'
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onValueChange={(value) => {
              setInputValue(value);
              onSearchChange(value);
            }}
            placeholder={placeholder}
            value={inputValue}
          />
        </div>
      </div>
      <div className='relative mt-2'>
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className='absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in'>
              <CommandEmpty>No options available</CommandEmpty>
              <CommandGroup>
                {selectables.map((option) => {
                  return (
                    <CommandItem
                      className={'cursor-pointer'}
                      key={option.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        setInputValue('');
                        const newSelected = multiple ? [...selected, option] : [option];
                        handleSelectionChange(newSelected);
                      }}>
                      {option.name}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}
