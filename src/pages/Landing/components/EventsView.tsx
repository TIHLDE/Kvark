import { useState, lazy, Suspense } from 'react';

// Material-UI
import { Tab, Tabs, Collapse, Skeleton } from '@mui/material';

// Project componets/services
import { useEvents } from 'hooks/Event';
import EventsListView from 'pages/Landing/components/EventsListView';

// Icons
import Reorder from '@mui/icons-material/ReorderRounded';
import DateRange from '@mui/icons-material/DateRangeRounded';

const EventsCalendarView = lazy(() => import(/* webpackChunkName: "events_calendar" */ 'pages/Landing/components/EventsCalendarView'));

enum Views {
  LIST,
  CALENDAR,
}

const EventsView = () => {
  const { data, isLoading } = useEvents();
  const { data: oldEvents } = useEvents({ expired: true });
  const [tab, setTab] = useState(Views.LIST);

  return (
    <>
      <Tabs centered onChange={(e, newTab) => setTab(newTab as Views)} value={tab}>
        <Tab icon={<Reorder />} label='Listevisning' />
        <Tab icon={<DateRange />} label='Kalendervisning' />
      </Tabs>
      <Collapse in={tab === Views.LIST}>
        <EventsListView events={data?.pages[0]?.results || []} isLoading={isLoading} />
      </Collapse>
      <Collapse in={tab === Views.CALENDAR} mountOnEnter>
        <Suspense fallback={<Skeleton height={695} variant='rectangular' />}>
          <EventsCalendarView events={data?.pages[0]?.results || []} oldEvents={oldEvents?.pages[0]?.results || []} />
        </Suspense>
      </Collapse>
    </>
  );
};

export default EventsView;
