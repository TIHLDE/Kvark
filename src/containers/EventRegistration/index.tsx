import React, { useEffect, useState } from 'react';
import QrReader from 'react-qr-reader';
import Helmet from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { Registration } from 'types/Types';

// Service and action imports
import { useEvent } from 'api/hooks/Event';
import { useSnackbar } from 'api/hooks/Snackbar';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Hidden from '@material-ui/core/Hidden';

// Icons
import TextFields from '@material-ui/icons/TextFields';
import PhotoCameraOutlinedIcon from '@material-ui/icons/PhotoCameraOutlined';

// Project Components
import Navigation from 'components/navigation/Navigation';
import Paper from 'components/layout/Paper';

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
    color: theme.palette.colors.constant.white,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('lg')]: {
      whiteSpace: 'nowrap',
    },
  },
  snackbar_success: {
    backgroundColor: theme.palette.colors.status.green,
  },
  snackbar_error: {
    backgroundColor: theme.palette.colors.status.red,
  },
  cardContent: {
    padding: theme.spacing(1, 2),
    display: 'flex',
    boxShadow: '0px 2px 4px ' + theme.palette.colors.border.main + '88',
    borderRadius: theme.shape.borderRadius,
    marginBottom: 3,
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
    color: theme.palette.colors.text.light,
  },
  cardButtonLabel: {
    marginRight: -10,
  },
  cardButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.colors.text.light,
  },
  cardActionArea: {
    display: 'flex',
  },
  lightText: {
    color: theme.palette.colors.text.light,
  },
  title: {
    color: theme.palette.colors.text.main,
  },
}));

export type ParticipantCardProps = {
  user: Registration;
  markAttended: (username: string, attendedStatus: boolean) => void;
};

const ParticipantCard = ({ user, markAttended }: ParticipantCardProps) => {
  const classes = useStyles();
  const [checkedState, setCheckedState] = useState(user.has_attended);
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedState(e.target.checked);
    markAttended(user.user_info.user_id, e.target.checked);
  };
  return (
    <div className={classes.cardContent}>
      <div className={classes.cardUserName}>
        <Typography className={classes.cardText}>{user.user_info.first_name + ' ' + user.user_info.last_name}</Typography>
      </div>
      <div className={classes.cardActionArea}>
        <div className={classes.cardButtonContainer}>
          <FormControlLabel
            className={classes.cardButtonLabel}
            control={<Checkbox checked={checkedState} onChange={handleCheck} />}
            label={<Hidden smDown>Ankommet</Hidden>}
          />
        </div>
      </div>
    </div>
  );
};

function EventRegistration() {
  const classes = useStyles();
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById, getEventRegistrations, updateAttendedStatus } = useEvent();
  const showSnackbar = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [eventName, setEventName] = useState('');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);
  const [participants, setParticipants] = useState<Array<Registration> | undefined>(undefined);

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

  useEffect(() => {
    getEventById(Number(id)).then((event) => {
      if (!event) {
        navigate('/');
      } else {
        setIsLoading(false);
        setEventName(event.title);
      }
    });
    getEventRegistrations(Number(id)).then((participants) => {
      const participantsIn = participants.filter((user) => !user.is_on_wait);
      setIsLoading(false);
      setParticipants(participantsIn);
    });
  }, [id, navigate, getEventById, getEventRegistrations]);

  const markAttended = (username: string, attendedStatus: boolean) => {
    setIsLoading(true);
    const oldParitcipantsList = participants;
    const newParticipantsList = participants?.map((participant) => {
      if (participant.user_info.user_id === username) {
        return { ...participant, has_attended: attendedStatus };
      } else {
        return participant;
      }
    });
    setParticipants(newParticipantsList);
    updateAttendedStatus(Number(id), attendedStatus, username)
      .then(() => {
        showSnackbar(attendedStatus ? 'Deltageren er registrert ankommet!' : 'Vi har fjernet ankommet-statusen', 'success');
      })
      .catch((error) => {
        setParticipants(oldParitcipantsList);
        showSnackbar(error.detail, 'error');
      })
      .finally(() => setIsLoading(false));
  };

  const Participants = () => (
    <>
      {participants?.length ? (
        search.trim() !== '' ? (
          participants
            .filter((user) => (user.user_info.first_name + ' ' + user.user_info.last_name).toLowerCase().includes(search.toLowerCase()))
            .map((user, key) => <ParticipantCard key={key} markAttended={markAttended} user={user} />)
        ) : (
          participants.map((user, key) => <ParticipantCard key={key} markAttended={markAttended} user={user} />)
        )
      ) : (
        <Typography className={classes.lightText}>Ingen påmeldte.</Typography>
      )}
    </>
  );

  return (
    <Navigation banner={<div className={classes.top}></div>} fancyNavbar>
      <Helmet>
        <title>{eventName} - Registrering - TIHLDE</title>
      </Helmet>
      <Paper className={classes.paper}>
        {isLoading && <LinearProgress className={classes.progress} />}
        <Typography align='center' className={classes.title} variant='h5'>
          {eventName}
        </Typography>
        <Tabs centered className={classes.lightText} onChange={(e, newTab) => setTab(newTab)} scrollButtons='on' value={tab} variant='fullWidth'>
          <Tab icon={<TextFields />} id='0' label='Navn' />
          <Tab icon={<PhotoCameraOutlinedIcon />} id='1' label='QR-kode' />
        </Tabs>
        {tab === 0 && (
          <>
            <TextField fullWidth label='Søk' margin='normal' onChange={(e) => setSearch(e.target.value)} type='Søk' variant='outlined' />
            <Participants />
          </>
        )}
        {tab === 1 && (
          <>
            <QrReader onError={handleError} onScan={handleScan} showViewFinder={true} style={{ width: '100%' }} />
            <br />
            <Typography variant='body1'>QR-scanning på iOS støttes kun i Safari</Typography>
          </>
        )}
      </Paper>
    </Navigation>
  );
}

export default EventRegistration;
