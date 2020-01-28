import React from 'react';
import PropTypes from 'prop-types';

// Material-UI
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

// Project
import EventParticipant from './EventParticipant';
import EventStatistics from './EventStatistics';

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
  const {classes, event, closeParticipants, participants, removeUserFromEvent, toggleUserEvent} = props;

  const sortParticipants = (waitList) => {
    return participants.filter((user) => {
        let include = false;
        if (waitList && user.is_on_wait) {
          include = true;
        } else if (!waitList && !user.is_on_wait) {
          include = true;
        }
        return include;
    });
  };

  let participantsIn = [];
  let participantsOnWait = [];
  if (participants.length > 0) {
    participantsIn = sortParticipants(false);
    participantsOnWait = sortParticipants(true);
  }

  const printParticipants = (waitList) => {
    let elements = <Typography>Ingen påmeldte.</Typography>;
    let participantsToPrint;

      participantsToPrint = waitList ? participantsOnWait : participantsIn;

      if (participantsToPrint.length > 0) {
        elements = participantsToPrint.map((user, key) => {
          return <EventParticipant
                    key={key}
                    waitList={waitList}
                    attended={user.has_attended}
                    event={event}
                    removeUserFromEvent={removeUserFromEvent}
                    toggleUserEvent={toggleUserEvent}
                    user={user} />;
        });
      }

    return elements;
  };

  return (
    <React.Fragment>
      <div className={classes.header}>
        <div className={classes.heading}>
          <Typography variant='h4'>{event.title}</Typography>
        </div>
        <div className={classes.numbers}>
          <Typography>Antall påmeldte: {participantsIn.length}</Typography>
          <Typography>Antall på venteliste: {participantsOnWait.length}</Typography>
        </div>
      </div>
      <Divider />
      <div className={classes.content}>
        { participantsIn.length > 0 &&
        <div>
          <Typography variant='h5'>Statistikk</Typography>
          <div className={classes.listView}>
            <EventStatistics participants={participantsIn} />
          </div>
        </div>
        }
        <Typography variant='h5'>Påmeldte</Typography>
        <div className={classes.listView}>
          {printParticipants(false)}
        </div>
        <Typography variant='h5'>Venteliste</Typography>
        <div className={classes.listView}>
          {printParticipants(true)}
        </div>
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
    toggleUserEvent: PropTypes.func,
    participants: PropTypes.array,
    removeUserFromEvent: PropTypes.func,
};

export default withStyles(styles)(EventParticipants);
