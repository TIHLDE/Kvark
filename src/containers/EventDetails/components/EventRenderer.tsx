import { useEffect, useState } from 'react';
import { Event, User, Registration } from 'types/Types';
import { Groups } from 'types/Enums';
import URLS from 'URLS';
import { parseISO } from 'date-fns';
import { formatDate } from 'utils';
import QRCode from 'qrcode.react';
import { Link } from 'react-router-dom';

// Services
import { useMisc } from 'api/hooks/Misc';
import { useEvent } from 'api/hooks/Event';
import { useUser, HavePermission } from 'api/hooks/User';
import { useSnackbar } from 'api/hooks/Snackbar';

// Material UI Components
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
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
import DetailContent from 'components/miscellaneous/DetailContent';

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

export type EventRendererProps = {
  data: Event;
  preview?: boolean;
};

enum Views {
  Info,
  Apply,
}

const EventRenderer = ({ data, preview = false }: EventRendererProps) => {
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
  const startDate = parseISO(data.start_date);
  const endDate = parseISO(data.end_date);
  const startRegistrationDate = parseISO(data.start_registration_at);
  const endRegistrationDate = parseISO(data.end_registration_at);
  const signOffDeadlineDate = parseISO(data.sign_off_deadline);
  const now = new Date();

  useEffect(() => {
    let subscribed = true;
    if (!preview) {
      getUserData()
        .then((user) => {
          !subscribed || setUser(user);
          if (user) {
            getRegistration(data.id, user.user_id)
              .then((registration) => !subscribed || setRegistration(registration))
              .catch(() => !subscribed || setRegistration(null));
          }
        })
        .catch(() => !subscribed || setUser(null));
    }
    return () => {
      subscribed = false;
    };
  }, [data.id, getUserData, getRegistration, preview]);

  const signOff = () => {
    setSignOffDialogOpen(false);
    if (user) {
      deleteRegistration(data.id, user.user_id, registration)
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
    if (preview || !data.sign_up) {
      return null;
    } else if (data.closed) {
      return (
        <Paper className={classes.details} noPadding>
          <Typography align='center' className={classes.redText} variant='subtitle1'>
            Dette arrangementet er stengt. Det er derfor ikke mulig å melde seg av eller på.
          </Typography>
        </Paper>
      );
    } else if (!user) {
      if (endRegistrationDate > now) {
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
      } else {
        return null;
      }
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
    } else if (startRegistrationDate > now) {
      return (
        <Button className={classes.applyButton} color='primary' disabled fullWidth variant='contained'>
          Påmelding har ikke startet
        </Button>
      );
    } else if (endRegistrationDate < now) {
      return null;
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
      return null;
    }
    return (
      <HavePermission groups={[Groups.HS, Groups.INDEX, Groups.NOK, Groups.PROMO]}>
        <Button className={classes.applyButton} color='primary' component={Link} fullWidth to={`${URLS.eventAdmin}${data.id}/`} variant='outlined'>
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
      <AspectRatioImg alt={data.image_alt || data.title} imgClassName={classes.image} src={data.image} />
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
              <DetailContent info={data.location} title='Sted: ' />
            </Paper>
            {data.sign_up && (
              <>
                <Paper className={classes.details} noPadding>
                  <DetailContent info={`${data.list_count}/${data.limit}`} title='Påmeldte:' />
                  <DetailContent info={String(data.waiting_list_count)} title='Venteliste:' />
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
                {Boolean(data.registration_priorities.length) && data.registration_priorities.length !== 14 && (
                  <Paper className={classes.details} noPadding>
                    <EventPriorities priorities={data.registration_priorities} title='Prioritert:' />
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
        <Paper className={classes.content} shadow={view === Views.Apply && !registration}>
          <Typography className={classes.title} variant='h1'>
            {data.title}
          </Typography>
          <Collapse in={view === Views.Info || Boolean(registration)}>
            <MarkdownRenderer value={data.description} />
          </Collapse>
          <Collapse in={view === Views.Apply && !registration} mountOnEnter>
            {user && <EventRegistration event={data} setRegistration={setRegistration} user={user} />}
          </Collapse>
        </Paper>
      </div>
    </>
  );
};

export default EventRenderer;
