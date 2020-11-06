import React, { useEffect, useState } from 'react';
import { Event, User, Registration } from 'types/Types';
import URLS from 'URLS';
import { parseISO } from 'date-fns';
import { formatDate } from 'utils';
import QRCode from 'qrcode.react';
import { Link } from 'react-router-dom';

// Services
import { useMisc } from 'api/hooks/Misc';
import { useEvent } from 'api/hooks/Event';
import { useUser } from 'api/hooks/User';
import { useSnackbar } from 'api/hooks/Snackbar';

// Material UI Components
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Hidden from '@material-ui/core/Hidden';

// Project Components
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import EventPriorities from 'containers/EventDetails/components/EventPriorities';
import EventRegistration from 'containers/EventDetails/components/EventRegistration';
import Paper from 'components/layout/Paper';
import Dialog from 'components/layout/Dialog';
import TIHLDELOGO from 'assets/img/TihldeBackground.jpg';

const useStyles = makeStyles((theme: Theme) => ({
  image: {
    width: '100%',
    height: 'auto',
    maxHeight: 350,
    objectFit: 'cover',
    backgroundColor: theme.palette.colors.constant.white,
    borderRadius: theme.shape.borderRadius,
    display: 'block',
    boxSizing: 'border-box',
  },
  rootGrid: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gridTemplateRows: 'auto',
    gridGap: theme.spacing(2),
    marginTop: theme.spacing(2),

    position: 'relative',
    overflow: 'hidden',

    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '100%',
      justifyContent: 'center',
      gridGap: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
  },
  infoGrid: {
    display: 'grid',
    gridGap: theme.spacing(1),
  },
  details: {
    padding: theme.spacing(1, 2),
    width: 300,
    [theme.breakpoints.down('md')]: {
      order: 0,
      maxWidth: 'none',
      width: '100%',
    },
  },
  detail: {
    width: 'auto',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'row',
    },
  },
  detailTitle: {
    marginRight: theme.spacing(0.5),
    fontWeight: 'bold',
    color: theme.palette.colors.text.light,
  },
  detailInfo: {
    textAlign: 'center',
    color: theme.palette.colors.text.light,
  },
  waitlistContainer: {
    margin: `${theme.spacing(1)}px auto`,
    textAlign: 'center',
    padding: theme.spacing(1),
  },
  redText: {
    color: theme.palette.colors.status.red,
  },
  content: {
    height: 'fit-content',
    [theme.breakpoints.down('sm')]: {
      order: 1,
    },
  },
  title: {
    color: theme.palette.colors.text.main,
    padding: theme.spacing(0, 3, 3, 0),
  },
  description: {
    color: theme.palette.colors.text.light,
  },
  applyButton: {
    height: 50,
    fontWeight: 'bold',
  },
  qrcode: {
    padding: theme.spacing(4, 3),
    display: 'block',
    margin: '0 auto',
    height: 'auto !important',
    width: '100% !important',
    maxHeight: 350,
    objectFit: 'contain',
  },
}));

type DetailContentProps = {
  title: string;
  info: string;
};

const DetailContent = ({ title, info }: DetailContentProps) => {
  const classes = useStyles();
  return (
    <Grid alignItems='center' className={classes.detail} container justify='flex-start' wrap='nowrap'>
      <Typography className={classes.detailTitle} variant='subtitle1'>
        {title}
      </Typography>
      <Typography className={classes.detailInfo} variant='subtitle1'>
        {info}
      </Typography>
    </Grid>
  );
};

export type EventRendererProps = {
  event: Event;
  preview?: boolean;
};

enum Views {
  Info,
  Apply,
}

const EventRenderer = ({ event, preview = false }: EventRendererProps) => {
  const classes = useStyles();
  const { getRegistration, deleteRegistration } = useEvent();
  const { getUserData } = useUser();
  const { setLogInRedirectURL } = useMisc();
  const showSnackbar = useSnackbar();
  const theme = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [view, setView] = useState<Views>(Views.Info);
  const [signOffDialogOpen, setSignOffDialogOpen] = useState(false);
  const startDate = parseISO(event.start_date);
  const endDate = parseISO(event.end_date);
  const startRegistrationDate = parseISO(event.start_registration_at);
  const endRegistrationDate = parseISO(event.end_registration_at);
  const signOffDeadlineDate = parseISO(event.sign_off_deadline);
  const now = new Date();

  useEffect(() => {
    getUserData()
      .then((user) => {
        setUser(user);
        if (user) {
          getRegistration(event.id, user.user_id)
            .then((registration) => setRegistration(registration))
            .catch(() => setRegistration(null));
        }
      })
      .catch(() => setUser(null));
  }, [event.id, getUserData, getRegistration]);

  const signOff = () => {
    setSignOffDialogOpen(false);
    if (user) {
      deleteRegistration(event.id, user.user_id, registration)
        .then((data) => {
          showSnackbar(data.detail, 'success');
          setRegistration(null);
          setView(Views.Info);
        })
        .catch((error) => {
          showSnackbar(error.detail, 'error');
        });
    }
  };

  const ApplyButton = () => {
    if (preview || !event.sign_up) {
      return <></>;
    } else if (event.closed) {
      return (
        <Paper className={classes.details} noPadding>
          <Typography align='center' className={classes.redText} variant='subtitle1'>
            Dette arrangementet er stengt. Det er derfor ikke mulig å melde seg av eller på.
          </Typography>
        </Paper>
      );
    } else if (startRegistrationDate > now) {
      return (
        <Button className={classes.applyButton} color='primary' disabled fullWidth variant='contained'>
          Påmelding har ikke startet
        </Button>
      );
    } else if (!user) {
      return (
        <Button
          className={classes.applyButton}
          color='primary'
          component={Link}
          fullWidth
          onClick={() => setLogInRedirectURL(window.location.pathname)}
          to={URLS.login}
          variant='contained'>
          Logg inn for å melde deg på
        </Button>
      );
    } else if (registration) {
      return (
        <Paper className={classes.details} noPadding>
          {registration.is_on_wait ? (
            <Typography align='center' className={classes.redText} variant='subtitle1'>
              Du står på ventelisten, vi gir deg beskjed hvis du får plass
            </Typography>
          ) : (
            <>
              <Typography align='center' variant='subtitle1'>
                Du har plass på arrangementet! Bruk QR-koden for å komme raskere inn.
              </Typography>
              <QRCode
                bgColor={theme.palette.colors.background.light}
                className={classes.qrcode}
                fgColor={theme.palette.colors.text.main}
                size={1000}
                value={user.user_id}
              />
            </>
          )}
          {signOffDeadlineDate > now ? (
            <Button className={classes.applyButton} fullWidth onClick={() => setSignOffDialogOpen(true)} variant='outlined'>
              Meld deg av
            </Button>
          ) : (
            <Typography align='center' className={classes.redText} variant='subtitle1'>
              Avmeldingsfristen er passert
            </Typography>
          )}
        </Paper>
      );
    } else if (endRegistrationDate < now) {
      return <></>;
    } else if (view === Views.Apply) {
      return (
        <Button className={classes.applyButton} color='primary' fullWidth onClick={() => setView(Views.Info)} variant='outlined'>
          Se beskrivelse
        </Button>
      );
    } else {
      return (
        <Button className={classes.applyButton} color='primary' fullWidth onClick={() => setView(Views.Apply)} variant='contained'>
          Meld deg på
        </Button>
      );
    }
  };

  return (
    <>
      <Dialog
        closeText='Avbryt'
        confirmText='Ja, jeg er sikker'
        contentText='Om du melder deg på igjen vil du havne på bunnen av en eventuell venteliste.'
        onClose={() => setSignOffDialogOpen(false)}
        onConfirm={signOff}
        open={signOffDialogOpen}
        titleText='Er du sikker?'
      />
      <img alt={event.image_alt || event.title} className={classes.image} src={event.image || TIHLDELOGO} />
      <div className={classes.rootGrid}>
        <div>
          <div className={classes.infoGrid}>
            <Hidden mdDown>
              <ApplyButton />
            </Hidden>
            <Paper className={classes.details} noPadding>
              <DetailContent info={formatDate(startDate)} title='Fra: ' />
              <DetailContent info={formatDate(endDate)} title='Til: ' />
              <DetailContent info={event.location} title='Sted: ' />
            </Paper>
            {event.sign_up && (
              <>
                <Paper className={classes.details} noPadding>
                  <DetailContent info={`${event.list_count}/${event.limit}`} title='Påmeldte:' />
                  <DetailContent info={String(event.waiting_list_count)} title='Venteliste:' />
                  {registration && now < signOffDeadlineDate ? (
                    <DetailContent info={formatDate(signOffDeadlineDate)} title='Avmeldingsfrist:' />
                  ) : (
                    <>
                      {startRegistrationDate > now && <DetailContent info={formatDate(startRegistrationDate)} title='Påmeldingsstart:' />}
                      {startRegistrationDate < now && now < endRegistrationDate && (
                        <DetailContent info={formatDate(endRegistrationDate)} title='Påmeldingsslutt:' />
                      )}
                    </>
                  )}
                </Paper>
                {Boolean(event.registration_priorities.length) && event.registration_priorities.length !== 14 && (
                  <Paper className={classes.details} noPadding>
                    <EventPriorities priorities={event.registration_priorities} title='Prioritert:' />
                  </Paper>
                )}
                <Hidden lgUp>
                  <ApplyButton />
                </Hidden>
              </>
            )}
          </div>
        </div>
        <Paper className={classes.content}>
          <Typography className={classes.title} variant='h2'>
            <strong>{event.title}</strong>
          </Typography>
          <Collapse in={view === Views.Info || Boolean(registration)}>
            <MarkdownRenderer className={classes.description} value={event.description} />
          </Collapse>
          <Collapse in={view === Views.Apply && !registration} mountOnEnter unmountOnExit>
            {user && <EventRegistration event={event} setRegistration={setRegistration} user={user} />}
          </Collapse>
        </Paper>
      </div>
    </>
  );
};

export default EventRenderer;
