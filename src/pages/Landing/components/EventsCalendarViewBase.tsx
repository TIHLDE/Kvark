'use client';

import { cva, VariantProps } from 'class-variance-authority';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInMinutes,
  format,
  getMonth,
  isSameDay,
  isSameHour,
  isSameMonth,
  isToday,
  Locale,
  setHours,
  setMonth,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';
import { nb } from 'date-fns/locale';
import { cn } from 'lib/utils';
import { createContext, forwardRef, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { Button } from 'components/ui/button';

import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import EventsCalendarPopover from './EventsCalendarPopover';

const monthEventVariants = cva('size-2 rounded-full', {
  variants: {
    variant: {
      default: 'bg-primary',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      pink: 'bg-pink-500',
      purple: 'bg-purple-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const dayEventVariants = cva('font-bold border-l-4 rounded p-2 text-xs', {
  variants: {
    variant: {
      default: 'bg-muted/30 text-muted-foreground border-muted',
      blue: 'bg-blue-500/30 text-blue-600 border-blue-500',
      green: 'bg-green-500/30 text-green-600 border-green-500',
      pink: 'bg-pink-500/30 text-pink-600 border-pink-500',
      purple: 'bg-purple-500/30 text-purple-600 border-purple-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type View = 'day' | 'week' | 'month' | 'year';

type ContextType = {
  view: View;
  setView: (view: View) => void;
  date: Date;
  setDate: (date: Date) => void;
  events: CalendarEvent[];
  locale: Locale;
  setEvents: (date: CalendarEvent[]) => void;
  onChangeView?: (view: View) => void;
  onEventClick?: (event: CalendarEvent) => void;
  enableHotkeys?: boolean;
  today: Date;
};

const Context = createContext<ContextType>({} as ContextType);

export type CalendarEvent = {
  id: string;
  start: Date;
  end: Date;
  title: string;
  color?: VariantProps<typeof monthEventVariants>['variant'];
};

type CalendarProps = {
  children: ReactNode;
  defaultDate?: Date;
  events?: CalendarEvent[];
  view?: View;
  locale?: Locale;
  enableHotkeys?: boolean;
  onChangeView?: (view: View) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onSetDate?: (date: Date) => void;
};

const Calendar = ({
  children,
  defaultDate = new Date(),
  locale = nb,
  enableHotkeys = true,
  view: _defaultMode = 'month',
  onEventClick,
  events: defaultEvents = [],
  onChangeView,
  onSetDate,
}: CalendarProps) => {
  const [view, setView] = useState<View>(_defaultMode);
  const [date, setDate] = useState(defaultDate);
  const [events, setEvents] = useState<CalendarEvent[]>(defaultEvents);

  useEffect(() => {
    setEvents(defaultEvents);
  }, [defaultEvents]);

  useEffect(() => {
    onSetDate?.(date);
  }, [date]);

  return (
    <Context.Provider
      value={{
        view,
        setView,
        date,
        setDate,
        events,
        setEvents,
        locale,
        enableHotkeys,
        onEventClick,
        onChangeView,
        today: new Date(),
      }}>
      {children}
    </Context.Provider>
  );
};

export const useCalendar = () => useContext(Context);

const CalendarViewTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & {
    view: View;
  }
>(({ children, view, ...props }) => {
  const { view: currentView, setView, onChangeView } = useCalendar();

  return (
    <Button
      aria-current={currentView === view}
      size='sm'
      variant='ghost'
      {...props}
      onClick={() => {
        setView(view);
        onChangeView?.(view);
      }}>
      {children}
    </Button>
  );
});
CalendarViewTrigger.displayName = 'CalendarViewTrigger';

const EventGroup = ({ events, hour }: { events: CalendarEvent[]; hour: Date }) => {
  return (
    <div className='h-20 border-t last:border-b'>
      {events
        .filter((event) => isSameHour(event.start, hour))
        .map((event) => {
          const hoursDifference = differenceInMinutes(event.end, event.start) / 60;
          const startPosition = event.start.getMinutes() / 60;

          return (
            <div
              className={cn('relative', dayEventVariants({ variant: event.color }))}
              key={event.id}
              style={{
                top: `${startPosition * 100}%`,
                height: `${hoursDifference * 100}%`,
              }}>
              {event.title}
            </div>
          );
        })}
    </div>
  );
};

const CalendarDayView = () => {
  const { view, events, date } = useCalendar();

  if (view !== 'day') {
    return null;
  }

  const hours = [...Array(24)].map((_, i) => setHours(date, i));

  return (
    <div className='flex relative pt-2 overflow-auto h-full'>
      <TimeTable />
      <div className='flex-1'>
        {hours.map((hour) => (
          <EventGroup events={events} hour={hour} key={hour.toString()} />
        ))}
      </div>
    </div>
  );
};

const CalendarWeekView = () => {
  const { view, date, locale, events } = useCalendar();

  const weekDates = useMemo(() => {
    const start = startOfWeek(date, { weekStartsOn: 0 });
    const weekDates = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(start, i);
      const hours = [...Array(24)].map((_, i) => setHours(day, i));
      weekDates.push(hours);
    }

    return weekDates;
  }, [date]);

  const headerDays = useMemo(() => {
    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      const result = addDays(startOfWeek(date, { weekStartsOn: 0 }), i);
      daysOfWeek.push(result);
    }
    return daysOfWeek;
  }, [date]);

  if (view !== 'week') {
    return null;
  }

  return (
    <div className='flex flex-col relative overflow-auto h-full'>
      <div className='flex sticky top-0 bg-card z-10 border-b mb-3'>
        <div className='w-12'></div>
        {headerDays.map((date, i) => (
          <div
            className={cn(
              'text-center flex-1 gap-1 pb-2 text-sm text-muted-foreground flex items-center justify-center',
              [0, 6].includes(i) && 'text-muted-foreground/50',
            )}
            key={date.toString()}>
            {format(date, 'E', { locale })}
            <span className={cn('h-6 grid place-content-center', isToday(date) && 'bg-primary text-primary-foreground rounded-full size-6')}>
              {format(date, 'd')}
            </span>
          </div>
        ))}
      </div>
      <div className='flex flex-1'>
        <div className='w-fit'>
          <TimeTable />
        </div>
        <div className='grid grid-cols-7 flex-1'>
          {weekDates.map((hours, i) => {
            return (
              <div
                className={cn('h-full text-sm text-muted-foreground border-l first:border-l-0', [0, 6].includes(i) && 'bg-muted/50')}
                key={hours[0].toString()}>
                {hours.map((hour) => (
                  <EventGroup events={events} hour={hour} key={hour.toString()} />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const DayTile = ({ event }: { event: CalendarEvent }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className='px-1 rounded text-sm flex items-center gap-1 cursor-pointer' key={event.id}>
          <div className={cn('shrink-0', monthEventVariants({ variant: event.color }))}></div>
          <span className='flex-1 truncate'>{event.title}</span>
          <time className='tabular-nums text-muted-foreground/50 text-xs'>{format(event.start, 'HH:mm')}</time>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <EventsCalendarPopover id={parseInt(event.id)} />
      </PopoverContent>
    </Popover>
  );
};

const CalendarMonthView = () => {
  const { date, view, events, locale } = useCalendar();

  const monthDates = useMemo(() => getDaysInMonth(date), [date]);
  const weekDays = useMemo(() => generateWeekdays(locale), [locale]);

  if (view !== 'month') {
    return null;
  }

  return (
    <div className='h-full flex flex-col'>
      <div className='grid grid-cols-7 gap-px sticky top-0 bg-background border-b'>
        {weekDays.map((day, i) => (
          <div className={cn('mb-2 text-right text-sm text-muted-foreground pr-2', [0, 6].includes(i) && 'text-muted-foreground/50')} key={day}>
            {day}
          </div>
        ))}
      </div>
      <div className='grid overflow-hidden -mt-px flex-1 auto-rows-fr p-px grid-cols-7 gap-px'>
        {monthDates.map((_date) => {
          const currentEvents = events.filter((event) => isSameDay(event.start, _date));

          return (
            <div
              className={cn('ring-1 p-2 text-sm text-muted-foreground ring-border overflow-auto', !isSameMonth(date, _date) && 'text-muted-foreground/50')}
              key={_date.toString()}>
              <span className={cn('size-6 grid place-items-center rounded-full mb-1 sticky top-0', isToday(_date) && 'bg-primary text-primary-foreground')}>
                {format(_date, 'd')}
              </span>

              {currentEvents.map((event) => (
                <DayTile event={event} key={event.id} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CalendarYearView = () => {
  const { view, date, today, locale } = useCalendar();

  const months = useMemo(() => {
    if (!view) {
      return [];
    }

    return Array.from({ length: 12 }).map((_, i) => {
      return getDaysInMonth(setMonth(date, i));
    });
  }, [date, view]);

  const weekDays = useMemo(() => generateWeekdays(locale), [locale]);

  if (view !== 'year') {
    return null;
  }

  return (
    <div className='grid grid-cols-4 gap-10 overflow-auto h-full'>
      {months.map((days, i) => (
        <div key={days[0].toString()}>
          <span className='text-xl'>{i + 1}</span>

          <div className='grid grid-cols-7 gap-2 my-5'>
            {weekDays.map((day) => (
              <div className='text-center text-xs text-muted-foreground' key={day}>
                {day}
              </div>
            ))}
          </div>

          <div className='grid gap-x-2 text-center grid-cols-7 text-xs tabular-nums'>
            {days.map((_date) => {
              return (
                <div className={cn(getMonth(_date) !== i && 'text-muted-foreground')} key={_date.toString()}>
                  <div
                    className={cn(
                      'aspect-square grid place-content-center size-full tabular-nums',
                      isSameDay(today, _date) && getMonth(_date) === i && 'bg-primary text-primary-foreground rounded-full',
                    )}>
                    {format(_date, 'd')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const CalendarNextTrigger = forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(({ children, onClick, ...props }, ref) => {
  const { date, setDate, view, enableHotkeys } = useCalendar();

  const next = useCallback(() => {
    if (view === 'day') {
      setDate(addDays(date, 1));
    } else if (view === 'week') {
      setDate(addWeeks(date, 1));
    } else if (view === 'month') {
      setDate(addMonths(date, 1));
    } else if (view === 'year') {
      setDate(addYears(date, 1));
    }
  }, [date, view, setDate]);

  return (
    <Button
      ref={ref}
      size='icon'
      variant='outline'
      {...props}
      onClick={(e) => {
        next();
        onClick?.(e);
      }}>
      {children}
    </Button>
  );
});
CalendarNextTrigger.displayName = 'CalendarNextTrigger';

const CalendarPrevTrigger = forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(({ children, onClick, ...props }, ref) => {
  const { date, setDate, view, enableHotkeys } = useCalendar();

  const prev = useCallback(() => {
    if (view === 'day') {
      setDate(subDays(date, 1));
    } else if (view === 'week') {
      setDate(subWeeks(date, 1));
    } else if (view === 'month') {
      setDate(subMonths(date, 1));
    } else if (view === 'year') {
      setDate(subYears(date, 1));
    }
  }, [date, view, setDate]);

  return (
    <Button
      ref={ref}
      size='icon'
      variant='outline'
      {...props}
      onClick={(e) => {
        prev();
        onClick?.(e);
      }}>
      {children}
    </Button>
  );
});
CalendarPrevTrigger.displayName = 'CalendarPrevTrigger';

const CalendarTodayTrigger = forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(({ children, onClick, ...props }, ref) => {
  const { setDate, enableHotkeys, today } = useCalendar();

  const jumpToToday = useCallback(() => {
    setDate(today);
  }, [today, setDate]);

  return (
    <Button
      ref={ref}
      variant='outline'
      {...props}
      onClick={(e) => {
        jumpToToday();
        onClick?.(e);
      }}>
      {children}
    </Button>
  );
});
CalendarTodayTrigger.displayName = 'CalendarTodayTrigger';

const CalendarCurrentDate = () => {
  const { date, view } = useCalendar();

  return (
    <time className='tabular-nums' dateTime={date.toISOString()}>
      {format(date, view === 'day' ? 'dd MMMM yyyy' : 'MMMM yyyy', { locale: nb })}
    </time>
  );
};

const TimeTable = () => {
  const now = new Date();

  return (
    <div className='pr-2 w-12'>
      {Array.from(Array(25).keys()).map((hour) => {
        return (
          <div className='text-right relative text-xs text-muted-foreground/50 h-20 last:h-0' key={hour}>
            {now.getHours() === hour && (
              <div
                className='absolute z- left-full translate-x-2 w-dvw h-[2px] bg-red-500'
                style={{
                  top: `${(now.getMinutes() / 60) * 100}%`,
                }}>
                <div className='size-2 rounded-full bg-red-500 absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2'></div>
              </div>
            )}
            <p className='top-0 -translate-y-1/2'>{hour === 24 ? 0 : hour}:00</p>
          </div>
        );
      })}
    </div>
  );
};

const getDaysInMonth = (date: Date) => {
  const startOfMonthDate = startOfMonth(date);
  const startOfWeekForMonth = startOfWeek(startOfMonthDate, {
    weekStartsOn: 0,
  });

  let currentDate = startOfWeekForMonth;
  const calendar = [];

  while (calendar.length < 42) {
    calendar.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  return calendar;
};

const generateWeekdays = (locale: Locale) => {
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const date = addDays(startOfWeek(new Date(), { weekStartsOn: 0 }), i);
    daysOfWeek.push(format(date, 'EEEEEE', { locale }));
  }
  return daysOfWeek;
};

export {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
  CalendarYearView,
};
