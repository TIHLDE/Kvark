import React from 'react';
import PropTypes from 'prop-types';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

// Project componets
import LinkButton from '../../../components/navigation/LinkButton';
import EventListItem from '../../Events/components/EventListItem';

// Styles
const styles = (theme) => ({
  eventListContainer: {
    display: 'grid',
    gridGap: '1px',
    color: theme.palette.text.secondary,
    margin: 'auto',
  },
  noEventText: {
    backgroundColor: 'white',
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
    boxShadow: '0px 2px 4px #ddd, 0px 0px 4px #ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
});

function CalendarListView(props) {
  const { classes, isLoading } = props;
  const eventsToDisplay = 3;

  let eventList = <div className={classes.noEventText}><CircularProgress className={classes.progress}/></div>;
  if (!isLoading) {
    eventList = props.events ?
        <div className={classes.moreBtn}>
          <LinkButton noPadding to='/arrangementer/'>
            <Typography align='center'>Alle arrangementer ({props.events.length})</Typography>
          </LinkButton>
        </div>
        :
        <Typography
          variant='subtitle1'
          className={classes.noEventText}
          align='center'>Ingen arrangementer å vise</Typography>;

  }

  return (
    <div className={classes.eventListContainer}>
      {props.events && props.events.map((eventData, index) => {
        if (index < eventsToDisplay) {
          return (<EventListItem key={index} data={eventData} />);
        }
        return ('');
      })}
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
