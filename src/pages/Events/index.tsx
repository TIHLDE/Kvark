import CelebrationIcon from '@mui/icons-material/Celebration';
import DateRange from '@mui/icons-material/DateRangeRounded';
import Reorder from '@mui/icons-material/ReorderRounded';
import { Collapse, Skeleton } from '@mui/material';
import { lazy, Suspense, useState } from 'react';

import EventsDefaultView from 'pages/Events/components/EventsDefaultView';

import Tabs from 'components/layout/Tabs';

import ActivitiesDefaultView from './components/ActivitiesDefaultView';

const EventsCalendarView = lazy(() => import(/* webpackChunkName: "events_calendar" */ 'pages/Landing/components/EventsCalendarView'));

const Events = () => {
  const listTab = { value: 'list', label: 'Liste', icon: Reorder };
  const activityTab = { value: 'activity', label: 'Aktiviteter', icon: CelebrationIcon };
  const calendarTab = { value: 'calendar', label: 'Kalender', icon: DateRange };
  const tabs = [listTab, activityTab, calendarTab];
  const [tab, setTab] = useState(listTab.value);

  return (
    <div className='mt-20 w-full px-2 md:px-12'>
      <Tabs selected={tab} setSelected={setTab} sx={{ width: 'fit-content', mb: 1 }} tabs={tabs} />
      <Collapse in={tab === listTab.value}>
        <EventsDefaultView />
      </Collapse>
      <Collapse in={tab === activityTab.value}>
        <ActivitiesDefaultView />
      </Collapse>
      <Collapse in={tab === calendarTab.value} mountOnEnter>
        <Suspense fallback={<Skeleton height={695} variant='rectangular' />}>
          <EventsCalendarView />
        </Suspense>
      </Collapse>
    </div>
  );
};

export default Events;
