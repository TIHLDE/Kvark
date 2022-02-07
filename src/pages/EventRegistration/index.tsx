import QRIcon from '@mui/icons-material/QrCodeScannerRounded';
import NameIcon from '@mui/icons-material/TextFieldsRounded';
import { Checkbox, FormControlLabel, LinearProgress, List, TextField, Theme, Typography, useMediaQuery } from '@mui/material';
import { ChangeEvent, lazy, Suspense, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Registration } from 'types';

import { useEventById, useEventRegistrations, useUpdateEventRegistration } from 'hooks/Event';
import { useSnackbar } from 'hooks/Snackbar';
import { useDebounce } from 'hooks/Utils';

import Http404 from 'pages/Http404';

import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import Tabs from 'components/layout/Tabs';
import { PrimaryTopBox } from 'components/layout/TopBox';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import Page from 'components/navigation/Page';

const QrReader = lazy(() => import('react-qr-reader'));

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
    <Paper sx={{ py: 0.5, px: 2, mb: 1, display: 'flex' }}>
      <Typography sx={{ fontWeight: 'bold', fontSize: '17px', width: '100%', margin: 'auto' }}>
        {`${user.user_info.first_name} ${user.user_info.last_name}`}
      </Typography>
      <FormControlLabel control={<Checkbox checked={checkedState} onChange={onCheck} />} label={!mdDown ? 'Ankommet' : ''} labelPlacement='start' />
    </Paper>
  );
};

const EventRegistration = () => {
  const { id } = useParams();
  const { data: event, isError } = useEventById(Number(id));
  const [previousScanned, setPreviousScanned] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } = useEventRegistrations(Number(id), { is_on_wait: false, search: debouncedSearch });
  const updateRegistration = useUpdateEventRegistration(Number(id));
  const showSnackbar = useSnackbar();
  const registrationsTab = { value: 'registrations', label: 'Navn', icon: NameIcon };
  const qrTab = { value: 'qr', label: 'QR-kode', icon: QRIcon };
  const tabs = [registrationsTab, qrTab];
  const [tab, setTab] = useState(registrationsTab.value);
  const registrations = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  const handleQrScan = (userId: string | null) => {
    if (!updateRegistration.isLoading && userId && userId !== previousScanned) {
      updateAttendedStatus(userId, true);
      setPreviousScanned(userId);
    }
  };

  const handleQrError = () => showSnackbar('En ukjent feil har oppstått, sjekk at vi har tilgang til å bruke kameraet', 'warning');

  const updateAttendedStatus = async (userId: string, attendedStatus: boolean) =>
    updateRegistration.mutateAsync(
      { registration: { has_attended: attendedStatus }, userId: userId },
      {
        onSuccess: (registration) =>
          showSnackbar(
            attendedStatus
              ? `${registration.user_info.first_name} ${registration.user_info.last_name} er registrert ankommet!`
              : `Vi har fjernet ankommet-statusen til ${registration.user_info.first_name} ${registration.user_info.last_name}`,
            attendedStatus ? 'success' : 'info',
          ),
        onError: (error) => showSnackbar(error.detail, 'error'),
      },
    );

  const isiOSDevice = useMemo(
    () =>
      ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document),
    [],
  );

  if (isError || (event && !event.sign_up)) {
    return <Http404 />;
  }

  return (
    <Page banner={<PrimaryTopBox />} options={{ title: `${event?.title || 'Laster arrangement...'} - Registrering` }}>
      <Paper sx={{ maxWidth: (theme) => theme.breakpoints.values.md, margin: 'auto', position: 'relative', left: 0, right: 0, top: -60 }}>
        {(updateRegistration.isLoading || isFetching || isLoading) && (
          <LinearProgress sx={{ position: 'absolute', top: 0, left: (theme) => theme.spacing(1), right: (theme) => theme.spacing(1) }} />
        )}
        <Typography align='center' variant='h2'>
          {event?.title || ''}
        </Typography>
        <Tabs selected={tab} setSelected={setTab} tabs={tabs} />
        {tab === registrationsTab.value && (
          <>
            <TextField fullWidth label='Søk' margin='normal' onChange={(e) => setSearch(e.target.value)} type='Søk' variant='outlined' />
            {!isLoading && !registrations.length && (
              <NotFoundIndicator header={search ? `Ingen påmeldte med navn som inneholder "${search}"` : 'Ingen påmeldte'} />
            )}
            <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
              <List dense disablePadding>
                {registrations.map((registration) => (
                  <ParticipantCard key={registration.registration_id} updateAttendedStatus={updateAttendedStatus} user={registration} />
                ))}
              </List>
            </Pagination>
          </>
        )}
        {tab === qrTab.value && (
          <>
            <Suspense fallback={null}>
              <QrReader onError={handleQrError} onScan={handleQrScan} resolution={800} showViewFinder={true} style={{ width: '100%' }} />
            </Suspense>
            {!isiOSDevice && <Typography sx={{ fontStyle: 'italic', mt: 2 }}>QR-scanning på iOS støttes kun i Safari</Typography>}
          </>
        )}
      </Paper>
    </Page>
  );
};

export default EventRegistration;
