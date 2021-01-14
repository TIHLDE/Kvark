import { useState, useEffect } from 'react';
import { Event } from 'types/Types';

// Material-UI
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Collapse from '@material-ui/core/Collapse';

// Project componets/services
import { useEvent } from 'api/hooks/Event';
import EventsListView from 'containers/Landing/components/EventsListView';
import EventsCalendarView from 'containers/Landing/components/EventsCalendarView';

// Icons
import Reorder from '@material-ui/icons/Reorder';
import DateRange from '@material-ui/icons/DateRange';

enum Views {
  LIST,
  CALENDAR,
}

const EventsView = () => {
  const { getEvents, getExpiredEvents } = useEvent();
  const [events, setEvents] = useState<Array<Event>>([]);
  const [oldEvents, setOldEvents] = useState<Array<Event>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState(Views.LIST);

  useEffect(() => {
    getEvents()
      .then((eventObject) => setEvents(eventObject.results))
      .finally(() => setIsLoading(false));
  }, [getEvents]);

  useEffect(() => {
    // Load expired events when switching to calendar tab and they havn't been loaded already
    if (!oldEvents.length && tab === Views.CALENDAR) {
      getExpiredEvents().then((eventObject) => setOldEvents(eventObject.results));
    }
  }, [tab, oldEvents, getExpiredEvents]);

  return (
    <>
      <Tabs centered onChange={(e, newTab) => setTab(newTab as Views)} value={tab}>
        <Tab icon={<Reorder />} label='Listevisning' />
        <Tab icon={<DateRange />} label='Kalendervisning' />
      </Tabs>
      <Collapse in={tab === Views.LIST}>
        <EventsListView events={events} isLoading={isLoading} />
      </Collapse>
      <Collapse in={tab === Views.CALENDAR} mountOnEnter>
        <EventsCalendarView events={events} oldEvents={oldEvents} />
      </Collapse>
    </>
  );
};

export default EventsView;
