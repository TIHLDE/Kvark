import { ReactNode, useState, useEffect } from 'react';
import { EventCompact } from 'types/Types';
import URLS from 'URLS';
import { Link } from 'react-router-dom';
import { parseISO } from 'date-fns';
import { urlEncode } from 'utils';
import { ViewState, AppointmentModel } from '@devexpress/dx-react-scheduler';
// TODO: Swap dependency with @devexpress/dx-react-scheduler-material-ui when it supports Material-UI v5
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Scheduler, MonthView, Toolbar, DateNavigator, Appointments } from '@olros/devexpress-dx-react-scheduler-material-ui';

// Material-UI
import { makeStyles } from '@material-ui/styles';

// Project components
import Paper from 'components/layout/Paper';
import { useGoogleAnalytics } from 'api/hooks/Utils';

// Styles
const useStyles = makeStyles(() => ({
  root: {
    '& div:first-of-type': {
      whiteSpace: 'break-spaces',
    },
    '& table': {
      minWidth: 'unset',
    },
  },
}));

export type EventsCalendarViewProps = {
  events: Array<EventCompact>;
  oldEvents: Array<EventCompact>;
};

const EventsCalendarView = ({ events, oldEvents }: EventsCalendarViewProps) => {
  const classes = useStyles();
  const { event } = useGoogleAnalytics();
  const [displayedEvents, setDisplayedEvents] = useState<Array<AppointmentModel>>([]);

  useEffect(() => {
    event('open', 'calendar', 'Open calendar on landing page');
    const newEvents = [...events, ...oldEvents].map((event) => {
      return {
        ...event,
        startDate: parseISO(event.start_date),
        endDate: parseISO(event.end_date),
      } as AppointmentModel;
    });
    setDisplayedEvents(newEvents);
  }, [oldEvents, events]);

  type AppointmentProps = {
    children: ReactNode;
    data: AppointmentModel;
  };

  const Appointment = ({ children, data }: AppointmentProps) => {
    return (
      <Link to={`${URLS.events}${data.id}/${urlEncode(data.title)}/`}>
        <Appointments.Appointment data={data} draggable={false} resources={[]}>
          {children}
        </Appointments.Appointment>
      </Link>
    );
  };

  return (
    <Paper className={classes.root} noPadding>
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
