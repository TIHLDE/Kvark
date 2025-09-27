import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '~/components/ui/form';

export type InputBaseProps = {
  label?: string;
  description?: string;
  required?: boolean;
  classNames?: {
    formItem?: string;
    formLabel?: string;
    formControl?: string;
    formDescription?: string;
    formMessage?: string;
  }
};

export function FieldBase({ label, description, required, children, classNames }: React.PropsWithChildren<InputBaseProps>) {
  return (
    <FormItem className={classNames?.formItem}>
      {label && (
        <FormLabel className={classNames?.formLabel}>
          {label} {required && <span className='text-red-300'>*</span>}
        </FormLabel>
      )}
      <FormControl className={classNames?.formControl}>{children}</FormControl>
      {description && <FormDescription className={classNames?.formDescription}>{description}</FormDescription>}
      <FormMessage className={classNames?.formMessage} />
    </FormItem>
  );
}
