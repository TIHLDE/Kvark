import { cn } from '~/lib/utils';
import { useCallback, useMemo, useState } from 'react';

import { Checkbox } from './checkbox';

type MultiCheckboxProps = {
  className?: string;
  items: { value: string; label: string; disabled?: boolean }[];
  value?: string[];
  onChange?: (value: string[]) => void;
};

export function MultiCheckbox({ items, className, ...props }: MultiCheckboxProps) {
  const isControlled = useMemo(() => Object.hasOwn(props, 'value'),[props]);

  
  const [internalValue, setInternalValue] = useState(isControlled ? props.value : []);
  const currentValue = useMemo(() => (Array.isArray(props.value) ? props.value : internalValue), [props.value, internalValue]);

  const toggleItem = useCallback(
    (itemValue: string, checked: boolean) => {
      const set = new Set(currentValue);
      if (checked) {
        set.add(itemValue);
      } else {
        set.delete(itemValue);
      }

      const next = Array.from(set);
      setInternalValue(next);
      props.onChange?.(next);
    },
    [props.onChange, currentValue],
  );

  const checkedMap = useMemo(() => {
    return items.reduce((acc, item) => {
      acc[item.value] = currentValue?.includes?.(item.value) ?? false;
      return acc;
    }, {} as Record<string, boolean>);
  }, [items, currentValue]);

  return (
    <div className={cn('grid gap-2', className)}>
      {items.map((item, index) => (
        <label key={index} className='flex gap-2 items-center'>
          <Checkbox checked={checkedMap[item.value]} disabled={item.disabled} onCheckedChange={(checked) => toggleItem(item.value, Boolean(checked))} />
          {item.label}
        </label>
      ))}
    </div>
  );
}
