import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// API and store imports
import EventService from '../../../api/services/EventService';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// Project
import EventParticipant from './EventParticipant';
import EventStatistics from './EventStatistics';

const styles = (theme) => ({
  root: {
    padding: 20,
  },
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
    minWidth: 160,
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
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkbox: {
    marginTop: '-6px',
    marginBottom: '-6px',
  },
  mainText: {
    color: theme.colors.text.main,
  },
  lightText: {
    color: theme.colors.text.light,
  },
});

const EventParticipants = (props) => {
  const { classes, event, openSnackbar } = props;

  const [showOnlyNotAttended, setCheckedState] = useState(false);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (event.id) {
      EventService.getEventParticipants(event.id).then((result) => {
        setParticipants(result);
      });
    }
  }, [event]);

  const removeUserFromEvent = (userId) => {
    EventService.deleteUserFromEventList(event.id, { user_id: userId })
      .then(() => {
        const newParticipants = participants.filter((user) => user.user_info.user_id !== userId);
        setParticipants(newParticipants);
      })
      .catch((error) => openSnackbar(JSON.stringify(error)))
      .finally(() => openSnackbar('Deltageren ble fjernet'));
  };

  const toggleUserEvent = (userId, parameters) => {
    EventService.updateUserEvent(event.id, { user_id: userId, ...parameters })
      .then(() => {
        const newParticipants = participants.map((user) => {
          return user.user_info.user_id === userId ? { ...user, ...parameters } : user;
        });
        setParticipants(newParticipants);
      })
      .catch((error) => openSnackbar(JSON.stringify(error)))
      .finally(() => openSnackbar('Endringen var vellykket'));
  };

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

  const printParticipants = (waitList, notAttended = false) => {
    let elements = <Typography className={classes.lightText}>Ingen påmeldte.</Typography>;
    let participantsToPrint = waitList ? sortParticipants(true) : sortParticipants(false);

    if (notAttended) {
      participantsToPrint = participantsToPrint.filter((user) => !user.has_attended);
    }

    if (participantsToPrint.length > 0) {
      elements = participantsToPrint.map((user, key) => {
        return <EventParticipant key={key} removeUserFromEvent={removeUserFromEvent} toggleUserEvent={toggleUserEvent} user={user} waitList={waitList} />;
      });
    }

    return elements;
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.heading}>
          <Typography className={classes.mainText} variant='h4'>
            {event.title}
          </Typography>
        </div>
        <div className={classes.numbers}>
          <Typography className={classes.lightText}>Antall påmeldte: {sortParticipants(false).length}</Typography>
          <Typography className={classes.lightText}>Antall på venteliste: {sortParticipants(true).length}</Typography>
        </div>
      </div>
      <Divider />
      <div className={classes.content}>
        {sortParticipants(false).length > 0 && (
          <div>
            <Typography className={classes.mainText} variant='h5'>
              Statistikk
            </Typography>
            <div className={classes.listView}>
              <EventStatistics participants={sortParticipants(false)} />
            </div>
          </div>
        )}
        <div className={classes.flexRow}>
          <Typography className={classes.mainText} variant='h5'>
            Påmeldte ({sortParticipants(false).length})
          </Typography>
          <FormControlLabel
            className={classes.lightText}
            control={<Checkbox checked={showOnlyNotAttended} className={classes.checkbox} onChange={(e) => setCheckedState(e.target.checked)} />}
            label='Ikke ankommet'
            labelPlacement='start'
          />
        </div>
        <div className={classes.listView}>{printParticipants(false, showOnlyNotAttended)}</div>
        <Typography className={classes.mainText} variant='h5'>
          Venteliste ({sortParticipants(true).length})
        </Typography>
        <div className={classes.listView}>{printParticipants(true)}</div>
      </div>
    </div>
  );
};

EventParticipants.propTypes = {
  classes: PropTypes.object,
  event: PropTypes.object.isRequired,
  openSnackbar: PropTypes.func,
};

export default withStyles(styles)(EventParticipants);
