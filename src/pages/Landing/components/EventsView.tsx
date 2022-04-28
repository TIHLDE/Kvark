import DateRange from '@mui/icons-material/DateRangeRounded';
import Reorder from '@mui/icons-material/ReorderRounded';
import { Collapse, Skeleton, styled } from '@mui/material';
import { lazy, Suspense, useState } from 'react';

import { useEvents } from 'hooks/Event';

import EventsListView from 'pages/Landing/components/EventsListView';

import Tabs from 'components/layout/Tabs';
import { AlertOnce } from 'components/miscellaneous/UserInformation';

const EventsCalendarView = lazy(() => import('pages/Landing/components/EventsCalendarView'));

const EventsView = () => {
  const { data, isLoading } = useEvents();
  const listTab = { value: 'list', label: 'Liste', icon: Reorder };
  const calendarTab = { value: 'calendar', label: 'Kalender', icon: DateRange };
  const tabs = [listTab, calendarTab];
  const [tab, setTab] = useState(listTab.value);

  const ColorInfo = styled('span', { shouldForwardProp: (prop) => prop !== 'color' })<{ color: 'nok_event' | 'other_event' }>(({ theme, color }) => ({
    background: theme.palette.colors[color],
    borderRadius: 3,
    color: theme.palette.getContrastText(theme.palette.colors.nok_event),
    padding: theme.spacing(0.25, 0.25),
  }));

  return (
    <>
      <Tabs selected={tab} setSelected={setTab} sx={{ mx: 'auto', width: 'fit-content', mb: 1 }} tabs={tabs} />
      <AlertOnce cookieKey='NewEventColors' severity='info' sx={{ mb: 1 }} variant='outlined'>
        Kurs og bedpres er <ColorInfo color='nok_event'>blå</ColorInfo>, mens sosiale og andre arrangementer er{' '}
        <ColorInfo color='other_event'>oransje</ColorInfo> slik at det er enkelt å se hva som er hva.
      </AlertOnce>
      <Collapse in={tab === listTab.value}>
        <EventsListView events={data?.pages[0]?.results || []} isLoading={isLoading} />
      </Collapse>
      <Collapse in={tab === calendarTab.value} mountOnEnter>
        <Suspense fallback={<Skeleton height={695} variant='rectangular' />}>
          <EventsCalendarView />
        </Suspense>
      </Collapse>
    </>
  );
};

export default EventsView;
