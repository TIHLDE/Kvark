import { Badge } from '~/components/ui/badge';
import { Command, CommandGroup, CommandItem, CommandList } from '~/components/ui/command';
import { Command as CommandPrimitive } from 'cmdk';
import { X } from 'lucide-react';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

export type MultiSelectOption = {
  value: string;
  label: string;
};

interface Props {
  options: MultiSelectOption[];
  onChange?: (values: { value: string; label: string }[]) => void;
  setSearch?: Dispatch<SetStateAction<string>>;
  placeholder?: string;
}

const MultiSelect = ({ onChange, options, setSearch, placeholder = 'Velg bruker...' }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<MultiSelectOption[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleUnselect = useCallback((option: MultiSelectOption) => {
    setSelected((prev) => prev.filter((s) => s.value !== option.value));
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (input.value === '') {
          setSelected((prev) => {
            const newSelected = [...prev];
            newSelected.pop();
            return newSelected;
          });
        }
      }
      // This is not a default behaviour of the <input /> field
      if (e.key === 'Escape') {
        input.blur();
      }
    }
  }, []);

  const selectables = options.filter((option) => {
    return !selected.some((selectedOption) => {
      return JSON.stringify(option) === JSON.stringify(selectedOption);
    });
  });

  useEffect(() => {
    onChange?.(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <Command className='overflow-visible bg-transparent' onKeyDown={handleKeyDown}>
      <div className='group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'>
        <div className='flex flex-wrap gap-1'>
          {selected.map((framework) => {
            return (
              <Badge key={framework.value} variant='secondary'>
                {framework.label}
                <button
                  className='ml-1 rounded-full outline-hidden ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2'
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
                  <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            className='ml-2 flex-1 bg-transparent outline-hidden placeholder:text-muted-foreground'
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onValueChange={(value) => {
              setInputValue(value);
              setSearch?.(value);
            }}
            placeholder={placeholder}
            ref={inputRef}
            value={inputValue}
          />
        </div>
      </div>
      <div className='relative mt-2'>
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className='absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-hidden animate-in'>
              <CommandGroup className='h-full overflow-auto'>
                {selectables.map((option) => {
                  return (
                    <CommandItem
                      className={'cursor-pointer'}
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        setInputValue('');
                        setSelected((prev) => [...prev, option]);
                      }}>
                      {option.label}
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
};

export default MultiSelect;
