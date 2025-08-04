import { Input } from '~/components/ui/input';
import { ComponentProps } from 'react';

import { FieldBase, InputBaseProps } from '.';
import { useFieldContext } from '../AppForm';

type InputFieldProps = ComponentProps<typeof Input> & Omit<InputBaseProps, 'required'>;

export function InputField({ label, description, ...props }: InputFieldProps) {
  const field = useFieldContext<string | number>();
  return (
    <FieldBase label={label} description={description} required={props.required}>
      <Input {...props} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
    </FieldBase>
  );
}
