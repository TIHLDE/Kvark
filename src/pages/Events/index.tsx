import Page from '~/components/navigation/Page';
import { Skeleton } from '~/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import EventsDefaultView from '~/pages/Events/components/EventsDefaultView';
import { Calendar, List, PartyPopper } from 'lucide-react';
import { lazy, Suspense } from 'react';

import ActivitiesDefaultView from './components/ActivitiesDefaultView';

const EventsCalendarView = lazy(() => import(/* webpackChunkName: "events_calendar" */ '~/pages/Landing/components/EventsCalendarView'));

const Events = () => {
  return (
    <Page className='space-y-8 max-w-(--breakpoint-2xl) mx-auto'>
      <div>
        <h1 className='text-3xl md:text-5xl font-bold'>Arrangementer</h1>
        <p className='text-muted-foreground mt-2'>Finn arrangementer for studenter</p>
      </div>

      <Tabs defaultValue='list'>
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
        <TabsContent value='list'>
          <EventsDefaultView />
        </TabsContent>
        <TabsContent value='activity'>
          <ActivitiesDefaultView />
        </TabsContent>
        <TabsContent value='calendar'>
          <Suspense fallback={<Skeleton className='w-full h-96' />}>
            <EventsCalendarView />
          </Suspense>
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default Events;
