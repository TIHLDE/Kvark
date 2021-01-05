import React, { useState, useEffect } from 'react';
import { Event } from 'types/Types';
import URLS from 'URLS';
import { Link } from 'react-router-dom';
import { parseISO } from 'date-fns';
import { urlEncode } from 'utils';
import { ViewState, AppointmentModel } from '@devexpress/dx-react-scheduler';
import { Scheduler, MonthView, Toolbar, DateNavigator, Appointments } from '@devexpress/dx-react-scheduler-material-ui';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';

// Project components
import Paper from 'components/layout/Paper';

// Styles
const useStyles = makeStyles(() => ({
  root: {
    '& div:first-child': {
      overflowY: 'hidden',
    },
  },
}));

export type EventsCalendarViewProps = {
  events: Array<Event>;
  oldEvents: Array<Event>;
};

const EventsCalendarView = ({ events, oldEvents }: EventsCalendarViewProps) => {
  const classes = useStyles();
  const [displayedEvents, setDisplayedEvents] = useState<Array<AppointmentModel>>([]);

  useEffect(() => {
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
    children: React.ReactNode;
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
