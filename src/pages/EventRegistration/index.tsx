import QRIcon from '@mui/icons-material/QrCodeScannerRounded';
import NameIcon from '@mui/icons-material/TextFieldsRounded';
import { Box, Checkbox, FormControlLabel, LinearProgress, List, TextField, Theme, Typography, useMediaQuery } from '@mui/material';
import QrScanner from 'qr-scanner';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Registration } from 'types';

import { useEventById, useEventRegistrations, useUpdateEventRegistration } from 'hooks/Event';
import { useSnackbar } from 'hooks/Snackbar';
import { useDebounce } from 'hooks/Utils';

import Http404 from 'pages/Http404';

import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import Tabs from 'components/layout/Tabs';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import { AlertOnce } from 'components/miscellaneous/UserInformation';

type QrScanProps = {
  onScan: (userId: string) => Promise<Registration>;
};

const QrScan = ({ onScan }: QrScanProps) => {
  const [scanned, setScanned] = useState<string | undefined>(undefined);
  const val = useDebounce(scanned, 500);
  const [previousScanned, setPreviousScanned] = useState<string | undefined>(undefined);
  const videoTag = useRef<HTMLVideoElement>();
  const qrScanner = useRef<QrScanner | null>(null);

  const onDecode = (result: QrScanner.ScanResult) => setScanned(result.data);

  useEffect(() => {
    if (!val || val === previousScanned) {
      return;
    }
    setPreviousScanned(val);
    onScan(val);
  }, [val, previousScanned]);

  useEffect(() => {
    if (videoTag.current && qrScanner.current === null) {
      qrScanner.current = new QrScanner(videoTag.current, onDecode, {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      });
      qrScanner.current.start();
    }
    return () => {
      qrScanner.current?.destroy();
    };
  }, []);

  return (
    <Box
      component='video'
      muted
      ref={videoTag}
      sx={{
        background: ({ palette }) => palette.background.default,
        objectFit: 'cover',
        aspectRatio: '1',
        width: '100%',
        // Fallback-height if aspect-ratio isn't supported
        '@supports not (aspect-ratio: 1)': { height: 400 },
      }}
    />
  );
};

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
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } = useEventRegistrations(Number(id), { is_on_wait: false, search: debouncedSearch });
  const updateRegistration = useUpdateEventRegistration(Number(id));
  const showSnackbar = useSnackbar();
  const registrationsTab = { value: 'registrations', label: 'Navn', icon: NameIcon };
  const qrTab = { value: 'qr', label: 'QR-SKANNER', icon: QRIcon };
  const tabs = [registrationsTab, qrTab];
  const [tab, setTab] = useState(registrationsTab.value);
  const registrations = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

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

  if (isError || (event && !event.sign_up)) {
    return <Http404 />;
  }

  return (
    <div className='max-w-4xl px-2 w-full mx-auto mt-40'>
      <Paper sx={{ maxWidth: (theme) => theme.breakpoints.values.md, margin: 'auto', position: 'relative', left: 0, right: 0, top: -60 }}>
        {(updateRegistration.isLoading || isFetching || isLoading) && (
          <LinearProgress color='warning' sx={{ position: 'absolute', top: 0, left: (theme) => theme.spacing(1), right: (theme) => theme.spacing(1) }} />
        )}
        <Typography align='center' component='h1' variant='h2'>
          {event?.title || 'Laster arrangement...'}
        </Typography>
        <Tabs selected={tab} setSelected={setTab} tabs={tabs} />
        {tab === registrationsTab.value && (
          <>
            <AlertOnce cookieKey='EventRegistrationQrScan' severity='info' sx={{ mt: 1 }} variant='outlined'>
              Prøv gjerne ut QR-skanneren! Den er blitt forbedret og skal nå fungere raskt slik at innslipp går raskere.
            </AlertOnce>
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
        {tab === qrTab.value && <QrScan onScan={async (userId) => updateAttendedStatus(userId, true)} />}
      </Paper>
    </div>
  );
};

export default EventRegistration;
