import React from 'react';
import PropTypes from 'prop-types';

// Material-UI
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

// Project
import EventParticipant from './EventParticipant';

const styles = {
  header: {
    display: 'flex',
    padding: 2,
    '@media only screen and (max-width: 800px)': {
        flexDirection: 'column',
    },
  },
  heading: {
    width: '100%',
  },
  numbers: {
    minWidth: 150,
    textAlign: 'end',
    display: 'flex',
    justifyContent: 'end',
    flexDirection: 'column',
    '@media only screen and (max-width: 800px)': {
        textAlign: 'start',
    },
  },
  content: {
    paddingTop: 36,
    paddingBottom: 4,
  },
  listView: {
    width: '100%',
    paddingBottom: 36,
    paddingTop: 8,
  },
};

const EventParticipants = (props) => {
  const {classes, event, closeParticipants, participants, removeUserFromEvent} = props;
  return (
    <React.Fragment>
      <div className={classes.header}>
        <div className={classes.heading}>
          <Typography variant='h4'>{event.title}</Typography>
        </div>
        <div className={classes.numbers}>
          <Typography>Antall påmeldte: 50</Typography>
          <Typography>Antall på venteliste: 20</Typography>
        </div>
      </div>
      <Divider />
      <div className={classes.content}>
        <Typography variant='h5'>Påmeldte</Typography>
        <div className={classes.listView}>
          {participants.length > 0 ? participants.map((user, key) => {
            return <EventParticipant key={key} event={event} removeUserFromEvent={removeUserFromEvent} user_id={user.user_id} />;
          })
          :
          <Typography>Ingen påmeldte.</Typography>
          }
        </div>
        <Typography variant='h5'>Venteliste</Typography>
        <div className={classes.listView}>Ingen her</div>
      </div>
      <Button
        onClick={closeParticipants}
        variant='outlined'
        color='primary'>Tilbake</Button>
    </React.Fragment>
  );
};

EventParticipants.propTypes = {
    classes: PropTypes.object,
    event: PropTypes.object,
    closeParticipants: PropTypes.func,
    participants: PropTypes.array,
    removeUserFromEvent: PropTypes.func,
};

export default withStyles(styles)(EventParticipants);
