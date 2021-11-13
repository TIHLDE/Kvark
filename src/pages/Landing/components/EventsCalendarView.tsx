import { ReactNode, useEffect, useMemo } from 'react';
import { EventCompact } from 'types';
import URLS from 'URLS';
import { Link } from 'react-router-dom';
import { parseISO } from 'date-fns';
import { urlEncode } from 'utils';
import { ViewState, AppointmentModel } from '@devexpress/dx-react-scheduler';
import { Scheduler, MonthView, Toolbar, DateNavigator, Appointments } from '@devexpress/dx-react-scheduler-material-ui';

// Project components
import Paper from 'components/layout/Paper';
import { useGoogleAnalytics } from 'hooks/Utils';

export type EventsCalendarViewProps = {
  events: Array<EventCompact>;
  oldEvents: Array<EventCompact>;
};

type AppointmentProps = {
  children: ReactNode;
  data: AppointmentModel;
};

const Appointment = ({ children, data }: AppointmentProps) => (
  <Link to={`${URLS.events}${data.id}/${urlEncode(data.title)}/`}>
    <Appointments.Appointment data={data} draggable={false} resources={[]}>
      {children}
    </Appointments.Appointment>
  </Link>
);

const EventsCalendarView = ({ events, oldEvents }: EventsCalendarViewProps) => {
  const { event } = useGoogleAnalytics();

  useEffect(() => {
    event('open', 'calendar', 'Open calendar on landing page');
  }, [event]);

  const displayedEvents = useMemo(
    () =>
      [...events, ...oldEvents].map(
        (event) =>
          ({
            ...event,
            startDate: parseISO(event.start_date),
            endDate: parseISO(event.end_date),
          } as AppointmentModel),
      ),
    [oldEvents, events],
  );

  return (
    <Paper noPadding sx={{ '& div:first-of-type': { whiteSpace: 'break-spaces' }, '& table': { minWidth: 'unset' } }}>
      <Scheduler data={displayedEvents} firstDayOfWeek={1} locale='no-NB'>
        <ViewState />
        <MonthView />
        <Toolbar />
        <DateNavigator />
        <Appointments appointmentComponent={Appointment} />
      </Scheduler>
    </Paper>
  );
};

export default EventsCalendarView;
