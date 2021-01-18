import { useEffect, useMemo, useState } from 'react';
import { Event, User, Registration } from 'types/Types';
import { Groups } from 'types/Enums';
import URLS from 'URLS';
import { parseISO, formatDistanceStrict } from 'date-fns';
import nb from 'date-fns/locale/nb';
import { formatDate } from 'utils';
import QRCode from 'qrcode.react';
import { Link } from 'react-router-dom';

// Services
import { useMisc } from 'api/hooks/Misc';
import { useEvent } from 'api/hooks/Event';
import { useUser, HavePermission } from 'api/hooks/User';
import { useSnackbar } from 'api/hooks/Snackbar';
import { useInterval } from 'api/hooks/Utils';

// Material UI Components
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Hidden from '@material-ui/core/Hidden';

// Project Components
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import AspectRatioImg from 'components/miscellaneous/AspectRatioImg';
import EventPriorities from 'containers/EventDetails/components/EventPriorities';
import EventRegistration from 'containers/EventDetails/components/EventRegistration';
import Paper from 'components/layout/Paper';
import Dialog from 'components/layout/Dialog';

const useStyles = makeStyles((theme: Theme) => ({
  image: {
    borderRadius: theme.shape.borderRadius,
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
    width: 325,
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
    color: theme.palette.text.secondary,
  },
  detailInfo: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  waitlistContainer: {
    margin: `${theme.spacing(1)}px auto`,
    textAlign: 'center',
    padding: theme.spacing(1),
  },
  redText: {
    color: theme.palette.error.main,
  },
  content: {
    height: 'fit-content',
    overflowX: 'auto',
    [theme.breakpoints.down('sm')]: {
      order: 1,
    },
  },
  title: {
    color: theme.palette.text.primary,
    padding: theme.spacing(0, 3, 3, 0),
    fontSize: '2.6rem',
  },
  applyButton: {
    height: 50,
    fontWeight: 'bold',
    maxWidth: 325,
    [theme.breakpoints.down('md')]: {
      maxWidth: 'none',
    },
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
  const startDate = useMemo(() => parseISO(event.start_date), [event.start_date]);
  const endDate = useMemo(() => parseISO(event.end_date), [event.end_date]);
  const startRegistrationDate = useMemo(() => parseISO(event.start_registration_at), [event.start_registration_at]);
  const endRegistrationDate = useMemo(() => parseISO(event.end_registration_at), [event.end_registration_at]);
  const signOffDeadlineDate = useMemo(() => parseISO(event.sign_off_deadline), [event.sign_off_deadline]);
  const [timeNow, setTimeNow] = useState(new Date());

  useEffect(() => {
    if (startRegistrationDate > new Date()) {
      const id = setTimeout(() => setTimeNow(new Date()), startRegistrationDate.getTime() - new Date().getTime());
      return () => {
        clearTimeout(id);
      };
    }
  }, [startRegistrationDate]);

  useEffect(() => {
    let subscribed = true;
    if (!preview) {
      getUserData()
        .then((user) => {
          !subscribed || setUser(user);
          if (user) {
            getRegistration(event.id, user.user_id)
              .then((registration) => !subscribed || setRegistration(registration))
              .catch(() => !subscribed || setRegistration(null));
          }
        })
        .catch(() => !subscribed || setUser(null));
    }
    return () => {
      subscribed = false;
    };
  }, [event.id, getUserData, getRegistration, preview]);

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

  const CountdownButton = () => {
    const [message, setMessage] = useState('Påmelding åpner om ' + formatDistanceStrict(startRegistrationDate, new Date(), { locale: nb }));
    useInterval(() => setMessage('Påmelding åpner om ' + formatDistanceStrict(startRegistrationDate, new Date(), { locale: nb })), 1000);
    return (
      <Button className={classes.applyButton} color='primary' disabled fullWidth variant='contained'>
        {message}
      </Button>
    );
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
    } else if (startRegistrationDate > timeNow) {
      return <CountdownButton />;
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
                bgColor={theme.palette.background.paper}
                className={classes.qrcode}
                fgColor={theme.palette.text.primary}
                size={1000}
                value={user.user_id}
              />
            </>
          )}
          {signOffDeadlineDate > timeNow ? (
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
    } else if (endRegistrationDate < timeNow) {
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

  const AdminButton = () => {
    if (preview) {
      return <></>;
    }
    return (
      <HavePermission groups={[Groups.HS, Groups.INDEX, Groups.NOK, Groups.PROMO]}>
        <Button className={classes.applyButton} color='primary' component={Link} fullWidth to={`${URLS.eventAdmin}${event.id}/`} variant='outlined'>
          Endre arrangement
        </Button>
      </HavePermission>
    );
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
      <AspectRatioImg alt={event.image_alt || event.title} imgClassName={classes.image} src={event.image} />
      <div className={classes.rootGrid}>
        <div>
          <div className={classes.infoGrid}>
            <Hidden mdDown>
              <ApplyButton />
              <AdminButton />
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
                  {registration && timeNow < signOffDeadlineDate ? (
                    <DetailContent info={formatDate(signOffDeadlineDate)} title='Avmeldingsfrist:' />
                  ) : (
                    <>
                      {startRegistrationDate > timeNow && <DetailContent info={formatDate(startRegistrationDate)} title='Påmeldingsstart:' />}
                      {startRegistrationDate < timeNow && timeNow < endRegistrationDate && (
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
              </>
            )}
            <Hidden lgUp>
              <AdminButton />
              <ApplyButton />
            </Hidden>
          </div>
        </div>
        <Paper className={classes.content}>
          <Typography className={classes.title} variant='h1'>
            {event.title}
          </Typography>
          <Collapse in={view === Views.Info || Boolean(registration)}>
            <MarkdownRenderer value={event.description} />
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
