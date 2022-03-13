import { useState, lazy, Suspense } from 'react';
import { Collapse, Skeleton } from '@mui/material';

// Project componets/services
import Page from 'components/navigation/Page';
import Banner from 'components/layout/Banner';
import { useEvents } from 'hooks/Event';
import EventsDefaultView from 'pages/Events/components/EventsDefaultView';
import Tabs from 'components/layout/Tabs';

// Icons
import Reorder from '@mui/icons-material/ReorderRounded';
import DateRange from '@mui/icons-material/DateRangeRounded';

const EventsCalendarView = lazy(() => import(/* webpackChunkName: "events_calendar" */ 'pages/Landing/components/EventsCalendarView'));

const Events = () => {
  const { data } = useEvents();
  const { data: oldEvents } = useEvents({ expired: true });
  const listTab = { value: 'list', label: 'Liste', icon: Reorder };
  const calendarTab = { value: 'calendar', label: 'Kalender', icon: DateRange };
  const tabs = [listTab, calendarTab];
  const [tab, setTab] = useState(listTab.value);

  return (
    <Page banner={<Banner title='Arrangementer' />} options={{ title: 'Arrangementer' }}>
      <Tabs selected={tab} setSelected={setTab} sx={{ width: 'fit-content', mb: 1 }} tabs={tabs} />
      <Collapse in={tab === listTab.value}>
        <EventsDefaultView />
      </Collapse>
      <Collapse in={tab === calendarTab.value} mountOnEnter>
        <Suspense fallback={<Skeleton height={695} variant='rectangular' />}>
          <EventsCalendarView />
        </Suspense>
      </Collapse>
    </Page>
  );
};

export default Events;
