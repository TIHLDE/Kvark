import { useState, useMemo, useCallback } from 'react';
import { useEventById, useEventRegistrations } from 'api/hooks/Event';
import { useSnackbar } from 'api/hooks/Snackbar';

// Material-UI
import { makeStyles } from '@material-ui/styles';
import { Typography, Stack, Divider, FormControlLabel, Checkbox, Button, List, LinearProgress } from '@material-ui/core';

// Icons
import CopyIcon from '@material-ui/icons/FileCopyOutlined';

// Project
import Participant from 'containers/EventAdministration/components/Participant';
import EventStatistics from 'containers/EventAdministration/components/EventStatistics';
import EventMessageSender from 'containers/EventAdministration/components/EventMessageSender';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 0, 1),
    [theme.breakpoints.down('lg')]: {
      flexDirection: 'column',
    },
  },
  numbers: {
    minWidth: 160,
    textAlign: 'end',
    display: 'flex',
    justifyContent: 'end',
    flexDirection: 'column',
    [theme.breakpoints.down('lg')]: {
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
}));

export type EventParticipantsProps = {
  eventId: number;
};

const EventParticipants = ({ eventId }: EventParticipantsProps) => {
  const classes = useStyles();
  const { data, isLoading } = useEventById(eventId);
  const { data: participants } = useEventRegistrations(eventId);
  const showSnackbar = useSnackbar();
  const [showOnlyNotAttended, setShowOnlyNotAttended] = useState(false);

  const getOnWaitlist = useMemo(() => (participants || []).filter((user) => user.is_on_wait), [participants]);
  const getAttending = useMemo(() => (participants || []).filter((user) => !user.is_on_wait), [participants]);

  type ParticipantsProps = {
    onWaitlist?: boolean;
    onlyNotAttended?: boolean;
  };

  const Participants = ({ onWaitlist = false, onlyNotAttended = false }: ParticipantsProps) => {
    const registrationsToPrint = onWaitlist ? getOnWaitlist : getAttending;
    if (registrationsToPrint.length) {
      return (
        <>
          <div className={classes.flexRow}>
            <Typography className={classes.mainText} variant='caption'>
              Detaljer
            </Typography>
            {!onWaitlist && (
              <Typography className={classes.mainText} variant='caption'>
                Ankommet
              </Typography>
            )}
          </div>
          <List className={classes.listView}>
            {(onlyNotAttended ? registrationsToPrint.filter((user) => !user.has_attended) : registrationsToPrint).map((registration) => (
              <Participant eventId={eventId} key={registration.registration_id} registration={registration} />
            ))}
          </List>
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

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <>
      <div className={classes.header}>
        <Typography className={classes.mainText} variant='h2'>
          {data?.title || 'Laster...'}
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
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mb: 1 }}>
          <Button endIcon={<CopyIcon />} fullWidth onClick={copyEmails} variant='outlined'>
            Kopier eposter
          </Button>
          <EventMessageSender eventId={eventId} />
        </Stack>
        <div className={classes.flexRow}>
          <Typography className={classes.mainText} variant='h3'>
            Påmeldte ({getAttending.length})
          </Typography>
          <FormControlLabel
            className={classes.mainText}
            control={<Checkbox checked={showOnlyNotAttended} className={classes.checkbox} onChange={(e) => setShowOnlyNotAttended(e.target.checked)} />}
            label='Ikke ankommet'
            labelPlacement='start'
          />
        </div>
        <Participants onlyNotAttended={showOnlyNotAttended} onWaitlist={false} />
        <Typography className={classes.mainText} variant='h3'>
          Venteliste ({getOnWaitlist.length})
        </Typography>
        <Participants onWaitlist />
      </div>
    </>
  );
};

export default EventParticipants;
