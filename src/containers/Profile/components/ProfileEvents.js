// React
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import UserService from '../../../api/services/UserService';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

// Project componets
import EventListItem from '../../Events/components/EventListItem';

const styles = (theme) => ({
  wrapper: {
    paddingTop: 10,
  },
  text: {
    color: theme.colors.text.light,
  },
});

function ProfileEvents(props) {
  const { classes } = props;
  const [events, setEvents] = useState([]);

  const loadUserData = () => {
    UserService.getUserData().then((user) => {
      if (user) {
        setEvents(user.events);
      }
    });
  };

  useEffect(() => loadUserData(), []);

  return (
    <div className={classes.wrapper}>
      {events &&
        events.map((eventData, key) => {
          if (eventData.expired === false) {
            return <EventListItem data={eventData} key={key} />;
          }
          return '';
        })}
      {events.length < 1 && (
        <Typography align='center' className={classes.text} variant='subtitle1'>
          Du er ikke påmeldt noen kommende arrangementer
        </Typography>
      )}
    </div>
  );
}

ProfileEvents.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(ProfileEvents);
