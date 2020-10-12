/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import QrReader from 'react-qr-reader';
import Helmet from 'react-helmet';
import { useParams, useHistory } from 'react-router-dom';
import { UserRegistration } from 'types/Types';

// Service and action imports
import EventService from 'api/services/EventService';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Slide from '@material-ui/core/Slide';
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
  user: UserRegistration;
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

type ParamTypes = {
  id: string;
};

function EventRegistration() {
  const classes = useStyles();
  const { id } = useParams<ParamTypes>();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [eventName, setEventName] = useState('');
  const [search, setSearch] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [tab, setTab] = useState(0);
  const [participants, setParticipants] = useState<Array<UserRegistration> | undefined>(undefined);
  const [error, setError] = useState(false);

  const handleScan = (username: string | null) => {
    if (!isLoading && username) {
      const participant = participants?.find((participant) => participant.user_info.user_id === username);
      if (participant && !participant.has_attended) {
        markAttended(username, true);
      }
    }
  };

  const handleError = () => {
    setIsLoading(false);
    setSnackbarMessage('En ukjent feil har oppstått, sjekk at vi har tilgang til å bruke kameraet');
    setSnackbarOpen(true);
    setError(true);
  };

  useEffect(() => {
    EventService.getEventById(id).then((event) => {
      if (!event) {
        history.replace('/');
      } else {
        setIsLoading(false);
        setEventName(event.title);
      }
    });
    EventService.getEventParticipants(id).then((participants: Array<UserRegistration>) => {
      const participantsIn = participants.filter((user) => !user.is_on_wait);
      setIsLoading(false);
      setParticipants(participantsIn);
    });
  }, [id, history]);

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
    EventService.putAttended(id, { has_attended: attendedStatus }, username).then((data) => {
      if (data && data.detail === 'Registration successfully updated.') {
        setSnackbarMessage(attendedStatus ? 'Deltageren er registrert ankommet!' : 'Vi har fjernet ankommet-statusen');
        setError(!attendedStatus);
      } else {
        setSnackbarMessage('Ugyldig brukernavn.');
        setError(true);
        // Rollback
        setParticipants(oldParitcipantsList);
      }
      setSnackbarOpen(true);
      setIsLoading(false);
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setIsLoading(false);
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
      <Snackbar onClose={handleSnackbarClose} open={snackbarOpen} TransitionComponent={Slide}>
        <SnackbarContent className={classNames(classes.snackbar, error ? classes.snackbar_error : classes.snackbar_success)} message={snackbarMessage} />
      </Snackbar>
    </Navigation>
  );
}

export default EventRegistration;
