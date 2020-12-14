import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

// Project componets/services
import { useEvent } from '../../../api/hooks/Event';
import CalendarListView from './CalendarListView';
import CalendarGridView from './CalendarGridView';

// Icons
import Reorder from '@material-ui/icons/Reorder';
import DateRange from '@material-ui/icons/DateRange';

// Styles
const styles = (theme) => ({
  root: {
    flexGrow: 1,
    padding: '0 6px', // MUI Grid requires a padding of half the given spacing.
  },
  paper: {
    padding: theme.spacing(),
    color: theme.palette.text.secondary,
    textAlign: 'center',
  },
  container: {
    maxWidth: 1100,
    width: '100%',
  },
  tabs: {
    marginBottom: 1,
    color: theme.palette.text.secondary,
  },
});

function Calendar({ classes }) {
  const { getEvents, getExpiredEvents } = useEvent();
  const [events, setEvents] = useState([]);
  const [oldEvents, setOldEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    getEvents()
      .then((eventObject) => setEvents(eventObject.results))
      .finally(() => setIsLoading(false));
  }, [getEvents]);

  useEffect(() => {
    // Load expired events when switching to calendar tab and they havn't been loaded already
    if (!oldEvents.length && tab === 1) {
      getExpiredEvents().then((eventObject) => setOldEvents(eventObject.results));
    }
  }, [tab, oldEvents, getExpiredEvents]);

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Tabs centered className={classes.tabs} onChange={(e, newTab) => setTab(newTab)} value={tab}>
          <Tab icon={<Reorder />} label='Listevisning' />
          <Tab icon={<DateRange />} label='Kalendervisning' />
        </Tabs>
        {tab === 0 ? <CalendarListView events={events} isLoading={isLoading} /> : <CalendarGridView events={events} oldEvents={oldEvents} />}
      </div>
    </div>
  );
}

Calendar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Calendar);
