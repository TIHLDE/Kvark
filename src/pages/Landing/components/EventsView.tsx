import { useState, lazy, Suspense } from 'react';
import { Collapse, Skeleton } from '@mui/material';

// Project componets/services
import { useEvents } from 'hooks/Event';
import EventsListView from 'pages/Landing/components/EventsListView';
import Tabs from 'components/layout/Tabs';

// Icons
import Reorder from '@mui/icons-material/ReorderRounded';
import DateRange from '@mui/icons-material/DateRangeRounded';

const EventsCalendarView = lazy(() => import(/* webpackChunkName: "events_calendar" */ 'pages/Landing/components/EventsCalendarView'));

const EventsView = () => {
  const { data, isLoading } = useEvents();
  const { data: oldEvents } = useEvents({ expired: true });
  const listTab = { value: 'list', label: 'Liste', icon: Reorder };
  const calendarTab = { value: 'calendar', label: 'Kalender', icon: DateRange };
  const tabs = [listTab, calendarTab];
  const [tab, setTab] = useState(listTab.value);

  return (
    <>
      <Tabs selected={tab} setSelected={setTab} sx={{ mx: 'auto', width: 'fit-content' }} tabs={tabs} />
      <Collapse in={tab === listTab.value}>
        <EventsListView events={data?.pages[0]?.results || []} isLoading={isLoading} />
      </Collapse>
      <Collapse in={tab === calendarTab.value} mountOnEnter>
        <Suspense fallback={<Skeleton height={695} variant='rectangular' />}>
          <EventsCalendarView events={data?.pages[0]?.results || []} oldEvents={oldEvents?.pages[0]?.results || []} />
        </Suspense>
      </Collapse>
    </>
  );
};

export default EventsView;
