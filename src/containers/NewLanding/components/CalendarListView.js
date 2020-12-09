import React from 'react';
import PropTypes from 'prop-types';
import URLS from '../../../URLS';
import { Link } from 'react-router-dom';
// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

// Project componets
import ListItem from '../../../components/miscellaneous/ListItem';

// Styles
const styles = (theme) => ({
  eventListContainer: {
    display: 'grid',
    gridGap: 1,
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.colors.background.smoke,
    margin: 'auto',
  },
  noEventText: {
    backgroundColor: theme.palette.colors.background.smoke,
    padding: 5,
    textAlign: 'center',
  },
  text: {
    padding: 0,
  },
  progress: {
    margin: 'auto',
    marginTop: 10,
    marginBottom: 10,
  },
  btn: {
    padding: theme.spacing(1),
  },
});

function CalendarListView({ classes, events, isLoading }) {
  const eventsToDisplay = 3;

  let eventList = (
    <div className={classes.noEventText}>
      <CircularProgress className={classes.progress} />
    </div>
  );
  if (!isLoading) {
    eventList =
      events && events.length > 0 ? (
        <React.Fragment>
          {events.map((event, index) => {
            if (index < eventsToDisplay) {
              return <ListItem event={event} key={event.id} />;
            }
            return '';
          })}
          <Button className={classes.btn} color='primary' component={Link} to={URLS.events} variant='outlined'>
            <Typography align='center'>Alle arrangementer ({events.length})</Typography>
          </Button>
        </React.Fragment>
      ) : (
        <Typography align='center' className={classes.noEventText} variant='subtitle1'>
          Ingen arrangementer å vise
        </Typography>
      );
  }

  return <div className={classes.eventListContainer}>{eventList}</div>;
}

CalendarListView.propTypes = {
  classes: PropTypes.object.isRequired,
  events: PropTypes.array,
  isLoading: PropTypes.bool,
};

export default withStyles(styles)(CalendarListView);
