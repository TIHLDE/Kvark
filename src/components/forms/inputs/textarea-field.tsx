import { Textarea } from '~/components/ui/textarea';
import { ComponentProps } from 'react';

import { FieldBase, InputBaseProps } from '.';
import { useFieldContext } from '../AppForm';

type TextareaFieldProps = ComponentProps<typeof Textarea> & Omit<InputBaseProps, 'required'>;

export function TextareaField({ label, description, ...props }: TextareaFieldProps) {
  const field = useFieldContext<string>();

  return (
    <FieldBase label={label} description={description} required={props.required}>
      <Textarea {...props} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
    </FieldBase>
  );
}
