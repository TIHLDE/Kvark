import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { TimePickerDisplay } from '~/components/ui/timePicker/display';
import { cn } from '~/lib/utils';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

type DateTimePickerProps<TFormValues extends FieldValues> = {
  form: UseFormReturn<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  required?: boolean;
  className?: string;
  onDateChange?: (date?: Date) => void;
};

// This must be used within a react-hook-form
const DateTimePicker = <TFormValues extends FieldValues>({ form, name, label, required, className, onDateChange }: DateTimePickerProps<TFormValues>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('w-full', className)}>
          <FormLabel>
            {label} {required && <span className='text-red-300'>*</span>}
          </FormLabel>
          <Popover>
            <FormControl>
              <PopoverTrigger asChild>
                <Button className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')} variant='outline'>
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {field.value ? format(field.value, 'PPP HH:mm:ss', { locale: nb }) : <span>Velg en dato</span>}
                </Button>
              </PopoverTrigger>
            </FormControl>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                initialFocus
                mode='single'
                onSelect={(e) => {
                  field.onChange(e), onDateChange && onDateChange(e);
                }}
                selected={field.value}
              />
              <div className='p-3 border-t border-border'>
                <TimePickerDisplay date={field.value} setDate={field.onChange} />
              </div>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DateTimePicker;
