import { ChangeEvent, useMemo, useState } from 'react';
import QrReader from 'react-qr-reader';
import { useParams } from 'react-router-dom';
import { Registration } from 'types/Types';
import { useEventById, useEventRegistrations, useUpdateEventRegistration } from 'hooks/Event';
import { useSnackbar } from 'hooks/Snackbar';

// Material UI Components
import { Theme, Stack, Typography, TextField, LinearProgress, FormControlLabel, Checkbox, useMediaQuery } from '@mui/material';

// Icons
import NameIcon from '@mui/icons-material/TextFieldsRounded';
import QRIcon from '@mui/icons-material/QrCodeScannerRounded';

// Project Components
import Http404 from 'containers/Http404';
import Page from 'components/navigation/Page';
import Paper from 'components/layout/Paper';
import Tabs from 'components/layout/Tabs';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import { PrimaryTopBox } from 'components/layout/TopBox';

export type ParticipantCardProps = {
  user: Registration;
  updateAttendedStatus: (username: string, attendedStatus: boolean) => void;
};

const ParticipantCard = ({ user, updateAttendedStatus }: ParticipantCardProps) => {
  const [checkedState, setCheckedState] = useState(user.has_attended);
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const onCheck = async (e: ChangeEvent<HTMLInputElement>) => {
    setCheckedState(e.target.checked);
    updateAttendedStatus(user.user_info.user_id, e.target.checked);
  };
  return (
    <Paper sx={{ padding: (theme) => theme.spacing(1, 2), display: 'flex' }}>
      <Typography sx={{ fontWeight: 'bold', fontSize: '17px', width: '100%', margin: 'auto' }}>
        {user.user_info.first_name + ' ' + user.user_info.last_name}
      </Typography>
      <FormControlLabel control={<Checkbox checked={checkedState} onChange={onCheck} />} label={!mdDown && 'Ankommet'} labelPlacement='start' />
    </Paper>
  );
};

const EventRegistration = () => {
  const { id } = useParams();
  const { data, isError } = useEventById(Number(id));
  const { data: registrations } = useEventRegistrations(Number(id));
  const updateRegistration = useUpdateEventRegistration(Number(id));
  const showSnackbar = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const registrationsTab = { value: 'registrations', label: 'Navn', icon: NameIcon };
  const qrTab = { value: 'qr', label: 'QR-kode', icon: QRIcon };
  const tabs = [registrationsTab, qrTab];
  const [tab, setTab] = useState(registrationsTab.value);
  const registrationsNotOnWait = useMemo(() => (registrations || []).filter((user) => !user.is_on_wait), [registrations]);

  const handleQrScan = (username: string | null) => {
    if (!isLoading && username) {
      const registration = registrations?.find((registration) => registration.user_info.user_id === username);
      if (!registration) {
        showSnackbar(`Personen er ikke påmeldt dette arrangementet`, 'error');
        return;
      }
      if (registration.has_attended) {
        showSnackbar(`${registration.user_info.first_name} ${registration.user_info.last_name} har allerede ankommet dette arrangementet`, 'warning');
        return;
      }
      updateAttendedStatus(username, true);
    }
  };

  const handleQrError = () => {
    setIsLoading(false);
    showSnackbar('En ukjent feil har oppstått, sjekk at vi har tilgang til å bruke kameraet', 'warning');
  };

  const updateAttendedStatus = async (username: string, attendedStatus: boolean) => {
    setIsLoading(true);
    return updateRegistration.mutateAsync(
      { registration: { has_attended: attendedStatus }, userId: username },
      {
        onSuccess: (registration) => {
          showSnackbar(
            attendedStatus
              ? `${registration.user_info.first_name} ${registration.user_info.last_name} er registrert ankommet!`
              : `Vi har fjernet ankommet-statusen til ${registration.user_info.first_name} ${registration.user_info.last_name}`,
            attendedStatus ? 'success' : 'info',
          );
        },
        onError: (error) => {
          showSnackbar(error.detail, 'error');
        },
        onSettled: () => {
          setTimeout(() => setIsLoading(false), tab === qrTab.value ? 2000 : 0);
        },
      },
    );
  };

  const Participants = () =>
    registrationsNotOnWait?.length ? (
      <Stack spacing={0.25}>
        {search.trim() !== ''
          ? registrationsNotOnWait
              .filter((user) => (user.user_info.first_name + ' ' + user.user_info.last_name).toLowerCase().includes(search.toLowerCase()))
              .map((user, key) => <ParticipantCard key={key} updateAttendedStatus={updateAttendedStatus} user={user} />)
          : registrationsNotOnWait.map((user, key) => <ParticipantCard key={key} updateAttendedStatus={updateAttendedStatus} user={user} />)}
      </Stack>
    ) : (
      <NotFoundIndicator header='Ingen påmeldte' subtitle='Ingen er påmeldt dette arrangementet' />
    );

  const isiOSDevice = useMemo(
    () =>
      ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document),
    [],
  );

  if (isError) {
    return <Http404 />;
  }

  return (
    <Page banner={<PrimaryTopBox />} options={{ title: `${data?.title || 'Laster arrangement...'} - Registrering` }}>
      <Paper
        sx={{
          maxWidth: (theme) => theme.breakpoints.values.md,
          margin: 'auto',
          position: 'relative',
          left: 0,
          right: 0,
          top: -60,
        }}>
        {isLoading && <LinearProgress sx={{ position: 'absolute', top: 0, left: (theme) => theme.spacing(1), right: (theme) => theme.spacing(1) }} />}
        <Typography align='center' variant='h2'>
          {data?.title || ''}
        </Typography>
        <Tabs selected={tab} setSelected={setTab} tabs={tabs} />
        {tab === registrationsTab.value && (
          <>
            <TextField fullWidth label='Søk' margin='normal' onChange={(e) => setSearch(e.target.value)} type='Søk' variant='outlined' />
            <Participants />
          </>
        )}
        {tab === qrTab.value && (
          <>
            <QrReader onError={handleQrError} onScan={handleQrScan} resolution={800} showViewFinder={true} style={{ width: '100%' }} />
            {isiOSDevice && (
              <>
                <br />
                <Typography sx={{ fontStyle: 'italic' }}>QR-scanning på iOS støttes kun i Safari</Typography>
              </>
            )}
          </>
        )}
      </Paper>
    </Page>
  );
};

export default EventRegistration;
