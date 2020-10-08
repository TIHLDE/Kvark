import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getUserStudyShort, getDay, getMonth } from '../../../utils';

// Text
import Text from '../../../text/EventText';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// Project Components
import MarkdownRenderer from '../../../components/miscellaneous/MarkdownRenderer';
import EventDialog from './EventDialog';
import Paper from '../../../components/layout/Paper';

// Urls
import URLS from '../../../URLS';

// Services
import { useMisc } from '../../../api/hooks/Misc';

const styles = (theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gridTemplateRows: 'auto',
    gridGap: '20px',
    marginTop: 20,

    position: 'relative',
    overflow: 'hidden',

    '@media only screen and (max-width: 800px)': {
      gridTemplateColumns: '100%',
      justifyContent: 'center',
      gridGap: '10px',
      marginTop: 10,
    },
  },
  wrapper: {
    padding: 20,
    '@media only screen and (max-width: 600px)': {
      padding: 10,
    },
  },
  image: {
    width: '100%',
    height: 'auto',
    maxHeight: 350,
    objectFit: 'cover',
    backgroundColor: theme.palette.colors.border.main,
    borderRadius: theme.shape.borderRadius,
    display: 'block',
    boxSizing: 'border-box',
  },
  title: {
    color: theme.palette.colors.text.main,
    padding: 26,
    paddingLeft: 0,
    paddingTop: 0,
  },
  content: {
    height: 'fit-content',
    '@media only screen and (max-width: 800px)': {
      order: 1,
    },
  },
  details: {
    padding: '10px 20px',
    marginBottom: 20,
    maxWidth: 280,
    '@media only screen and (max-width: 800px)': {
      order: 0,
      marginBottom: 10,
      maxWidth: 'none',
    },
  },
  info: {
    width: 'auto',
    flexDirection: 'column',

    '@media only screen and (max-width: 800px)': {
      flexDirection: 'row',
    },
  },
  ml: {
    marginRight: 5,
    fontWeight: 'bold',
    color: theme.palette.colors.text.light,
  },
  ml2: {
    textAlign: 'center',
    color: theme.palette.colors.text.light,
  },
  mt: { height: 50, fontWeight: 'bold' },
  waitlistContainer: {
    margin: '10px auto',
    textAlign: 'center',
    padding: '5px',
  },
  redText: {
    color: theme.palette.colors.status.red,
  },
  description: {
    color: theme.palette.colors.text.light,
  },
  prioritiesContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    '@media only screen and (max-width: 800px)': {
      justifyContent: 'flex-start',
    },
  },
  priority: {
    padding: '0 3px',
    border: theme.palette.sizes.border.width + ' solid ' + theme.palette.colors.border.main,
    borderRadius: theme.shape.borderRadius,
    margin: 3,
    color: theme.palette.colors.text.lighter,
  },
  applyText: {
    overflow: 'visible',
    textOverflow: 'ellipsis',
    width: '16rem',
  },
});

const getDate = (date) => {
  return getDay(date.day()) + ' ' + date.date() + ' ' + getMonth(date.month()) + ' - kl. ' + date.format('HH:mm');
};

const DetailContent = withStyles(styles)((props) => (
  <Grid alignItems='center' className={props.classes.info} container justify='flex-start' wrap='nowrap'>
    <Typography className={props.classes.ml} variant='subtitle1'>
      {props.title}
    </Typography>
    <Typography className={props.classes.ml2} variant='subtitle1'>
      {props.info}
    </Typography>
  </Grid>
));
DetailContent.propTypes = {
  title: PropTypes.string,
  info: PropTypes.string,
};

const removeStudyFromArray = (array, userStudy) => {
  while (array.some((item) => item.user_study === userStudy)) {
    const index = array.findIndex((item) => item.user_study === userStudy);
    array.splice(index, 1);
  }
  return array;
};

const PrioritiesContent = withStyles(styles)((props) => {
  let priorities = [...props.priorities];
  let Dataing = null;
  let DigFor = null;
  let DigSec = null;
  let DigSam = null;
  let Drift = null;
  if (
    priorities.some((item) => item.user_class === 1 && item.user_study === 1) &&
    priorities.some((item) => item.user_class === 2 && item.user_study === 1) &&
    priorities.some((item) => item.user_class === 3 && item.user_study === 1)
  ) {
    Dataing = (
      <Typography className={props.classes.priority} variant='subtitle1'>
        {getUserStudyShort(1)}
      </Typography>
    );
    priorities = removeStudyFromArray(priorities, 1);
  }
  if (
    priorities.some((item) => item.user_class === 1 && item.user_study === 2) &&
    priorities.some((item) => item.user_class === 2 && item.user_study === 2) &&
    priorities.some((item) => item.user_class === 3 && item.user_study === 2)
  ) {
    DigFor = (
      <Typography className={props.classes.priority} variant='subtitle1'>
        {getUserStudyShort(2)}
      </Typography>
    );
    priorities = removeStudyFromArray(priorities, 2);
  }
  if (
    priorities.some((item) => item.user_class === 1 && item.user_study === 3) &&
    priorities.some((item) => item.user_class === 2 && item.user_study === 3) &&
    priorities.some((item) => item.user_class === 3 && item.user_study === 3)
  ) {
    DigSec = (
      <Typography className={props.classes.priority} variant='subtitle1'>
        {getUserStudyShort(3)}
      </Typography>
    );
    priorities = removeStudyFromArray(priorities, 3);
  }
  if (priorities.some((item) => item.user_class === 4 && item.user_study === 4) && priorities.some((item) => item.user_class === 5 && item.user_study === 4)) {
    DigSam = (
      <Typography className={props.classes.priority} variant='subtitle1'>
        {getUserStudyShort(4)}
      </Typography>
    );
    priorities = removeStudyFromArray(priorities, 4);
  }
  if (
    priorities.some((item) => item.user_class === 1 && item.user_study === 5) &&
    priorities.some((item) => item.user_class === 2 && item.user_study === 5) &&
    priorities.some((item) => item.user_class === 3 && item.user_study === 5)
  ) {
    Drift = (
      <Typography className={props.classes.priority} variant='subtitle1'>
        {getUserStudyShort(5)}
      </Typography>
    );
    priorities = removeStudyFromArray(priorities, 5);
  }

  return (
    <Grid alignItems='center' className={props.classes.info} container justify='flex-start' wrap='nowrap'>
      <Typography className={props.classes.ml} variant='subtitle1'>
        {props.title}
      </Typography>
      <div className={props.classes.prioritiesContainer}>
        {Dataing}
        {DigFor}
        {DigSec}
        {DigSam}
        {Drift}
        {priorities.map(function (priority, index) {
          return (
            <Typography className={props.classes.priority} key={index} variant='subtitle1'>
              {priority.user_class + '. ' + getUserStudyShort(priority.user_study)}
            </Typography>
          );
        })}
      </div>
    </Grid>
  );
});
PrioritiesContent.propTypes = {
  title: PropTypes.string,
  priorities: PropTypes.array,
};

const EventRenderer = (props) => {
  const {
    classes,
    eventData,
    userData,
    userEvent,
    userEventLoaded,
    applyToEvent,
    isLoadingUserData,
    isLoadingEvent,
    isApplying,
    message,
    applySuccess,
    clearMessage,
    preview,
  } = props;
  const { setLogInRedirectURL } = useMisc();
  const [modalShow, setModalShown] = useState(false);
  const description = eventData.description || '';
  const startDate = moment(eventData.start_date, ['YYYY-MM-DD HH:mm'], 'nb');
  const endDate = moment(eventData.end_date, ['YYYY-MM-DD HH:mm'], 'nb');
  const signUpStart = moment(eventData.start_registration_at, ['YYYY-MM-DD HH:mm'], 'nb');
  const signUpEnd = moment(eventData.end_registration_at, ['YYYY-MM-DD HH:mm'], 'nb');
  const signOffDeadline = moment(eventData.sign_off_deadline, ['YYYY-MM-DD HH:mm'], 'nb');
  const today = moment(new Date(), ['YYYY-MM-DD HH:mm'], 'nb');

  const openEventModal = () => {
    if (!preview) {
      if (userData) {
        setModalShown(true);
      } else {
        setLogInRedirectURL(props.history.location.pathname);
        props.history.replace(URLS.login);
      }
    }
  };

  const closeEventModal = () => {
    setModalShown(false);
    clearMessage();
  };

  const limit = eventData.limit;
  const attending = eventData.list_count;
  const onWait = eventData.waiting_list_count;

  // Buttons for applying and unapplying to events.
  let applyButton = null;
  if (eventData.closed) {
    applyButton = (
      <Typography align='center' className={classes.applyText} color='error'>
        {Text.closed}
      </Typography>
    );
  } else if (!eventData.sign_up) {
    applyButton = <Typography align='center' className={classes.applyText}></Typography>;
  } else if (eventData.sign_up && today > signUpEnd) {
    applyButton = (
      <Typography align='center' className={classes.applyText}>
        {Text.signUpEnded}
      </Typography>
    );
  } else if (eventData.sign_up && today < signUpStart) {
    applyButton = (
      <Typography align='center' className={classes.applyText}>
        {Text.inactive}
      </Typography>
    );
  } else if (eventData.sign_up && userEvent && today > signOffDeadline) {
    applyButton = (
      <React.Fragment>
        <Button className={classes.mt} color='secondary' disabled fullWidth variant='contained'>
          {Text.signOff}
        </Button>
        <Typography align='center' color='error'>
          Avmeldingsfristen er passert
        </Typography>
      </React.Fragment>
    );
  } else if (!isLoadingUserData && !isLoadingEvent && userEventLoaded) {
    applyButton = (
      <Button className={classes.mt} color={userEvent ? 'secondary' : 'primary'} fullWidth onClick={openEventModal} variant='contained'>
        {userEvent ? Text.signOff : Text.signUp}
      </Button>
    );
  } else {
    applyButton = (
      <Button className={classes.mt} color={'secondary'} disabled={true} fullWidth onClick={openEventModal} variant='contained'>
        {Text.loading}
      </Button>
    );
  }

  return (
    <div className={classes.wrapper}>
      {modalShow === true && userData && (
        <EventDialog
          applySuccess={applySuccess}
          applyToEvent={applyToEvent}
          data={eventData}
          isApplying={isApplying}
          message={message}
          onClose={closeEventModal}
          status={modalShow}
          userData={userData}
          userEvent={userEvent}
        />
      )}
      {eventData.image && <img alt={eventData.image_alt} className={classes.image} src={eventData.image} />}
      <div className={classes.grid}>
        <div>
          <Paper className={classes.details} noPadding>
            <DetailContent info={getDate(moment(startDate, ['YYYY-MM-DD HH:mm'], 'nb'))} title='Fra: ' />
            <DetailContent info={getDate(moment(endDate, ['YYYY-MM-DD HH:mm'], 'nb'))} title='Til: ' />
            <DetailContent info={eventData.location} title='Sted: ' />
          </Paper>
          {eventData.sign_up && (
            <Paper className={classes.details} noPadding>
              <DetailContent info={attending + '/' + limit} title='Påmeldte:' />
              <DetailContent info={String(onWait)} title='Venteliste:' />
              {today <= signUpStart && !userEvent && <DetailContent info={getDate(moment(signUpStart, ['YYYY-MM-DD HH:mm'], 'nb'))} title='Påmeldingsstart:' />}
              {today > signUpStart && today < signUpEnd && !userEvent && (
                <DetailContent info={getDate(moment(signUpEnd, ['YYYY-MM-DD HH:mm'], 'nb'))} title='Påmeldingsslutt:' />
              )}
              {userEvent && <DetailContent info={getDate(moment(signOffDeadline, ['YYYY-MM-DD HH:mm'], 'nb'))} title='Avmeldingsfrist:' />}
            </Paper>
          )}
          {eventData.sign_up && eventData.registration_priorities && eventData.registration_priorities.length < 14 ? (
            <Paper className={classes.details} noPadding>
              <PrioritiesContent priorities={eventData.registration_priorities} title='Prioritert:' />
            </Paper>
          ) : (
            eventData.sign_up &&
            eventData.registration_priorities && (
              <Paper className={classes.details} noPadding>
                <Grid alignItems='center' className={props.classes.info} container justify='flex-start' wrap='nowrap'>
                  <Typography className={props.classes.ml} variant='subtitle1'>
                    Prioritert:
                  </Typography>
                  <Typography variant='subtitle1'>Alle</Typography>
                </Grid>
              </Paper>
            )
          )}
          {today <= startDate && applyButton}
          {userEvent && userEvent.is_on_wait && (
            <div className={classes.waitlistContainer}>
              <Typography className={classes.redText} variant='subtitle1'>
                Du er på ventelisten
              </Typography>
            </div>
          )}
        </div>
        <Paper className={classes.content}>
          <Typography className={classes.title} variant='h5'>
            <strong>{eventData.title}</strong>
          </Typography>
          <MarkdownRenderer className={classes.description} value={description} />
        </Paper>
      </div>
    </div>
  );
};

EventRenderer.propTypes = {
  classes: PropTypes.object,
  eventData: PropTypes.object.isRequired,
  userData: PropTypes.object,
  userEvent: PropTypes.object,
  userEventLoaded: PropTypes.bool,
  history: PropTypes.object,
  applyToEvent: PropTypes.func,
  isLoadingUserData: PropTypes.bool,
  isLoadingEvent: PropTypes.bool,
  isApplying: PropTypes.bool,
  message: PropTypes.string,
  applySuccess: PropTypes.bool,
  clearMessage: PropTypes.func,
  preview: PropTypes.bool,
};

export default withStyles(styles)(EventRenderer);
