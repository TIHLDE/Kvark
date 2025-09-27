import UserSelect from '~/components/inputs/UserSelect';
import { useDebounce } from '~/hooks/Utils';
import { useState } from 'react';

import { FieldBase, InputBaseProps } from '.';
import { useFieldContext } from '../AppForm';

type UserFieldProps = InputBaseProps & {
  multiple?: boolean;
  placeholder?: string;
};

const options = [
  { name: 'Alice Hevense', id: 'ahevense' },
  { name: 'Bob Brun', id: 'bbrun' },
  { name: 'Charlie Dean', id: 'cdean' },
  { name: 'David Franklin', id: 'dfranklin' },
  { name: 'Eve Jones', id: 'ejones' },
  { name: 'Frank Smith', id: 'fsmith' },
  { name: 'George Thomas', id: 'gthomas' },
  { name: 'Hannah White', id: 'hwhite' },
  { name: 'Ivy Johnson', id: 'ijohnson' },
  { name: 'Kevin Garcia', id: 'kgarcia' },
];

export function UserField({ label, description, required, multiple = false, ...props }: UserFieldProps) {
  const field = useFieldContext<string | string[] | undefined>();
  const [search, setSearch] = useState<string>('');

  const { data, isLoading } = useUsers({ search: debouncedSearch || undefined, in_group: inGroup });

  const currentArray = Array.isArray(field.state.value) ? field.state.value : field.state.value ? [field.state.value] : [];

  function handleChange(newValue: string[]) {
    if (multiple) {
      field.handleChange(newValue);
    } else {
      field.handleChange(newValue[0] ?? '');
    }
  }

  return (
    <FieldBase {...{ label, description, required }}>
      <UserSelect users={options} setSearch={setSearch} value={currentArray} onChange={handleChange} multiple={multiple} placeholder={props.placeholder} />
    </FieldBase>
  );
}
