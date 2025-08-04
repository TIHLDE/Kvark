import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '~/components/ui/select';
import { ComponentProps, useMemo } from 'react';

import { FieldBase } from '.';
import { useFieldContext } from '../AppForm';

type SelectFieldProps = ComponentProps<typeof FieldBase> & {
  group?: {
    id: string;
    label: string;
  }[];
  options: {
    groupId?: string;
    value: string;
    content: React.ReactNode;
  }[];
  placeholder?: React.ReactNode;
};

export function SelectField({ group, options, placeholder, ...props }: SelectFieldProps) {
  const field = useFieldContext<string>();

  const [grouped, freestanding] = useMemo(() => {
    const grouped = group?.map((g) => {
      const groupOptions = options.filter((o) => o.groupId === g.id);
      return {
        id: g.id,
        label: g.label,
        options: groupOptions.map((o) => ({
          value: o.value,
          content: o.content,
        })),
      };
    });
    const freestanding = options.filter((o) => !o.groupId);

    return [grouped, freestanding];
  }, [group, options]);

  return (
    <Select value={field.state.value} onValueChange={field.handleChange}>
      <FieldBase {...props}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder || 'Velg'} />
        </SelectTrigger>
      </FieldBase>
      <SelectContent>
        {freestanding.map((opt) => (
          <SelectItem key={`free-${opt.value}`} value={opt.value}>
            {opt.content}
          </SelectItem>
        ))}

        {grouped?.map((group) => (
          <SelectGroup key={group.id}>
            <SelectLabel>{group.label}</SelectLabel>
            {group.options.map((opt) => (
              <SelectItem key={`group-${opt.value}`} value={opt.value}>
                {opt.content}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
