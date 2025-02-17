import { endOfDay, format, startOfDay } from 'date-fns';
import nb from 'date-fns/locale/nb';
import { cn } from 'lib/utils';
import { CalendarIcon } from 'lucide-react';
import { useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

import useMediaQuery, { SMALL_SCREEN } from 'hooks/MediaQuery';

import { Button } from 'components/ui/button';
import { Calendar } from 'components/ui/calendar';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { TimePickerDisplay } from 'components/ui/timePicker/display';

type DateTimeRangePickerProps = {
  range: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  hideSeconds?: boolean;
};

type ControlChange =
  | {
      control: 'dateRange';
      value: DateRange | undefined;
    }
  | {
      control: 'startTime' | 'endTime';
      value: Date | undefined;
    };

export default function DateTimeRangePicker({ range, onChange, children, hideSeconds }: React.PropsWithChildren<DateTimeRangePickerProps>) {
  const isPhone = !useMediaQuery(SMALL_SCREEN);

  const changeHandler = useCallback(
    (evt: ControlChange) => {
      if (evt.control === 'dateRange') {
        if (evt.value === undefined) {
          return onChange(undefined);
        }

        return onChange({
          from: evt.value?.from ? startOfDay(evt.value.from) : undefined,
          to: evt.value?.to ? endOfDay(evt.value.to) : undefined,
        } as DateRange);
      }

      if (range?.from && evt.control === 'startTime') {
        return onChange({
          from: range?.from
            ? new Date(range.from.getFullYear(), range.from.getMonth(), range.from.getDate(), evt.value?.getHours() ?? 0, evt.value?.getMinutes() ?? 0, 0)
            : range?.from,
          to: range?.to,
        });
      }

      if (range?.to && evt.control === 'endTime') {
        return onChange({
          from: range?.from,
          to: range?.to
            ? new Date(range.to.getFullYear(), range.to.getMonth(), range.to.getDate(), evt.value?.getHours() ?? 0, evt.value?.getMinutes() ?? 0, 0)
            : range?.to,
        });
      }
      return onChange(undefined);
    },
    [range, onChange],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          initialFocus
          mode='range'
          numberOfMonths={isPhone ? 1 : 2}
          onSelect={(e) => {
            changeHandler({
              control: 'dateRange',
              value: e,
            });
          }}
          selected={range}
        />
        <div className='p-3 border-t border-border flex flex-col items-center gap-2 sm:flex-row  justify-around'>
          <TimePickerDisplay
            className='w-fit'
            date={range?.from}
            hideSeconds={hideSeconds}
            setDate={(e) =>
              changeHandler({
                control: 'startTime',
                value: e,
              })
            }
          />
          <TimePickerDisplay
            date={range?.to}
            hideSeconds={hideSeconds}
            setDate={(e) =>
              changeHandler({
                control: 'endTime',
                value: e,
              })
            }
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

type DateTimePickerFormInputProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
  label: string;
  control?: Control<TFieldValues>;
  name: TName;
  required?: boolean;
};
export function DateTimeRangePickerFormInput<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
  props: DateTimePickerFormInputProps<TFieldValues, TName>,
) {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }: { field: any }) => {
        const { from, to } = field.value ?? {};

        let dateText = from ? format(from, 'PPP HH:mm', { locale: nb }) : undefined;
        if (to) {
          dateText += ` - ${format(to, 'PPP HH:mm', { locale: nb })}`;
        }

        return (
          <FormItem className='w-full'>
            <FormLabel>
              {props.label} {props.required && <span className='text-red-300'>*</span>}
            </FormLabel>
            <FormControl>
              <DateTimeRangePicker
                hideSeconds={true}
                onChange={(e) => {
                  if (e === undefined) {
                    return field.onChange(null);
                  } else {
                    field.onChange(e);
                  }
                }}
                range={field.value}>
                <Button className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')} variant='outline'>
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {field.value ? dateText : <span>Velg periode</span>}
                </Button>
              </DateTimeRangePicker>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
