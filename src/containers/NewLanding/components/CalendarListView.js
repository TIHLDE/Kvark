import React, {useState} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Icons
import CalendarToday from '@material-ui/icons/CalendarToday';
import Schedule from '@material-ui/icons/Schedule';
import LocationOn from '@material-ui/icons/LocationOn';

// Project componets
import LinkButton from '../../../components/navigation/LinkButton';

import Image from "../../../assets/img/glad.jpg"; // Remove this after testing

// Styles
const styles = theme => ({
  eventListRow: {
    display: 'flex',
    backgroundColor: 'white',
    maxHeight: 80,
    overflow: 'hidden'
  },
  eventListContainer: {
    padding: 1,
    display: 'grid',
    gridGap: '1px',
    color: theme.palette.text.secondary,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  eventImageContainer: {
    height: 80,
    width: 80,
    overflow: 'hidden',
    display: 'inline-flex'
  },
  eventImage: {
    objectFit: 'cover',
  },
  eventTitle: {
    flexGrow: 1,
    padding: 5,
  },
  eventInfo: {
    padding: '5px',
    textAlign: 'center',
    width: 150,
    overflow: 'hidden'
  },
  eventContainer: {
    display: 'flex',
    flexGrow: 1,
    '@media only screen and (max-width: 700px)': {
      flexDirection: 'column',
      alignItems: 'center',
    }
  },
  eventInfoElement: {
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  eventIcon: {
    paddingRight: 10,
  },
  hiddenOnMobile: {
    '@media only screen and (max-width: 700px)': {
      display: 'none'
    }
  }
});


function CalendarListItem(props) {
  const {classes} = props
  //props.eventData.image

  const start = moment(props.eventData.start, ['YYYY-MM-DD HH:mm'], 'nb');

  return (
    <LinkButton noPadding to={'/arrangementer/' + props.eventData.id + '/'}>
      <div className={classes.eventListRow}>
        <div className={classes.eventImageContainer}>
          <img className={classes.eventImage} src={Image} alt={props.eventData.image_alt} />
        </div>
        <div className={classes.eventContainer}>
          <div className={classes.eventTitle}>
            <Typography align='center' variant='title'>{props.eventData.title}</Typography>
          </div>
          <div className={classes.eventInfo}>
            <div className={classes.eventInfoElement}>
              <CalendarToday className={classes.eventIcon}/>
              {start.format('DD.MM.YYYY')}
            </div>
            <div className={classNames(classes.hiddenOnMobile, classes.eventInfoElement)}>
              <Schedule className={classes.eventIcon}/>
              {start.format('HH:mm')}
            </div>
            <div className={classNames(classes.hiddenOnMobile, classes.eventInfoElement)}>
              <LocationOn className={classes.eventIcon} />
              {props.eventData.location}
            </div>
          </div>
        </div>
      </div>
    </LinkButton>
  )
}

function CalendarListView(props) {
  const {classes} = props
  const eventsToDisplay = 3
  return (
    <Paper className={classes.eventListContainer}>
      {props.events && props.events.map((eventData, index) => {
        if (index < eventsToDisplay){
          return (<CalendarListItem key={index} classes={classes} eventData={eventData} />);
        }
      })}
      <LinkButton noPadding to='/arrangementer/'>
        {props.events && eventsToDisplay <  props.events.length ?
          <Typography align='center'>Alle arrangementer ({props.events.length})</Typography>
          :
          null}
      </LinkButton>
    </Paper>
  )
}

// Prop types
CalendarListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  eventData: PropTypes.object.isRequired
}

CalendarListView.propTypes = {
  events: PropTypes.array,
}

export default withStyles(styles)(CalendarListView)
