import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '~/components/ui/form';

export type FormInputBaseProps = {
  required?: boolean;
  description?: string;
  label?: string;
  className?: string;
};

export function FormInputBase({ children, label, description, required, className }: React.PropsWithChildren<FormInputBaseProps>) {
  return (
    <FormItem className={className}>
      <FormLabel>
        {label} {required && <span className='text-red-300'>*</span>}
      </FormLabel>
      <FormControl>{children}</FormControl>
      <FormMessage />
      {description && <FormDescription>{description}</FormDescription>}
    </FormItem>
  );
}
