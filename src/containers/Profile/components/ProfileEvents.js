import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useUser } from '../../../api/hooks/User';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// Project componets
import ListItem from '../../../components/miscellaneous/ListItem';

const styles = (theme) => ({
  text: {
    color: theme.palette.text.secondary,
  },
});

function ProfileEvents(props) {
  const { classes } = props;
  const [events, setEvents] = useState([]);
  const { getUserData } = useUser();

  useEffect(() => {
    getUserData().then((user) => {
      if (user) {
        setEvents(user.events);
      }
    });
  }, [getUserData]);

  return (
    <div>
      {events &&
        events.map((event) => {
          if (!event.expired) {
            return <ListItem event={event} key={event.id} />;
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
