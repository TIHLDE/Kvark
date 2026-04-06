import { Skeleton } from '~/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { getEventsQuery } from '~/api/queries/events';
import EventsListView from '~/routes/landing/components/EventsListView';
import { toOldEventListType } from '~/routes/landing/components/event-adapter';
import { Calendar, List, PartyPopper } from 'lucide-react';
import { lazy, Suspense, useMemo } from 'react';

import ActivityEventsListView from './ActivityEventsListView';

const EventsCalendarView = lazy(() => import('~/routes/landing/components/EventsCalendarView'));

const EventsView = () => {
  const { data, isLoading } = useQuery(getEventsQuery(0));
  const events = useMemo(() => (data?.items ?? []).map(toOldEventListType), [data]);

  return (
    <Tabs defaultValue='list'>
      <div className='w-full flex justify-center'>
        <TabsList>
          <TabsTrigger value='list'>
            <List className='mr-2 w-5 h-5 stroke-[1.5px]' />
            Liste
          </TabsTrigger>
          <TabsTrigger value='activity'>
            <PartyPopper className='mr-2 w-5 h-5 stroke-[1.5px]' />
            Aktiviteter
          </TabsTrigger>
          <TabsTrigger value='calendar'>
            <Calendar className='mr-2 w-5 h-5 stroke-[1.5px]' />
            Kalender
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value='list'>
        <EventsListView events={events} isLoading={isLoading} />
      </TabsContent>
      <TabsContent value='activity'>
        <ActivityEventsListView />
      </TabsContent>
      <TabsContent value='calendar'>
        <Suspense fallback={<Skeleton className='h-60' />}>
          <EventsCalendarView />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
};

export default EventsView;
