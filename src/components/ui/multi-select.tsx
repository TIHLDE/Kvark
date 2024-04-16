import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Button } from './button';
import { X } from 'lucide-react';
import { ScrollArea } from './scroll-area';
import { Checkbox } from './checkbox';
import { Label } from './label';
import { CheckedState } from '@radix-ui/react-checkbox';


type Option =  {
  value: string;
  label: string;
}

type MultiSelectProps = {
  options: Option[] | undefined;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  placeholder: string;
};

const MultiSelect = ({
  options,
  value,
  setValue,
  placeholder
}: MultiSelectProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [searchOptions, setSearchOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<Option[]>([]);

  const search = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    const searchValue = event.target.value.toLowerCase();
    const filteredOptions = options && options.filter((option) =>
      option.value.toLowerCase().includes(searchValue)
    );
    filteredOptions && setSearchOptions(filteredOptions);
    setOpen(true);
  };

  const handleSelect = (checked: CheckedState, option: Option) => {
    checked 
      ? setSelected([...selected, option])
      : setSelected(selected.filter((item) => item.value !== option.value));
    
    checked && setValue('');
  }

  const handleUnselect = (option: Option) => setSelected(selected.filter((item) => item.value !== option.value));

  const handleUnselectAll = () => setSelected([]);

  
  const handleClickOutside = (event: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setOpen(false);
    }
  };
  
  const isChecked = (option: Option) => Boolean(selected.find((s) => s.value === option.value));
  
  
  const handleClickInside = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  return (
    <div 
      className='w-full space-y-2 multi-select-container'      
      ref={wrapperRef}
    >
      <div className='w-full flex justify-between min-h-10 cursor-text rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'>

        <div
          className='w-full flex items-center space-x-2 gap-y-1 flex-wrap'
          onClick={handleClickInside}
        >
          {selected.map((option, index) => (
            <div 
              className='flex items-center space-x-2 px-2 py-1 rounded-md border border-border'
              key={index} 
            >
              <p className='text-xs'>
                {option.label}
              </p>
              <Button
                className='rounded-full h-5 w-5'
                size='icon'
                variant='secondary'
                onClick={() => handleUnselect(option)}
              >
                <X className='w-3 h-3' />
              </Button>
            </div>
          ))}

          <input 
            ref={inputRef}
            type='text'
            placeholder={placeholder && selected.length === 0 ? placeholder : 'Søk...'}
            value={value}
            onChange={search}
            onFocus={() => setOpen(true)}
            className='bg-inherit focus:outline-none'
          />
        </div>

        <Button
          className='w-6 h-6 rounded-full'
          size='icon'
          variant='ghost'
          onClick={handleUnselectAll}
        >
          <X className='w-4 h-4 stroke-[1.5px]' />
        </Button>
      </div>
      
      {open && searchOptions.length > 0 && value.length > 0 && (
        <div className='rounded-md border border-input bg-background py-2'>
          <ScrollArea className='w-full h-[100px]'>
            {searchOptions.map((option, index) => (
              <div
                key={index}
                className='w-full flex items-center px-2 space-x-2 cursor-pointer hover:bg-secondary'
              >
                <Checkbox
                  checked={isChecked(option)}
                  id={option.value}
                  onCheckedChange={(checked) => handleSelect(checked, option)}
                />
                <Label
                  className='w-full cursor-pointer p-2'
                  htmlFor={option.value}
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </ScrollArea>
        </div>  
      )}
    </div>
  );
}

export default MultiSelect;