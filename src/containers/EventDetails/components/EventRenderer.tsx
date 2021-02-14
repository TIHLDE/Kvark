import { useState } from 'react';
import { Event } from 'types/Types';
import { Groups } from 'types/Enums';
import URLS from 'URLS';
import { parseISO, isPast, isFuture } from 'date-fns';
import { formatDate } from 'utils';
import QRCode from 'qrcode.react';
import { Link } from 'react-router-dom';

// Services
import { useMisc } from 'api/hooks/Misc';
import { useEventRegistration, useDeleteEventRegistration } from 'api/hooks/Event';
import { useUser, HavePermission } from 'api/hooks/User';
import { useSnackbar } from 'api/hooks/Snackbar';

// Material UI Components
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Hidden from '@material-ui/core/Hidden';
import Skeleton from '@material-ui/lab/Skeleton';
import Alert from '@material-ui/lab/Alert';

// Project Components
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import AspectRatioImg, { AspectRatioLoading } from 'components/miscellaneous/AspectRatioImg';
import EventPriorities from 'containers/EventDetails/components/EventPriorities';
import EventRegistration from 'containers/EventDetails/components/EventRegistration';
import Paper from 'components/layout/Paper';
import Dialog from 'components/layout/Dialog';
import DetailContent, { DetailContentLoading } from 'components/miscellaneous/DetailContent';

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
  alert: {
    marginBottom: theme.spacing(1),
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
    fontSize: '2.4rem',
    wordWrap: 'break-word',
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
  skeleton: {
    maxWidth: '100%',
    borderRadius: theme.shape.borderRadius,
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
  const { data: user } = useUser();
  const { data: registration } = useEventRegistration(data.id, preview || !user ? '' : user.user_id);
  const deleteRegistration = useDeleteEventRegistration(data.id);
  const { setLogInRedirectURL } = useMisc();
  const showSnackbar = useSnackbar();
  const theme = useTheme();
  const [view, setView] = useState<Views>(Views.Info);
  const [signOffDialogOpen, setSignOffDialogOpen] = useState(false);
  const startDate = parseISO(data.start_date);
  const endDate = parseISO(data.end_date);
  const startRegistrationDate = parseISO(data.start_registration_at);
  const endRegistrationDate = parseISO(data.end_registration_at);
  const signOffDeadlineDate = parseISO(data.sign_off_deadline);

  const signOff = async () => {
    setSignOffDialogOpen(false);
    if (user) {
      deleteRegistration.mutate(user.user_id, {
        onSuccess: (data) => {
          showSnackbar(data.detail, 'success');
          setView(Views.Info);
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      });
    }
  };

  const ApplyButton = () => {
    if (preview || !data.sign_up) {
      return null;
    } else if (data.closed) {
      return (
        <Alert className={classes.details} severity='warning' variant='outlined'>
          Dette arrangementet er stengt. Det er derfor ikke mulig å melde seg av eller på.
        </Alert>
      );
    } else if (!user) {
      if (isFuture(endRegistrationDate)) {
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
        <>
          {registration.is_on_wait ? (
            <Alert className={classes.details} severity='info' variant='outlined'>
              Du står på ventelisten, vi gir deg beskjed hvis du får plass
            </Alert>
          ) : (
            <Paper className={classes.details} noPadding>
              <Alert className={classes.alert} severity='success' variant='outlined'>
                Du har plass på arrangementet! Bruk QR-koden for å komme raskere inn.
              </Alert>
              <QRCode
                bgColor={theme.palette.background.paper}
                className={classes.qrcode}
                fgColor={theme.palette.text.primary}
                size={1000}
                value={user.user_id}
              />
            </Paper>
          )}
          {(isFuture(signOffDeadlineDate) || registration.is_on_wait) && isFuture(startDate) ? (
            <Button className={classes.applyButton} fullWidth onClick={() => setSignOffDialogOpen(true)} variant='outlined'>
              Meld deg av
            </Button>
          ) : (
            isFuture(startDate) && (
              <Alert className={classes.details} severity='info' variant='outlined'>
                Avmeldingsfristen er passert
              </Alert>
            )
          )}
        </>
      );
    } else if (isFuture(startRegistrationDate)) {
      return (
        <Button className={classes.applyButton} color='primary' disabled fullWidth variant='contained'>
          Påmelding har ikke startet
        </Button>
      );
    } else if (isPast(endRegistrationDate)) {
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
                  {registration && isFuture(signOffDeadlineDate) ? (
                    <DetailContent info={formatDate(signOffDeadlineDate)} title='Avmeldingsfrist:' />
                  ) : (
                    <>
                      {isFuture(startRegistrationDate) && <DetailContent info={formatDate(startRegistrationDate)} title='Påmeldingsstart:' />}
                      {isPast(startRegistrationDate) && isFuture(endRegistrationDate) && (
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
        <Paper className={classes.content}>
          <Typography className={classes.title} gutterBottom variant='h1'>
            {data.title}
          </Typography>
          <Collapse in={view === Views.Info || Boolean(registration) || preview}>
            <MarkdownRenderer value={data.description} />
          </Collapse>
          <Collapse in={view === Views.Apply && !registration && !preview} mountOnEnter>
            {user && <EventRegistration event={data} user={user} />}
          </Collapse>
        </Paper>
      </div>
    </>
  );
};

export default EventRenderer;

export const EventRendererLoading = () => {
  const classes = useStyles();
  return (
    <>
      <AspectRatioLoading imgClassName={classes.image} />
      <div className={classes.rootGrid}>
        <div>
          <div className={classes.infoGrid}>
            <Paper className={classes.details} noPadding>
              <DetailContentLoading />
              <DetailContentLoading />
              <DetailContentLoading />
            </Paper>
            <Paper className={classes.details} noPadding>
              <DetailContentLoading />
              <DetailContentLoading />
            </Paper>
          </div>
        </div>
        <Paper className={classes.content}>
          <Skeleton className={classes.skeleton} height={80} width='60%' />
          <Skeleton className={classes.skeleton} height={40} width={250} />
          <Skeleton className={classes.skeleton} height={40} width='80%' />
          <Skeleton className={classes.skeleton} height={40} width='85%' />
          <Skeleton className={classes.skeleton} height={40} width='75%' />
          <Skeleton className={classes.skeleton} height={40} width='90%' />
        </Paper>
      </div>
    </>
  );
};
