import { Badge } from '~/components/ui/badge';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '~/components/ui/command';
import { CommandEmpty } from 'cmdk';
import { XIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

export type UserSelectOption = {
  id: string;
  name: string;
};

export type UserSelectProps = {
  placeholder?: string;
  users: UserSelectOption[];
  search?: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  onChange?: (value: string[]) => void;
  value?: string[];
  multiple?: boolean;
};

/**
 *
 * @param props - The props for the UserSelect compo
 * @param props.onChange - Even if multiple is set to true, this will always return an array of ids.
 * @param props.value - The value of the select. This should always be an array of ids, even if multiple is set to false.
 * @returns
 */
export default function UserSelect(props: UserSelectProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<UserSelectOption[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleUnselect = useCallback((option: string) => {
    setSelected((prev) => prev.filter((s) => s !== option));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (inputValue === '') {
          setSelected((prev) => {
            return prev.slice(0, -1);
          });
        }
      }
    },
    [inputValue],
  );

  const selectables = props.users.filter((option) => {
    return !selected.some((selectedOption) => {
      return JSON.stringify(option) === JSON.stringify(selectedOption);
    });
  });

  return (
    <Command className='overflow-visible bg-transparent' onKeyDown={handleKeyDown}>
      <div className='group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'>
        <div className='flex flex-wrap gap-1'>
          {selected.map((framework) => {
            return (
              <Badge key={framework} variant='secondary'>
                {framework}
                <button
                  className='ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2'
                  onClick={() => handleUnselect(framework)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(framework);
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
            }}
            placeholder={props.placeholder}
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
                      key={option.user_id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        setInputValue('');
                        setSelected((prev) => [...prev, option]);
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
