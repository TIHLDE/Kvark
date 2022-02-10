import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useEvents } from 'hooks/Event';
import { EventCompact } from 'types';
import URLS from 'URLS';
import { Link } from 'react-router-dom';
import { parseISO } from 'date-fns';
import { urlEncode } from 'utils';
import { ViewState, AppointmentModel } from '@devexpress/dx-react-scheduler';
import { useTheme } from '@mui/material';
import { Scheduler, MonthView, Toolbar, DateNavigator, Appointments } from '@devexpress/dx-react-scheduler-material-ui';

// Project components
import Paper from 'components/layout/Paper';
import { useGoogleAnalytics } from 'hooks/Utils';
import { Groups } from 'types/Enums';

type Filters = {
  start_date_before?: string;
  start_date_after?: string;
  category?: number;
};
export type EventsCalendarViewProps = {
  eventsFilters?: Filters;
};

type AppointmentProps = {
  children: ReactNode;
  data: AppointmentModel;
};

const Appointment = ({ children, data }: AppointmentProps) => {
  const theme = useTheme();

  const getColor = (event: EventCompact) =>
    theme.palette.colors[event.organizer?.slug.toLowerCase() === Groups.NOK.toLowerCase() ? 'nok_event' : 'other_event'];
  return (
    <Link to={`${URLS.events}${data.id}/${urlEncode(data.title)}/`}>
      <Appointments.Appointment data={data} draggable={false} resources={[]} style={{ backgroundColor: getColor(data as unknown as EventCompact) }}>
        {children}
      </Appointments.Appointment>
    </Link>
  );
};

const EventsCalendarView = ({ eventsFilters }: EventsCalendarViewProps) => {
  const { event } = useGoogleAnalytics();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filters, setFilters] = useState<Filters>();
  const { data } = useEvents({ ...eventsFilters, ...filters });
  const events = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  useEffect(() => {
    event('open', 'calendar', 'Open calendar on landing page');
  }, [event]);

  useEffect(() => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    setFilters({ start_date_before: lastDay.toLocaleDateString(), start_date_after: firstDay.toLocaleDateString() });
  }, [currentDate]);
  const displayedEvents = useMemo(
    () =>
      [...events].map(
        (event) =>
          ({
            ...event,
            startDate: parseISO(event.start_date),
            endDate: parseISO(event.end_date),
          } as AppointmentModel),
      ),
    [data],
  );
  return (
    <Paper noPadding sx={{ '& div:first-of-type': { whiteSpace: 'break-spaces' }, '& table': { minWidth: 'unset' } }}>
      <Scheduler data={displayedEvents} firstDayOfWeek={1} locale='no-NB'>
        <ViewState currentDate={currentDate} onCurrentDateChange={setCurrentDate} />
        <MonthView />
        <Toolbar />
        <DateNavigator />
        <Appointments appointmentComponent={Appointment} />
      </Scheduler>
    </Paper>
  );
};

export default EventsCalendarView;
