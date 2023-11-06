import CopyIcon from '@mui/icons-material/FileCopyOutlined';
import { Alert, AlertTitle, Box, Button, Checkbox, Divider, FormControlLabel, LinearProgress, List, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Event } from 'types';

import { useEventById, useEventRegistrations } from 'hooks/Event';
import { useSnackbar } from 'hooks/Snackbar';

import EventGiftCardSender from 'pages/EventAdministration/components/EventGiftCardSender';
import EventMessageSender from 'pages/EventAdministration/components/EventMessageSender';
import EventStatistics from 'pages/EventAdministration/components/EventStatistics';
import Participant from 'pages/EventAdministration/components/Participant';

import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';

import EventUserRegistrator from './EventUserRegistrator';

type RegistrationsProps = {
  onWait?: boolean;
  eventId: Event['id'];
};

type RegistrationsCopyDetails = {
  names: boolean;
  emails: boolean;
};

const Registrations = ({ onWait = false, eventId }: RegistrationsProps) => {
  const [showOnlyNotAttended, setShowOnlyNotAttended] = useState(false);
  const { data, hasNextPage, isFetching, isLoading, fetchNextPage } = useEventRegistrations(eventId, { is_on_wait: onWait });
  const { register, handleSubmit } = useForm({
    defaultValues: { names: false, emails: false },
  });

  const registrations = useMemo(
    () =>
      data
        ? data.pages
            .map((page) => page.results)
            .flat()
            .filter((registration) => !showOnlyNotAttended || !registration.has_attended)
        : [],
    [data, showOnlyNotAttended],
  );
  const showSnackbar = useSnackbar();

  const getRegistrationDetails = ({ names, emails }: RegistrationsCopyDetails) => {
    if (!names && !emails) {
      return '';
    }
    return registrations
      .map((registration) => {
        const data: string[] = [];
        names && data.push(`${registration.user_info.first_name} ${registration.user_info.last_name}`);
        emails && data.push(registration.user_info.email);
        return data.join(',');
      })
      .join('\n');
  };

  const copyRegistrationDetails = ({ names, emails }: RegistrationsCopyDetails) => {
    const tempInput = document.createElement('textarea');
    tempInput.value = getRegistrationDetails({ names: names, emails: emails });
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showSnackbar('Detaljene ble kopiert til utklippstavlen', 'info');
  };

  return (
    <>
      <Stack direction='row' sx={{ mt: 2, justifyContent: 'space-between' }}>
        <Typography variant='h3'>{`${onWait ? 'Venteliste' : 'Påmeldte'} (${data?.pages[0]?.count || 0})`}</Typography>
        {!onWait && (
          <FormControlLabel
            control={<Checkbox checked={showOnlyNotAttended} onChange={(e) => setShowOnlyNotAttended(e.target.checked)} sx={{ my: -0.75 }} />}
            label='Ikke ankommet'
            labelPlacement='start'
          />
        )}
      </Stack>
      {isLoading ? null : registrations.length ? (
        <>
          <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
            <Typography variant='caption'>Detaljer</Typography>
            {!onWait && <Typography variant='caption'>Ankommet</Typography>}
          </Stack>
          <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
            <List dense disablePadding>
              {registrations.map((registration) => (
                <Participant eventId={eventId} key={registration.registration_id} registration={registration} />
              ))}
            </List>
            {!onWait && !hasNextPage && (
              <>
                <Alert color='warning' sx={{ mb: 1 }} variant='outlined'>
                  <AlertTitle>Sende epost?</AlertTitle>
                  Bruk &quot;Send epost til deltagere&quot; hvis du kan. Det er lurt at alle eposter kommer fra samme epost og ser like ut for at brukerne skal
                  stole på eposter som mottas. Våre eposter havner heller ikke i søppelpost. Kopier alle eposter kun om du virkelig er nødt til å sende epost
                  selv.
                </Alert>
                <Paper>
                  <form onSubmit={handleSubmit((data) => copyRegistrationDetails(data))}>
                    <Box margin={1}>
                      <Typography>Kopier detaljer om deltagerene på arrangementet til utklippstavlen. Huk av for detaljene du ønsker å kopiere. </Typography>
                      <FormControlLabel control={<Checkbox {...register('names')} />} label='Navn' />
                      <FormControlLabel control={<Checkbox {...register('emails')} />} label='Epost' />
                    </Box>
                    <Button endIcon={<CopyIcon />} fullWidth type='submit' variant='outlined'>
                      Kopier detaljer om deltagere
                    </Button>
                  </form>
                </Paper>
              </>
            )}
          </Pagination>
        </>
      ) : (
        <Typography>{onWait ? 'Ingen på ventelisten' : 'Ingen påmeldte'}</Typography>
      )}
    </>
  );
};

export type EventParticipantsProps = {
  eventId: Event['id'];
};

const EventParticipants = ({ eventId }: EventParticipantsProps) => {
  const { data, isLoading } = useEventById(eventId);

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <>
      <Typography variant='h2'>{data?.title || 'Laster...'}</Typography>
      <Divider sx={{ my: 1 }} />
      <div>
        <Typography variant='h3'>Statistikk</Typography>
        <Box sx={{ pt: 1, pb: 2 }}>
          <EventStatistics eventId={eventId} />
        </Box>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mb: 1 }}>
          <EventMessageSender eventId={eventId} />
          <EventGiftCardSender eventId={eventId} />
          <EventUserRegistrator eventId={eventId} />
        </Stack>
        <Registrations eventId={eventId} />
        <Registrations eventId={eventId} onWait />
      </div>
    </>
  );
};

export default EventParticipants;
