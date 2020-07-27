import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import URLS from '../../../URLS';
import {Link} from 'react-router-dom';
import moment from 'moment';
import {ViewState} from '@devexpress/dx-react-scheduler';
import {Scheduler, MonthView, Toolbar, DateNavigator, Appointments} from '@devexpress/dx-react-scheduler-material-ui';

// Material-UI
import {withStyles} from '@material-ui/core/styles';

// Project components
import Paper from '../../../components/layout/Paper';

// Styles
const styles = (theme) => ({
  root: {
    '& div:first-child': {
      overflowY: 'hidden',
    },
  },
});

function CalendarGridView({classes, events, oldEvents}) {
  const [displayedEvents, setDisplayedEvents] = useState([]);

  useEffect(() => {
    if (events) {
      const newEvents = [...events, ...oldEvents].map((event) => {
        return ({
          ...event,
          startDate: moment(event.start_date, ['YYYY-MM-DD HH:mm'], 'nb').toDate(),
          endDate: moment(event.end_date, ['YYYY-MM-DD HH:mm'], 'nb').toDate(),
        });
      });
      setDisplayedEvents(newEvents);
    }
  }, [oldEvents, events]);

  const Appointment = ({children, data}) => {
    return (
      <Link to={URLS.events.concat(data.id).concat('/')}>
        <Appointments.Appointment>
          {children}
        </Appointments.Appointment>
      </Link>
    );
  };

  Appointment.propTypes = {
    children: PropTypes.node.isRequired,
    data: PropTypes.object.isRequired,
  };

  return (
    <Paper noPadding className={classes.root}>
      <Scheduler
        data={displayedEvents}
        firstDayOfWeek={1}
        locale='no-NB'
      >
        <ViewState />
        <MonthView />
        <Toolbar />
        <DateNavigator />
        <Appointments appointmentComponent={Appointment} />
      </Scheduler>
    </Paper>
  );
}

CalendarGridView.propTypes = {
  classes: PropTypes.object.isRequired,
  events: PropTypes.array,
  oldEvents: PropTypes.array,
};

export default withStyles(styles)(CalendarGridView);
