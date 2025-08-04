import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { FormControl } from '~/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { TimePickerDisplay } from '~/components/ui/timePicker/display';
import { cn } from '~/lib/utils';
import { format } from 'date-fns/format';
import { nb } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { ComponentProps } from 'react';

import { FieldBase } from '.';
import { useFieldContext } from '../AppForm';

export function DateTimeField(props: ComponentProps<typeof FieldBase>) {
  const field = useFieldContext<Date | undefined>();

  return (
    <FieldBase {...props}>
      <Popover>
        <FormControl>
          <PopoverTrigger asChild>
            <Button className={cn('w-full justify-start text-left font-normal', !field.state.value && 'text-muted-foreground')} variant='outline'>
              <CalendarIcon className='mr-2 h-4 w-4' />
              {field.state.value ? format(field.state.value, 'PPP HH:mm:ss', { locale: nb }) : <span>Velg en dato</span>}
            </Button>
          </PopoverTrigger>
        </FormControl>
        <PopoverContent className='w-auto p-0'>
          <Calendar initialFocus mode='single' onSelect={(e) => field.handleChange(e)} selected={field.state.value} />
          <div className='p-3 border-t border-border'>
            <TimePickerDisplay date={field.state.value} setDate={(e) => field.handleChange(e)} />
          </div>
        </PopoverContent>
      </Popover>
    </FieldBase>
  );
}
