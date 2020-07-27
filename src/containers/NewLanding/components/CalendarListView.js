import React from 'react';
import PropTypes from 'prop-types';

// Material-UI
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

// Project componets
import LinkButton from '../../../components/navigation/LinkButton';
import EventListItem from '../../Events/components/EventListItem';

// Styles
const styles = (theme) => ({
  eventListContainer: {
    display: 'grid',
    gridGap: 1,
    color: theme.palette.text.secondary,
    backgroundColor: theme.colors.background.smoke,
    margin: 'auto',
  },
  noEventText: {
    backgroundColor: theme.colors.background.smoke,
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
  moreBtn: {
    boxShadow: '0px 2px 4px ' + theme.colors.border.main + '88, 0px 0px 4px ' + theme.colors.border.main + '88',
    borderRadius: theme.sizes.border.radius,
    overflow: 'hidden',
  },
});

function CalendarListView({classes, events, isLoading}) {
  const eventsToDisplay = 3;

  let eventList = <div className={classes.noEventText}><CircularProgress className={classes.progress}/></div>;
  if (!isLoading) {
    eventList = events && events.length > 0 ?
        <React.Fragment>
          {events.map((eventData, index) => {
            if (index < eventsToDisplay) {
              return (<EventListItem key={index} data={eventData} />);
            }
            return ('');
          })}
          <div className={classes.moreBtn}>
            <LinkButton noPadding to='/arrangementer/'>
              <Typography align='center'>Alle arrangementer ({events.length})</Typography>
            </LinkButton>
          </div>
        </React.Fragment> :
        <Typography
          variant='subtitle1'
          className={classes.noEventText}
          align='center'>Ingen arrangementer å vise</Typography>;
  }

  return (
    <div className={classes.eventListContainer}>
      {eventList}
    </div>
  );
}

CalendarListView.propTypes = {
  classes: PropTypes.object.isRequired,
  events: PropTypes.array,
  isLoading: PropTypes.bool,
};

export default withStyles(styles)(CalendarListView);
