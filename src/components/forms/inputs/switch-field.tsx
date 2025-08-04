import { Switch } from '~/components/ui/switch';
import { ComponentProps } from 'react';

import { FieldBase, InputBaseProps } from '.';
import { useFieldContext } from '../AppForm';

type SwitchFieldProps = ComponentProps<typeof Switch> & Omit<InputBaseProps, 'required'>;

export function SwitchField({ label, description, ...props }: SwitchFieldProps) {
  const field = useFieldContext<boolean>();

  return (
    <FieldBase label={label} description={description} required={props.required}>
      <Switch {...props} checked={field.state.value} onBlur={field.handleBlur} onCheckedChange={field.handleChange} />
    </FieldBase>
  );
}
