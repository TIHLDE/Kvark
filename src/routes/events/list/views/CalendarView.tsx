import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { listEventInfiniteQuery, type EventListEntry } from '~/api/queries/events';
import { Card } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import {
  Calendar,
  CalendarCurrentDate,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  monthEventVariants,
  type CalendarEvent,
} from '~/pages/Landing/components/EventsCalendarViewBase';
import type { VariantProps } from 'class-variance-authority';
import { nb } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Suspense, useEffect, useMemo } from 'react';

const NOK_SLUG = 'nok';

const getColor = (event: EventListEntry): VariantProps<typeof monthEventVariants>['variant'] => {
  if (event.category?.slug === 'aktivitet') {
    return 'purple';
  }
  if (event.organizer?.slug.toLowerCase() === NOK_SLUG || event.category?.slug === 'bedpres' || event.category?.slug === 'kurs') {
    return 'blue';
  }
  return 'orange';
};

function CalendarContent() {
  const { data, fetchNextPage } = useSuspenseInfiniteQuery(listEventInfiniteQuery());

  useEffect(() => {
    const lastPage = data.pages[data.pages.length - 1];
    if (lastPage.nextPage !== null) {
      fetchNextPage();
    }
  }, [data, fetchNextPage]);

  const displayedEvents = useMemo(
    () =>
      data.pages
        .flatMap((page) => page.items)
        .map(
          (event): CalendarEvent => ({
            id: event.id,
            title: event.title,
            start: event.startTime,
            end: event.endTime,
            color: getColor(event),
          }),
        ),
    [data],
  );

  return (
    <Calendar events={displayedEvents} locale={nb}>
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
}

export function CalendarEventView() {
  return (
    <Suspense fallback={<Skeleton className='h-[60vh]' />}>
      <CalendarContent />
    </Suspense>
  );
}
