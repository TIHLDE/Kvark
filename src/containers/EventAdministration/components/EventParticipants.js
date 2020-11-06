import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// API and store imports
import { useEvent } from '../../../api/hooks/Event';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

// Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreRounded';
import ExpandLessIcon from '@material-ui/icons/ExpandLessRounded';
import CopyIcon from '@material-ui/icons/FileCopyOutlined';

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
    padding: theme.spacing(1, 0, 3),
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
    color: theme.palette.colors.text.main,
  },
  lightText: {
    color: theme.palette.colors.text.light,
  },
  emailButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: theme.spacing(1),
    margin: theme.spacing(0, 0, 1),
  },
});

const EventParticipants = (props) => {
  const { classes, event, openSnackbar } = props;
  const { getEventRegistrations, deleteRegistration, updateRegistration } = useEvent();
  const [showOnlyNotAttended, setCheckedState] = useState(false);
  const [showEmails, setShowEmails] = useState(false);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (event.id) {
      getEventRegistrations(event.id)
        .then((result) => {
          setParticipants(result);
        })
        .catch(() => {});
    }
  }, [event, getEventRegistrations]);

  const removeUserFromEvent = (registration) => {
    deleteRegistration(event.id, registration.user_info.user_id, registration)
      .then((data) => {
        const newParticipants = participants.filter((user) => user.user_info.user_id !== registration.user_info.user_id);
        setParticipants(newParticipants);
        openSnackbar(data.detail);
      })
      .catch((error) => openSnackbar(error.detail));
  };

  const toggleUserEvent = (userId, parameters) => {
    updateRegistration(event.id, { user_id: userId, ...parameters }, userId)
      .then((data) => {
        const newParticipants = participants.map((user) => {
          return user.user_info.user_id === userId ? data : user;
        });
        setParticipants(newParticipants);
        openSnackbar('Endringen var vellykket');
      })
      .catch((error) => openSnackbar(error.detail));
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
        return (
          <EventParticipant
            key={key}
            removeUserFromEvent={removeUserFromEvent}
            showEmail={showEmails}
            toggleUserEvent={toggleUserEvent}
            user={user}
            waitList={waitList}
          />
        );
      });
    }

    return elements;
  };

  const getEmails = () => {
    let emails = '';
    const participants = sortParticipants(false);
    participants.forEach((participant, i) => {
      emails += participant.user_info.email;
      if (i < participants.length - 1) {
        emails += ' \n';
      }
    });
    return emails;
  };

  const copyEmails = () => {
    const tempInput = document.createElement('textarea');
    tempInput.value = getEmails();
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
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
          <>
            <Typography className={classes.mainText} variant='h5'>
              Statistikk
            </Typography>
            <div className={classes.listView}>
              <EventStatistics participants={sortParticipants(false)} />
            </div>
          </>
        )}
        <div className={classes.emailButtons}>
          <Button endIcon={showEmails ? <ExpandLessIcon /> : <ExpandMoreIcon />} fullWidth onClick={() => setShowEmails((now) => !now)} variant='outlined'>
            Vis eposter
          </Button>
          <Button endIcon={<CopyIcon />} fullWidth onClick={copyEmails} variant='outlined'>
            Kopier eposter
          </Button>
        </div>
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
