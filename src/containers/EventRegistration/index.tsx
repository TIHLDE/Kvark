import { ChangeEvent, useMemo, useState } from 'react';
import QrReader from 'react-qr-reader';
import { useParams } from 'react-router-dom';
import { Registration } from 'types/Types';
import { useEventById, useEventRegistrations, useUpdateEventRegistration } from 'api/hooks/Event';
import { useSnackbar } from 'api/hooks/Snackbar';

// Material UI Components
import { makeStyles } from '@material-ui/styles';
import { Theme, Typography, TextField, LinearProgress, FormControlLabel, Checkbox, useMediaQuery } from '@material-ui/core';

// Icons
import NameIcon from '@material-ui/icons/TextFieldsRounded';
import QRIcon from '@material-ui/icons/CameraAltRounded';

// Project Components
import Http404 from 'containers/Http404';
import Page from 'components/navigation/Page';
import Paper from 'components/layout/Paper';
import Tabs from 'components/layout/Tabs';

const useStyles = makeStyles((theme: Theme) => ({
  top: {
    height: 220,
    background: theme.palette.colors.gradient.main.top,
  },
  paper: {
    maxWidth: theme.breakpoints.values.md,
    margin: 'auto',
    position: 'relative',
    left: 0,
    right: 0,
    top: '-60px',
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  snackbar: {
    bottom: theme.spacing(2),
    position: 'fixed',
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.common.white,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('lg')]: {
      whiteSpace: 'nowrap',
    },
  },
  snackbar_success: {
    backgroundColor: theme.palette.success.dark,
  },
  snackbar_error: {
    backgroundColor: theme.palette.error.main,
  },
  cardContent: {
    padding: theme.spacing(1, 2),
    display: 'flex',
    marginBottom: 2,
  },
  cardUserName: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cardText: {
    fontWeight: 'bold',
    fontSize: '17px',
    color: theme.palette.text.secondary,
  },
  cardButtonLabel: {
    marginRight: theme.spacing(-1),
  },
  cardButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.secondary,
  },
  cardActionArea: {
    display: 'flex',
  },
  lightText: {
    color: theme.palette.text.secondary,
  },
  title: {
    color: theme.palette.text.primary,
  },
}));

export type ParticipantCardProps = {
  user: Registration;
  markAttended: (username: string, attendedStatus: boolean) => void;
};

const ParticipantCard = ({ user, markAttended }: ParticipantCardProps) => {
  const classes = useStyles();
  const [checkedState, setCheckedState] = useState(user.has_attended);
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const handleCheck = async (e: ChangeEvent<HTMLInputElement>) => {
    setCheckedState(e.target.checked);
    markAttended(user.user_info.user_id, e.target.checked);
  };
  return (
    <Paper className={classes.cardContent}>
      <div className={classes.cardUserName}>
        <Typography className={classes.cardText}>{user.user_info.first_name + ' ' + user.user_info.last_name}</Typography>
      </div>
      <div className={classes.cardActionArea}>
        <div className={classes.cardButtonContainer}>
          <FormControlLabel
            className={classes.cardButtonLabel}
            control={<Checkbox checked={checkedState} onChange={handleCheck} />}
            label={!mdDown && 'Ankommet'}
          />
        </div>
      </div>
    </Paper>
  );
};

function EventRegistration() {
  const classes = useStyles();
  const { id } = useParams();
  const { data, isError } = useEventById(Number(id));
  const { data: participants } = useEventRegistrations(Number(id));
  const updateRegistration = useUpdateEventRegistration(Number(id));
  const showSnackbar = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const participantsTab = { value: 'participants', label: 'Navn', icon: NameIcon };
  const qrTab = { value: 'qr', label: 'QR-kode', icon: QRIcon };
  const tabs = [participantsTab, qrTab];
  const [tab, setTab] = useState(participantsTab.value);
  const participantsIn = useMemo(() => (participants || []).filter((user) => !user.is_on_wait), [participants]);

  const handleScan = (username: string | null) => {
    if (!isLoading && username) {
      const participant = participants?.find((participant) => participant.user_info.user_id === username);
      if (!participant) {
        showSnackbar('Personen er ikke påmeldt dette arrangementet', 'error');
        return;
      }
      if (participant.has_attended) {
        showSnackbar('Personen har allerede ankommet dette arrangementet', 'info');
        return;
      }
      markAttended(username, true);
    }
  };

  const handleError = () => {
    setIsLoading(false);
    showSnackbar('En ukjent feil har oppstått, sjekk at vi har tilgang til å bruke kameraet', 'warning');
  };

  const markAttended = async (username: string, attendedStatus: boolean) => {
    setIsLoading(true);
    await updateRegistration.mutate(
      { registration: { has_attended: attendedStatus }, userId: username },
      {
        onSuccess: () => {
          showSnackbar(attendedStatus ? 'Deltageren er registrert ankommet!' : 'Vi har fjernet ankommet-statusen', 'success');
        },
        onError: (error) => {
          showSnackbar(error.detail, 'error');
        },
      },
    );
    setIsLoading(false);
  };

  const Participants = () => (
    <>
      {participantsIn?.length ? (
        search.trim() !== '' ? (
          participantsIn
            .filter((user) => (user.user_info.first_name + ' ' + user.user_info.last_name).toLowerCase().includes(search.toLowerCase()))
            .map((user, key) => <ParticipantCard key={key} markAttended={markAttended} user={user} />)
        ) : (
          participantsIn.map((user, key) => <ParticipantCard key={key} markAttended={markAttended} user={user} />)
        )
      ) : (
        <Typography className={classes.lightText}>Ingen påmeldte.</Typography>
      )}
    </>
  );

  if (isError) {
    return <Http404 />;
  }

  return (
    <Page banner={<div className={classes.top}></div>} options={{ title: `${data?.title || ''} - Registrering` }}>
      <Paper className={classes.paper}>
        {isLoading && <LinearProgress className={classes.progress} />}
        <Typography align='center' className={classes.title} variant='h2'>
          {data?.title || ''}
        </Typography>
        <Tabs selected={tab} setSelected={setTab} tabs={tabs} />
        {tab === participantsTab.value && (
          <>
            <TextField fullWidth label='Søk' margin='normal' onChange={(e) => setSearch(e.target.value)} type='Søk' variant='outlined' />
            <Participants />
          </>
        )}
        {tab === qrTab.value && (
          <>
            <QrReader onError={handleError} onScan={handleScan} showViewFinder={true} style={{ width: '100%' }} />
            <br />
            <Typography variant='body1'>QR-scanning på iOS støttes kun i Safari</Typography>
          </>
        )}
      </Paper>
    </Page>
  );
}

export default EventRegistration;
