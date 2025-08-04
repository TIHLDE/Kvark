import { useFieldContext } from '~/components/forms/AppForm';
import { Input } from '~/components/ui/input';

export default function InputField({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const field = useFieldContext<string>();
  return <Input {...props} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />;
}
