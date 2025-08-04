import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '~/components/ui/form';

export type InputBaseProps = {
  label?: string;
  description?: string;
  required?: boolean;
};

export function FieldBase({ label, description, required, children }: React.PropsWithChildren<InputBaseProps>) {
  return (
    <FormItem>
      {label && (
        <FormLabel>
          {label} {required && <span className='text-red-300'>*</span>}
        </FormLabel>
      )}
      <FormControl>{children}</FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
