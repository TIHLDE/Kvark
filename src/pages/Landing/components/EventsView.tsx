import { useState, lazy, Suspense } from 'react';
import { usePersistedState } from 'hooks/Utils';
import { Collapse, Skeleton, Alert, styled } from '@mui/material';

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
  const [shouldShowInfo, setShouldShowInfo] = usePersistedState('NewEventColors', true, 1000 * 3600 * 24 * 360);

  const ColorInfo = styled('span', { shouldForwardProp: (prop) => prop !== 'color' })<{ color: 'nok_event' | 'other_event' }>(({ theme, color }) => ({
    background: theme.palette.colors[color],
    borderRadius: 3,
    color: theme.palette.getContrastText(theme.palette.colors.nok_event),
    padding: theme.spacing(0.25, 0.25),
  }));

  return (
    <>
      <Tabs selected={tab} setSelected={setTab} sx={{ mx: 'auto', width: 'fit-content', mb: 1 }} tabs={tabs} />
      {shouldShowInfo && (
        <Alert onClose={() => setShouldShowInfo(false)} severity='info' sx={{ mb: 1 }} variant='outlined'>
          Kurs og bedpres er <ColorInfo color='nok_event'>blå</ColorInfo>, mens sosiale og andre arrangementer er{' '}
          <ColorInfo color='other_event'>oransje</ColorInfo> slik at det er enkelt å se hva som er hva.
        </Alert>
      )}
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
