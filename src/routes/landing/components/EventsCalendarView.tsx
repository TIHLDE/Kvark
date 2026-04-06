import { useQuery } from '@tanstack/react-query';
import { getEventsQuery } from '~/api/queries/events';
import { type ApiEventListItem } from '~/routes/landing/components/event-adapter';
import { Category as CategoryEnum, Groups } from '~/types/Enums';
import { VariantProps } from 'class-variance-authority';
import { endOfMonth, isWithinInterval, parseISO, startOfMonth } from 'date-fns';
import { nb } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Card } from '~/components/ui/card';
import {
  Calendar,
  CalendarCurrentDate,
  CalendarEvent,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  monthEventVariants,
} from './EventsCalendarViewBase';

const getColor = (event: ApiEventListItem): VariantProps<typeof monthEventVariants>['variant'] => {
  if (event.category?.label === CategoryEnum.ACTIVITY) {
    return 'purple';
  }

  if (
    event.organizer?.slug.toLowerCase() === Groups.NOK.toLowerCase() ||
    event.category?.label.toLowerCase() === CategoryEnum.COMPRES ||
    event.category?.label.toLowerCase() === CategoryEnum.COURSE
  ) {
    return 'blue';
  }

  return 'orange';
};

const EventsCalendarView = () => {
  const [monthStart, setMonthStart] = useState(() => startOfMonth(new Date()));

  // TODO: Add date range and category filters once the new API supports them
  // Fetch a large page to get events; client-side filter to current month
  const { data } = useQuery(getEventsQuery(0, {}, 100));
  const events = data?.items ?? [];

  const monthEnd = endOfMonth(monthStart);

  const displayedEvents = useMemo(() => {
    const interval = { start: monthStart, end: monthEnd };
    return events.reduce<CalendarEvent[]>((acc, event) => {
      const start = parseISO(event.startTime);
      const end = parseISO(event.endTime);
      if (isWithinInterval(start, interval) || isWithinInterval(end, interval)) {
        acc.push({ ...event, start, end, id: event.id.toString(), color: getColor(event) });
      }
      return acc;
    }, []);
  }, [events, monthStart, monthEnd]);

  return (
    <Calendar
      events={displayedEvents}
      locale={nb}
      onSetDate={(date: Date) => {
        setMonthStart(startOfMonth(date));
      }}>
      <Card className='h-dvh py-6 flex flex-col'>
        <div className='flex px-6 items-center gap-2 mb-6'>
          <CalendarCurrentDate />
          <div className='flex-1' />
          <CalendarPrevTrigger>
            <ChevronLeft size={20} />
            <span className='sr-only'>Forrige</span>
          </CalendarPrevTrigger>
          <CalendarTodayTrigger>I dag</CalendarTodayTrigger>
          <CalendarNextTrigger>
            <ChevronRight size={20} />
            <span className='sr-only'>Neste</span>
          </CalendarNextTrigger>
        </div>
        <div className='flex-1 overflow-auto px-6 relative'>
          <CalendarMonthView />
        </div>
      </Card>
    </Calendar>
  );
};

export default EventsCalendarView;
