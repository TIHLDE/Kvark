import { Checkbox } from '~/components/ui/checkbox';
import { cn } from '~/lib/utils';
import { ComponentProps } from 'react';

import { FieldBase } from '.';
import { useFieldContext } from '../AppForm';

export type MultiCheckboxItem = string | { value: string; label: string };

export type MultiCheckboxFieldProps = ComponentProps<typeof FieldBase> & {
  items: MultiCheckboxItem[];
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (newValue: string[]) => void;
};

export function MultiCheckboxField({ items, multiple = true, disabled = false, className, onChange, ...props }: MultiCheckboxFieldProps) {
  const field = useFieldContext<string[]>();

  const currentValue = Array.isArray(field.state.value) ? field.state.value : [];

  function toggleItem(itemValue: string, checked: boolean) {
    const next = currentValue.filter((v: string) => v !== itemValue);
    if (checked) {
      if (multiple) {
        next.push(itemValue);
      } else {
        next[0] = itemValue;
      }
    }
    field.handleChange(next);
    onChange?.(next);
  }

  return (
    <FieldBase {...props}>
      <div className={cn('w-full space-y-3', className)}>
        {items.map((item, index) => {
          const itemValue = typeof item === 'object' ? item.value : item;
          const itemLabel = typeof item === 'object' ? item.label : item;
          const isChecked = currentValue.includes(itemValue);
          return (
            <div className='flex flex-row items-start space-x-3' key={index}>
              <Checkbox checked={isChecked} disabled={disabled} onCheckedChange={(checked) => toggleItem(itemValue, Boolean(checked))} />
              <span className='font-normal'>{itemLabel}</span>
            </div>
          );
        })}
      </div>
    </FieldBase>
  );
}
