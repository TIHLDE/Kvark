import { endOfDay, startOfDay } from 'date-fns';
import { useCallback } from 'react';
import { DateRange } from 'react-day-picker';

import { Calendar } from 'components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { TimePickerDisplay } from 'components/ui/timePicker/display';
import useMediaQuery, { SMALL_SCREEN } from 'hooks/MediaQuery';

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
