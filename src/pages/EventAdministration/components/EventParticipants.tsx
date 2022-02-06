import { useState, useMemo, useCallback } from 'react';
import { useEventById, useEventRegistrations } from 'hooks/Event';
import { useSnackbar } from 'hooks/Snackbar';
import { Registration } from 'types';

// Material-UI
import { Typography, Stack, Divider, FormControlLabel, Checkbox, Button, List, LinearProgress, Box } from '@mui/material';

// Icons
import CopyIcon from '@mui/icons-material/FileCopyOutlined';

// Project
import Participant from 'pages/EventAdministration/components/Participant';
import EventParticipantsStatistics from 'pages/EventAdministration/components/EventParticipantsStatistics';
import EventMessageSender from 'pages/EventAdministration/components/EventMessageSender';
import EventFileSender from 'pages/EventAdministration/components/EventFileSender';

export type EventParticipantsProps = {
  eventId: number;
};

const EventParticipants = ({ eventId }: EventParticipantsProps) => {
  const { data, isLoading } = useEventById(eventId);
  const { data: participants } = useEventRegistrations(eventId);
  const showSnackbar = useSnackbar();
  const [showOnlyNotAttended, setShowOnlyNotAttended] = useState(false);

  const registrationsOnWaitlist = useMemo(() => (participants || []).filter((user) => user.is_on_wait), [participants]);
  const registrationsNotOnWait = useMemo(() => (participants || []).filter((user) => !user.is_on_wait), [participants]);

  type ParticipantsProps = {
    onWaitlist?: boolean;
    onlyNotAttended?: boolean;
    registrations: Array<Registration>;
  };

  const Participants = ({ registrations, onWaitlist = false, onlyNotAttended = false }: ParticipantsProps) => {
    if (registrations.length) {
      return (
        <>
          <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
            <Typography variant='caption'>Detaljer</Typography>
            {!onWaitlist && <Typography variant='caption'>Ankommet</Typography>}
          </Stack>
          <List>
            {(onlyNotAttended ? registrations.filter((user) => !user.has_attended) : registrations).map((registration) => (
              <Participant eventId={eventId} key={registration.registration_id} registration={registration} />
            ))}
          </List>
        </>
      );
    } else {
      return <Typography>Ingen påmeldte.</Typography>;
    }
  };

  const getEmails = useCallback(() => {
    let emails = '';
    const participants = registrationsNotOnWait;
    participants.forEach((participant, i) => {
      emails += participant.user_info.email;
      if (i < participants.length - 1) {
        emails += ' \n';
      }
    });
    return emails;
  }, [registrationsNotOnWait]);

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
      <Stack direction={{ xs: 'column', lg: 'row' }} sx={{ justifyContent: 'space-between' }}>
        <Typography variant='h2'>{data?.title || 'Laster...'}</Typography>
        <Box sx={{ textAlign: { lg: 'end' } }}>
          <Typography>Antall påmeldte: {registrationsNotOnWait.length}</Typography>
          <Typography>Antall på venteliste: {registrationsOnWaitlist.length}</Typography>
        </Box>
      </Stack>
      <Divider sx={{ my: 1 }} />
      <div>
        {Boolean(registrationsNotOnWait.length) && (
          <>
            <Typography variant='h3'>Statistikk</Typography>
            <Box sx={{ pt: 1, pb: 2 }}>
              <EventParticipantsStatistics registrations={registrationsNotOnWait} />
            </Box>
          </>
        )}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mb: 1 }}>
          <Button endIcon={<CopyIcon />} fullWidth onClick={copyEmails} variant='outlined'>
            Kopier eposter
          </Button>
          <EventMessageSender eventId={eventId} />
          <EventFileSender eventId={eventId} />
        </Stack>
        <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
          <Typography variant='h3'>Påmeldte ({registrationsNotOnWait.length})</Typography>
          <FormControlLabel
            control={<Checkbox checked={showOnlyNotAttended} onChange={(e) => setShowOnlyNotAttended(e.target.checked)} sx={{ my: -0.75 }} />}
            label='Ikke ankommet'
            labelPlacement='start'
          />
        </Stack>
        <Participants onlyNotAttended={showOnlyNotAttended} registrations={registrationsNotOnWait} />
        <Typography variant='h3'>Venteliste ({registrationsOnWaitlist.length})</Typography>
        <Participants onWaitlist registrations={registrationsOnWaitlist} />
      </div>
    </>
  );
};

export default EventParticipants;
