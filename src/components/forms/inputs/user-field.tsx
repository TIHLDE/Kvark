import UserSelect from '~/components/inputs/UserSelect';
import { useState } from 'react';

import { FieldBase, InputBaseProps } from '.';

type UserFieldProps = InputBaseProps & {
  multiple?: boolean;
  placeholder?: string;
};

const options = [
  { name: 'Alice Hevense', user_id: 'ahevense' },
  { name: 'Bob Brun', user_id: 'bbrun' },
  { name: 'Charlie Dean', user_id: 'cdean' },
  { name: 'David Franklin', user_id: 'dfranklin' },
  { name: 'Eve Jones', user_id: 'ejones' },
  { name: 'Frank Smith', user_id: 'fsmith' },
  { name: 'George Thomas', user_id: 'gthomas' },
  { name: 'Hannah White', user_id: 'hwhite' },
  { name: 'Ivy Johnson', user_id: 'ijohnson' },
  { name: 'Kevin Garcia', user_id: 'kgarcia' },
];

export function UserField({ label, description, required, ...props }: UserFieldProps) {
  const [search, setSearch] = useState<string>('');

  const [value, setValue] = useState<string | string[]>((props.multiple === true ? ([] as string[]) : '') as string | string[]);

  function handleChange(newValue: string | string[]) {
    setValue(newValue);
  }

  if (props.multiple === true && !Array.isArray(value)) {
    throw new Error(`Invalid value type ${typeof value} for UserField with multiple selection enabled. Expected a string[]`);
  }

  if (props.multiple !== true && Array.isArray(value)) {
    throw new Error(`Invalid value type ${typeof value} for UserField with multiple selection disabled. Expected a string`);
  }

  return (
    <FieldBase {...{ label, description, required }}>
      {/* @ts-expect-error This component uses some typescript magic that isn't supported in this case */}
      <UserSelect
        users={options}
        search={search}
        setSearch={setSearch}
        value={value}
        onChange={handleChange}
        multiple={props.multiple}
        placeholder={props.placeholder}
      />
    </FieldBase>
  );
}
