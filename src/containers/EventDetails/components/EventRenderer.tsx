import { useState } from 'react';
import classnames from 'classnames';
import { Event } from 'types/Types';
import { PermissionApp } from 'types/Enums';
import URLS from 'URLS';
import { parseISO, isPast, isFuture } from 'date-fns';
import { formatDate, getICSFromEvent } from 'utils';
import { Link } from 'react-router-dom';

// Services
import { useSetRedirectUrl } from 'api/hooks/Misc';
import { useEventRegistration, useDeleteEventRegistration } from 'api/hooks/Event';
import { useUser, HavePermission } from 'api/hooks/User';
import { useSnackbar } from 'api/hooks/Snackbar';

// Material UI Components
import { makeStyles } from '@material-ui/styles';
import { Typography, Button, Collapse, Skeleton, Alert, useMediaQuery, Theme } from '@material-ui/core';

// Icons
import CalendarIcon from '@material-ui/icons/EventRounded';

// Project Components
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import AspectRatioImg, { AspectRatioLoading } from 'components/miscellaneous/AspectRatioImg';
import EventPriorities from 'containers/EventDetails/components/EventPriorities';
import EventRegistration from 'containers/EventDetails/components/EventRegistration';
import Paper from 'components/layout/Paper';
import Dialog from 'components/layout/Dialog';
import DetailContent, { DetailContentLoading } from 'components/miscellaneous/DetailContent';
import QRCode from 'components/miscellaneous/QRCode';
import ShareButton from 'components/miscellaneous/ShareButton';
import { useGoogleAnalytics } from 'api/hooks/Utils';

const useStyles = makeStyles((theme) => ({
  image: {
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
  rootGrid: {
    display: 'grid',
    gridTemplateColumns: '325px 1fr',
    gridTemplateRows: 'auto',
    gridGap: theme.spacing(1),
    marginTop: theme.spacing(2),
    position: 'relative',
    alignItems: 'self-start',
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: '100%',
      justifyContent: 'center',
      gridGap: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
  },
  infoGrid: {
    display: 'grid',
    gridGap: theme.spacing(1),
    alignItems: 'self-start',
  },
  details: {
    padding: theme.spacing(1, 2),
  },
  detailsHeader: {
    fontSize: '1.5rem',
  },
  info: {
    [theme.breakpoints.down('lg')]: {
      gridRow: '1 / 2',
    },
  },
  alert: {
    marginBottom: theme.spacing(1),
  },
  content: {
    height: 'fit-content',
    overflowX: 'auto',
    [theme.breakpoints.down('md')]: {
      order: 1,
    },
    marginBottom: theme.spacing(1),
  },
  title: {
    color: theme.palette.text.primary,
    fontSize: '2.4rem',
    wordWrap: 'break-word',
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
  const { event } = useGoogleAnalytics();
  const classes = useStyles();
  const { data: user } = useUser();
  const { data: registration } = useEventRegistration(data.id, preview || !user ? '' : user.user_id);
  const deleteRegistration = useDeleteEventRegistration(data.id);
  const setLogInRedirectURL = useSetRedirectUrl();
  const showSnackbar = useSnackbar();
  const [view, setView] = useState<Views>(Views.Info);
  const [signOffDialogOpen, setSignOffDialogOpen] = useState(false);
  const startDate = parseISO(data.start_date);
  const endDate = parseISO(data.end_date);
  const startRegistrationDate = parseISO(data.start_registration_at);
  const endRegistrationDate = parseISO(data.end_registration_at);
  const signOffDeadlineDate = parseISO(data.sign_off_deadline);
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  const signOff = async () => {
    setSignOffDialogOpen(false);
    if (user) {
      deleteRegistration.mutate(user.user_id, {
        onSuccess: (response) => {
          showSnackbar(response.detail, 'success');
          setView(Views.Info);
          event('unregistered', 'event-registration', `Unregistered for event: ${data.title}`);
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
          <Button component={Link} fullWidth onClick={() => setLogInRedirectURL(window.location.pathname)} to={URLS.login} variant='contained'>
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
                Du har plass på arrangementet!
              </Alert>
              <QRCode background='paper' value={user.user_id} />
            </Paper>
          )}
          {(isFuture(signOffDeadlineDate) || registration.is_on_wait) && isFuture(startDate) ? (
            <Button fullWidth onClick={() => setSignOffDialogOpen(true)} variant='outlined'>
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
        <Button disabled fullWidth variant='contained'>
          Påmelding har ikke startet
        </Button>
      );
    } else if (isPast(endRegistrationDate)) {
      return null;
    } else if (view === Views.Apply) {
      return (
        <Button fullWidth onClick={() => setView(Views.Info)} variant='outlined'>
          Se beskrivelse
        </Button>
      );
    } else {
      return (
        <Button fullWidth onClick={() => setView(Views.Apply)} variant='contained'>
          Meld deg på
        </Button>
      );
    }
  };

  const Info = () => (
    <>
      <Paper className={classes.details} noPadding>
        <Typography className={classes.detailsHeader} variant='h2'>
          Detaljer
        </Typography>
        <DetailContent info={formatDate(startDate)} title='Fra: ' />
        <DetailContent info={formatDate(endDate)} title='Til: ' />
        <DetailContent info={data.location} title='Sted: ' />
      </Paper>
      {data.sign_up && (
        <>
          <Paper className={classes.details} noPadding>
            <Typography className={classes.detailsHeader} variant='h2'>
              Påmelding
            </Typography>
            <DetailContent info={`${data.list_count}/${data.limit}`} title='Påmeldte:' />
            <DetailContent info={String(data.waiting_list_count)} title='Venteliste:' />
            {registration && isFuture(signOffDeadlineDate) ? (
              <DetailContent info={formatDate(signOffDeadlineDate)} title='Avmeldingsfrist:' />
            ) : (
              <>
                {isFuture(startRegistrationDate) && <DetailContent info={formatDate(startRegistrationDate)} title='Start:' />}
                {isPast(startRegistrationDate) && isFuture(endRegistrationDate) && <DetailContent info={formatDate(endRegistrationDate)} title='Slutt:' />}
              </>
            )}
          </Paper>
          {Boolean(data.registration_priorities.length) && data.registration_priorities.length !== 14 && (
            <Paper className={classes.details} noPadding>
              <Typography className={classes.detailsHeader} variant='h2'>
                Prioritert
              </Typography>
              <EventPriorities priorities={data.registration_priorities} />
            </Paper>
          )}
        </>
      )}
      <ApplyButton />
    </>
  );

  const addToCalendarAnalytics = () => event('add-to-calendar', 'event', `Event: ${data.title}`);

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
      <div className={classes.rootGrid}>
        <div className={classes.infoGrid}>
          {!lgDown && <Info />}
          <ShareButton color='inherit' shareId={data.id} shareType='event' title={data.title} />
          <Button component='a' endIcon={<CalendarIcon />} href={getICSFromEvent(data)} onClick={addToCalendarAnalytics} variant='outlined'>
            Legg til i kalender
          </Button>
          {!preview && (
            <HavePermission apps={[PermissionApp.EVENT]}>
              <Button component={Link} fullWidth to={`${URLS.eventAdmin}${data.id}/`} variant='outlined'>
                Endre arrangement
              </Button>
            </HavePermission>
          )}
        </div>
        <div className={classnames(classes.infoGrid, classes.info)}>
          <AspectRatioImg alt={data.image_alt || data.title} imgClassName={classes.image} src={data.image} />
          {lgDown && <Info />}
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
      </div>
    </>
  );
};

export default EventRenderer;

export const EventRendererLoading = () => {
  const classes = useStyles();

  return (
    <div className={classes.rootGrid}>
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
      <div className={classnames(classes.infoGrid, classes.info)}>
        <AspectRatioLoading imgClassName={classes.image} />
        <Paper className={classes.content}>
          <Skeleton height={80} width='60%' />
          <Skeleton height={40} width={250} />
          <Skeleton height={40} width='80%' />
          <Skeleton height={40} width='85%' />
          <Skeleton height={40} width='75%' />
          <Skeleton height={40} width='90%' />
        </Paper>
      </div>
    </div>
  );
};
