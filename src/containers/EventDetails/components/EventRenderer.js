import React, {useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import moment from 'moment';
import {getUserStudyShort, getDay, getMonth} from '../../../utils';

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
import MiscService from '../../../api/services/MiscService';

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
    backgroundColor: theme.colors.border.main,
    borderRadius: theme.sizes.border.radius,
    display: 'block',
    boxSizing: 'border-box',
  },
  title: {
    color: theme.colors.text.main,
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
    color: theme.colors.text.light,
  },
  ml2: {
    textAlign: 'center',
    color: theme.colors.text.light,
  },
  mt: {height: 50, fontWeight: 'bold'},
  waitlistContainer: {
    margin: '10px auto',
    textAlign: 'center',
    padding: '5px',
  },
  redText: {
    color: theme.colors.status.red,
  },
  description: {
    color: theme.colors.text.light,
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
    border: theme.sizes.border.width + ' solid ' + theme.colors.border.main,
    borderRadius: theme.sizes.border.radius,
    margin: 3,
    color: theme.colors.text.lighter,
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
  <Grid className={props.classes.info} container wrap='nowrap' alignItems='center' justify='flex-start'>
    <Typography className={props.classes.ml} variant='subtitle1'>{props.title}</Typography>
    <Typography className={props.classes.ml2} variant='subtitle1'>{props.info}</Typography>
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
  let Dataing = null; let DigFor = null; let DigInc = null; let DigSam = null; let Drift = null;
  if (priorities.some((item) => item.user_class === 1 && item.user_study === 1) && priorities.some((item) => item.user_class === 2 && item.user_study === 1) && priorities.some((item) => item.user_class === 3 && item.user_study === 1)) {
    Dataing = (<Typography className={props.classes.priority} variant='subtitle1'>{getUserStudyShort(1)}</Typography>); priorities = removeStudyFromArray(priorities, 1);
  }
  if (priorities.some((item) => item.user_class === 1 && item.user_study === 2) && priorities.some((item) => item.user_class === 2 && item.user_study === 2) && priorities.some((item) => item.user_class === 3 && item.user_study === 2)) {
    DigFor = (<Typography className={props.classes.priority} variant='subtitle1'>{getUserStudyShort(2)}</Typography>); priorities = removeStudyFromArray(priorities, 2);
  }
  if (priorities.some((item) => item.user_class === 1 && item.user_study === 3) && priorities.some((item) => item.user_class === 2 && item.user_study === 3) && priorities.some((item) => item.user_class === 3 && item.user_study === 3)) {
    DigInc = (<Typography className={props.classes.priority} variant='subtitle1'>{getUserStudyShort(3)}</Typography>); priorities = removeStudyFromArray(priorities, 3);
  }
  if (priorities.some((item) => item.user_class === 4 && item.user_study === 4) && priorities.some((item) => item.user_class === 5 && item.user_study === 4)) {
    DigSam = (<Typography className={props.classes.priority} variant='subtitle1'>{getUserStudyShort(4)}</Typography>); priorities = removeStudyFromArray(priorities, 4);
  }
  if (priorities.some((item) => item.user_class === 1 && item.user_study === 5) && priorities.some((item) => item.user_class === 2 && item.user_study === 5) && priorities.some((item) => item.user_class === 3 && item.user_study === 5)) {
    Drift = (<Typography className={props.classes.priority} variant='subtitle1'>{getUserStudyShort(5)}</Typography>); priorities = removeStudyFromArray(priorities, 5);
  }

  return (
    <Grid className={props.classes.info} container wrap='nowrap' alignItems='center' justify='flex-start'>
      <Typography className={props.classes.ml} variant='subtitle1'>{props.title}</Typography>
      <div className={props.classes.prioritiesContainer}>
        {Dataing}{DigFor}{DigInc}{DigSam}{Drift}
        {priorities.map(function (priority, index) {
          return (<Typography className={props.classes.priority} variant='subtitle1' key={index}>{priority.user_class + '. ' + getUserStudyShort(priority.user_study)}</Typography>);
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
        MiscService.setLogInRedirectURL(props.history.location.pathname);
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
      <Typography className={classes.applyText} align='center' color='error'>{Text.closed}</Typography>
    );
  } else if (!eventData.sign_up) {
    applyButton = (
      <Typography className={classes.applyText} align='center'></Typography>
    );
  } else if (eventData.sign_up && today > signUpEnd) {
    applyButton = (
      <Typography className={classes.applyText} align='center'>{Text.signUpEnded}</Typography>
    );
  } else if (eventData.sign_up && today < signUpStart) {
    applyButton = (
      <Typography className={classes.applyText} align='center'>{Text.inactive}</Typography>

    );
  } else if (eventData.sign_up && userEvent && today > signOffDeadline) {
    applyButton = (
      <React.Fragment>
        <Button
          fullWidth
          disabled
          className={classes.mt}
          variant='contained'
          color='secondary'>
          {Text.signOff}
        </Button>
        <Typography align='center' color='error'>Avmeldingsfristen er passert</Typography>
      </React.Fragment>
    );
  } else if (!isLoadingUserData && !isLoadingEvent && userEventLoaded) {
    applyButton = (
      <Button
        fullWidth
        className={classes.mt}
        variant='contained'
        onClick={openEventModal}
        color={userEvent ? 'secondary' : 'primary'}>
        {userEvent ? Text.signOff : Text.signUp}
      </Button>
    );
  } else {
    applyButton = (
      <Button
        fullWidth
        disabled={true}
        className={classes.mt}
        variant='contained'
        onClick={openEventModal}
        color={'secondary'}>
        {Text.loading}
      </Button>
    );
  }

  return (
    <div className={classes.wrapper}>
      {modalShow === true && userData &&
        <EventDialog
          onClose={closeEventModal}
          data={eventData}
          userData={userData}
          userEvent={userEvent}
          status={modalShow}
          applyToEvent={applyToEvent}
          isApplying={isApplying}
          message={message}
          applySuccess={applySuccess} />}
      {eventData.image && <img className={classes.image} src={eventData.image} alt={eventData.image_alt} /> }
      <div className={classes.grid} >
        <div>
          <Paper className={classes.details} noPadding>
            <DetailContent title="Fra: " info={getDate(moment(startDate, ['YYYY-MM-DD HH:mm'], 'nb'))} />
            <DetailContent title="Til: " info={getDate(moment(endDate, ['YYYY-MM-DD HH:mm'], 'nb'))} />
            <DetailContent title="Sted: " info={eventData.location} />
          </Paper>
          {eventData.sign_up &&
                    <Paper className={classes.details} noPadding>
                      <DetailContent title="Påmeldte:" info={attending + '/' + limit} />
                      <DetailContent title="Venteliste:" info={String(onWait)} />
                      {today <= signUpStart && !userEvent && <DetailContent title="Påmeldingsstart:" info={getDate(moment(signUpStart, ['YYYY-MM-DD HH:mm'], 'nb'))} /> }
                      {today > signUpStart && today < signUpEnd && !userEvent && <DetailContent title="Påmeldingsslutt:" info={getDate(moment(signUpEnd, ['YYYY-MM-DD HH:mm'], 'nb'))} /> }
                      {userEvent && <DetailContent title="Avmeldingsfrist:" info={getDate(moment(signOffDeadline, ['YYYY-MM-DD HH:mm'], 'nb'))} /> }
                    </Paper>
          }
          {eventData.sign_up && eventData.registration_priorities && eventData.registration_priorities.length < 14 ?
                    <Paper className={classes.details} noPadding>
                      <PrioritiesContent title="Prioritert:" priorities={eventData.registration_priorities} />
                    </Paper> :
                    eventData.sign_up && eventData.registration_priorities &&
                    <Paper className={classes.details} noPadding>
                      <Grid className={props.classes.info} container wrap='nowrap' alignItems='center' justify='flex-start'>
                        <Typography className={props.classes.ml} variant='subtitle1'>Prioritert:</Typography>
                        <Typography variant='subtitle1'>Alle</Typography>
                      </Grid>
                    </Paper>
          }
          {today <= startDate && applyButton }
          {(userEvent && userEvent.is_on_wait) &&
                    <div className={classes.waitlistContainer}>
                      <Typography className={classes.redText} variant='subtitle1'>Du er på ventelisten</Typography>
                    </div>}
        </div>
        <Paper className={classes.content}>
          <Typography className={classes.title} variant='h5'><strong>{eventData.title}</strong></Typography>
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
