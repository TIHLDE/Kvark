import { Calendar, List, PartyPopper } from 'lucide-react';
import { lazy, Suspense, useCallback, useState } from 'react';

import { useEvents } from 'hooks/Event';

import EventsListView from 'pages/Landing/components/EventsListView';

import { Skeleton } from 'components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';

import ActivityEventsListView from './ActivityEventsListView';

const EventsCalendarView = lazy(() => import('pages/Landing/components/EventsCalendarView'));

type Filters = {
  activity: boolean;
};

const EventsView = () => {
  const getInitialFilters = useCallback((): Filters => {
    const activity = false;
    return { activity };
  }, []);
  const [filters] = useState<Filters>(getInitialFilters());
  const { data, isLoading } = useEvents(filters);

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
        <EventsListView events={data?.pages[0]?.results || []} isLoading={isLoading} />
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
