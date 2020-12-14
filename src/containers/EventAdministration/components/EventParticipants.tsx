import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Event, Registration } from 'types/Types';

// API and store imports
import { useEvent } from 'api/hooks/Event';
import { useSnackbar } from 'api/hooks/Snackbar';

// Material-UI
import { makeStyles, Theme } from '@material-ui/core/styles';
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
import Participant from 'containers/EventAdministration/components/Participant';
import EventStatistics from 'containers/EventAdministration/components/EventStatistics';

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 0, 1),
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  numbers: {
    minWidth: 160,
    textAlign: 'end',
    display: 'flex',
    justifyContent: 'end',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      textAlign: 'start',
    },
  },
  content: {
    paddingTop: theme.spacing(2),
  },
  listView: {
    width: '100%',
    padding: theme.spacing(1, 0, 2),
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkbox: {
    marginTop: theme.spacing(-0.75),
    marginBottom: theme.spacing(-0.75),
  },
  mainText: {
    color: theme.palette.text.primary,
  },
  lightText: {
    color: theme.palette.text.secondary,
  },
  emailButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: theme.spacing(1),
    margin: theme.spacing(0, 0, 1),
  },
}));

export type EventParticipantsProps = {
  eventId: number;
};

const EventParticipants = ({ eventId }: EventParticipantsProps) => {
  const classes = useStyles();
  const { getEventById, getEventRegistrations, deleteRegistration, updateRegistration } = useEvent();
  const showSnackbar = useSnackbar();
  const [event, setEvent] = useState<Event | null>(null);
  const [showOnlyNotAttended, setShowOnlyNotAttended] = useState(false);
  const [showEmails, setShowEmails] = useState(false);
  const [participants, setParticipants] = useState<Array<Registration>>([]);

  useEffect(() => {
    getEventRegistrations(eventId).then((result) => setParticipants(result));
  }, [eventId, getEventRegistrations]);

  useEffect(() => {
    getEventById(eventId).then((result) => setEvent(result));
  }, [eventId, getEventById]);

  const removeUserFromEvent = (registration: Registration) => {
    deleteRegistration(eventId, registration.user_info.user_id, registration)
      .then((data) => {
        const newParticipants = participants.filter((user) => user.user_info.user_id !== registration.user_info.user_id);
        setParticipants(newParticipants);
        showSnackbar(data.detail, 'success');
      })
      .catch((error) => showSnackbar(error.detail, 'error'));
  };

  const registrationUpdate = (userId: string, parameters: Partial<Registration>) => {
    updateRegistration(eventId, parameters, userId)
      .then((data) => {
        const newParticipants = participants.map((user) => {
          return user.user_info.user_id === userId ? data : user;
        });
        setParticipants(newParticipants);
        showSnackbar('Endringen var vellykket', 'success');
      })
      .catch((error) => showSnackbar(error.detail, 'error'));
  };

  const getOnWaitlist = useMemo(() => participants.filter((user) => user.is_on_wait), [participants]);
  const getAttending = useMemo(() => participants.filter((user) => !user.is_on_wait), [participants]);

  const printParticipants = (onWaitlist = false, onlyNotAttended = false) => {
    const registrationsToPrint = onWaitlist ? getOnWaitlist : getAttending;
    if (registrationsToPrint.length) {
      return (
        <>
          {(onlyNotAttended ? registrationsToPrint.filter((user) => !user.has_attended) : registrationsToPrint).map((registration) => (
            <Participant
              key={registration.registration_id}
              registration={registration}
              removeUserFromEvent={removeUserFromEvent}
              showEmail={showEmails}
              updateRegistration={registrationUpdate}
            />
          ))}
        </>
      );
    } else {
      return <Typography className={classes.lightText}>Ingen påmeldte.</Typography>;
    }
  };

  const getEmails = useCallback(() => {
    let emails = '';
    const participants = getAttending;
    participants.forEach((participant, i) => {
      emails += participant.user_info.email;
      if (i < participants.length - 1) {
        emails += ' \n';
      }
    });
    return emails;
  }, [getAttending]);

  const copyEmails = () => {
    const tempInput = document.createElement('textarea');
    tempInput.value = getEmails();
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showSnackbar('Epostene ble kopiert til utklippstavlen', 'info');
  };

  return (
    <>
      <div className={classes.header}>
        <Typography className={classes.mainText} variant='h2'>
          {event?.title || 'Laster...'}
        </Typography>
        <div className={classes.numbers}>
          <Typography className={classes.lightText}>Antall påmeldte: {getAttending.length}</Typography>
          <Typography className={classes.lightText}>Antall på venteliste: {getOnWaitlist.length}</Typography>
        </div>
      </div>
      <Divider />
      <div className={classes.content}>
        {Boolean(getAttending.length) && (
          <>
            <Typography className={classes.mainText} variant='h3'>
              Statistikk
            </Typography>
            <div className={classes.listView}>
              <EventStatistics registrations={getAttending} />
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
          <Typography className={classes.mainText} variant='h3'>
            Påmeldte ({getAttending.length})
          </Typography>
          <FormControlLabel
            className={classes.lightText}
            control={<Checkbox checked={showOnlyNotAttended} className={classes.checkbox} onChange={(e) => setShowOnlyNotAttended(e.target.checked)} />}
            label='Ikke ankommet'
            labelPlacement='start'
          />
        </div>
        <div className={classes.listView}>{printParticipants(false, showOnlyNotAttended)}</div>
        <Typography className={classes.mainText} variant='h3'>
          Venteliste ({getOnWaitlist.length})
        </Typography>
        <div className={classes.listView}>{printParticipants(true)}</div>
      </div>
    </>
  );
};

export default EventParticipants;
