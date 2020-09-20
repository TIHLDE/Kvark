import React from 'react';
import PropTypes from 'prop-types';
import URLS from '../../../URLS';
import { getFormattedDate } from '../../../utils';
import moment from 'moment';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

// Icons
import DateIcon from '@material-ui/icons/DateRange';
import LocationIcon from '@material-ui/icons/LocationOn';

// Project componets
import LinkButton from '../../../components/navigation/LinkButton';
import ListItem from '../../../components/miscellaneous/ListItem';

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
              return (
                <ListItem
                  expired={event.expired}
                  img={event.image}
                  imgAlt={event.image_alt}
                  info={[
                    { label: getFormattedDate(moment(event.start_date, ['YYYY-MM-DD HH:mm'], 'nb')), icon: DateIcon },
                    { label: event.location, icon: LocationIcon },
                  ]}
                  key={event.id}
                  link={URLS.events + ''.concat(event.id, '/')}
                  title={event.title}
                />
              );
            }
            return '';
          })}
          <div className={classes.moreBtn}>
            <LinkButton noPadding to='/arrangementer/'>
              <Typography align='center'>Alle arrangementer ({events.length})</Typography>
            </LinkButton>
          </div>
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
