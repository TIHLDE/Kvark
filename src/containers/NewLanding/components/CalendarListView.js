import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// Icons
import CalendarToday from '@material-ui/icons/CalendarToday';
import Schedule from '@material-ui/icons/Schedule';
import LocationOn from '@material-ui/icons/LocationOn';

// Project componets
import LinkButton from '../../../components/navigation/LinkButton';

import TIHLDELOGO from '../../../assets/img/tihlde_image.png';

// Styles
const styles = (theme) => ({
  eventListContainer: {
    display: 'grid',
    gridGap: '1px',
    color: theme.palette.text.secondary,
    margin: 'auto',
  },
  eventListRow: {
    display: 'flex',
    minHeight: 80,
    overflow: 'hidden',
    alignItems: 'center',
  },
  eventImageContainer: {
    minHeight: 81,
    minWidth: 81,
    width: 81,
    height: 81,
    overflow: 'hidden',
    display: 'inline-flex',
  },
  eventImage: {
    objectFit: 'cover',
    border: '1px solid whitesmoke',
    height: 80,
    width: 80,
  },
  eventTitle: {
    flexGrow: 1,
    padding: 5,
  },
  eventInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    textAlign: 'left',
    width: 150,
    overflow: 'hidden',
  },
  eventContainer: {
    display: 'flex',
    flexGrow: 1,
    '@media only screen and (max-width: 700px)': {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  eventInfoElement: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  eventIcon: {
    paddingRight: 10,
  },
  hiddenOnMobile: {
    '@media only screen and (max-width: 700px)': {
      display: 'none',
    },
  },
  noEventText: {
    backgroundColor: 'white',
    padding: 5,
  },
});


function CalendarListItem(props) {
  const { classes } = props;
  // props.eventData.image

  const start = moment(props.eventData.start, ['YYYY-MM-DD HH:mm'], 'nb');
  const src = props.eventData.image ? props.eventData.image : TIHLDELOGO;
  const imageAlt = props.eventData.image_alt ? props.eventData.image_alt : props.eventData.title;

  return (
      <LinkButton noPadding to={'/arrangementer/' + props.eventData.id + '/'}>
        <div className={classes.eventListRow}>
          <div className={classes.eventImageContainer}>
            <img className={classes.eventImage} src={src} alt={imageAlt} />
          </div>
          <div className={classes.eventContainer}>
            <div className={classes.eventTitle}>
              <Typography align='center' variant='title'>{props.eventData.title}</Typography>
              <div className={classNames(classes.hiddenOnMobile, classes.eventInfoElement)}>
                <LocationOn className={classes.eventIcon} />
                {props.eventData.location}
              </div>
            </div>
            <div className={classes.eventInfo}>
              <div className={classes.eventInfoElement}>
                <CalendarToday className={classes.eventIcon} />
                {start.format('DD.MM.YYYY')}
              </div>
              <div className={classNames(classes.hiddenOnMobile, classes.eventInfoElement)}>
                <Schedule className={classes.eventIcon} />
                {start.format('HH:mm')}
              </div>
            </div>
          </div>
        </div>
      </LinkButton>
  );
}

function CalendarListView(props) {
  const { classes } = props;
  const eventsToDisplay = 3;
  return (
    <div className={classes.eventListContainer}>
      {props.events && props.events.map((eventData, index) => {
        if (index < eventsToDisplay) {
          return (<CalendarListItem key={index} classes={classes} eventData={eventData} />);
        }
      })}
      {props.events ?
        <LinkButton noPadding to='/arrangementer/'>
          <Typography align='center'>Alle arrangementer ({props.events.length})</Typography>
        </LinkButton>
        :
        <Typography variant='subheading' className={classes.noEventText} align='center'>Ingen arrangementer å vise</Typography>
      }
    </div>
  );
}

// Prop types
CalendarListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  eventData: PropTypes.object.isRequired,
};

CalendarListView.propTypes = {
  classes: PropTypes.object.isRequired,
  events: PropTypes.array,
};

export default withStyles(styles)(CalendarListView);
