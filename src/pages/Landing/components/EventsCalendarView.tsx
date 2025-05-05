import { useEvents } from '~/hooks/Event';
import { useAnalytics } from '~/hooks/Utils';
import type { Category, EventList } from '~/types';
import { Category as CategoryEnum, Groups } from '~/types/Enums';
import { VariantProps } from 'class-variance-authority';
import { endOfMonth, parseISO, startOfMonth } from 'date-fns';
import { nb } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Card } from '../../../components/ui/card';
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

const getColor = (event: EventList): VariantProps<typeof monthEventVariants>['variant'] => {
  if (event.category?.text === CategoryEnum.ACTIVITY) {
    return 'purple';
  }

  if (
    event.organizer?.slug.toLowerCase() === Groups.NOK.toLowerCase() ||
    event.category?.text.toLowerCase() === CategoryEnum.COMPRES ||
    event.category?.text.toLowerCase() === CategoryEnum.COURSE
  ) {
    return 'blue';
  }

  return 'orange';
};

type Filters = {
  start_range?: string;
  end_range?: string;
};

export type EventsCalendarViewProps = {
  category?: Category['id'];
};

const EventsCalendarView = ({ category }: EventsCalendarViewProps) => {
  const { event } = useAnalytics();
  const [filters, setFilters] = useState<Filters>({ start_range: startOfMonth(new Date()).toISOString(), end_range: endOfMonth(new Date()).toISOString() });
  const { data, fetchNextPage } = useEvents({ category, ...filters });
  const events = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  useEffect(() => {
    event('open', 'calendar', 'Open calendar on landing page');
  }, [event]);

  // fetch all events in the set timespan
  useEffect(() => {
    if (data?.pages[data.pages.length - 1].next) {
      fetchNextPage();
    }
  }, [data]);

  const displayedEvents = useMemo(
    () =>
      events.map(
        (event) =>
          ({
            ...event,
            start: parseISO(event.start_date),
            end: parseISO(event.end_date),
            id: event.id.toString(),
            color: getColor(event),
          } satisfies CalendarEvent),
      ),
    [data],
  );

  return (
    <Calendar
      events={displayedEvents}
      locale={nb}
      onSetDate={(date: Date) => {
        setFilters({ start_range: startOfMonth(date).toISOString(), end_range: endOfMonth(date).toISOString() });
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
