import React, {useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import moment from 'moment';

// Text
import Text from '../../../text/EventText';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// Project Components
import MarkdownRenderer from '../../../components/miscellaneous/MarkdownRenderer';
import EventDialog from './EventDialog';

// Urls
import URLS from '../../../URLS';

// Services
import MiscService from '../../../api/services/MiscService';

const styles = {
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
        maxHeight: 456,
        objectFit: 'cover',
        border: '1px solid #ddd',
        backgroundColor: '#ddd',
        borderRadius: 5,
        display: 'block',
        boxSizing: 'border-box',
    },
    title: {
        color: 'black',
        padding: 26,
        paddingLeft: 0,
        paddingTop: 0,
    },
    content: {
        padding: 20,
        border: '1px solid #ddd',
        borderRadius: 5,
        backgroundColor: '#ffffff',
        height: 'fit-content',
        '@media only screen and (max-width: 800px)': {
            order: 1,
        },
    },
    details: {
        padding: 20,
        border: '1px solid #ddd',
        borderRadius: 5,
        backgroundColor: '#ffffff',
        paddingBottom: 8,
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
        marginBottom: 3,
        flexDirection: 'column',

        '@media only screen and (max-width: 800px)': {
            flexDirection: 'row',
        },
    },
    ml: {marginRight: 5, fontWeight: 'bold'},
    ml2: {textAlign: 'center'},
    mt: {height: 50, fontWeight: 'bold'},
    waitlistContainer: {
      margin: '10px auto',
      textAlign: 'center',
      padding: '5px',
    },
    redText: {
      color: '#cd0202',
    },
    description: {
      color: '#333',
    },
};

const getDay = (day) => {
  switch (day) {
      case 0: return 'Søndag';
      case 1: return 'Mandag';
      case 2: return 'Tirsdag';
      case 3: return 'Onsdag';
      case 4: return 'Torsdag';
      case 5: return 'Fredag';
      case 6: return 'Lørdag';
      default: return day;
  };
};
const getMonth = (month) => {
  switch (month) {
      case 0: return 'jan';
      case 1: return 'feb';
      case 2: return 'mars';
      case 3: return 'april';
      case 4: return 'mai';
      case 5: return 'juni';
      case 6: return 'juli';
      case 7: return 'aug';
      case 8: return 'sep';
      case 9: return 'okt';
      case 10: return 'nov';
      case 11: return 'des';
      default: return month;
  }
};
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

const EventRenderer = (props) => {
    const {
      classes,
      data,
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
    const description = data.description || '';
    const startDate = moment(data.start_date, ['YYYY-MM-DD HH:mm'], 'nb');
    const endDate = moment(data.end_date, ['YYYY-MM-DD HH:mm'], 'nb');
    const signUpStart = moment(data.start_registration_at, ['YYYY-MM-DD HH:mm'], 'nb');
    const signUpEnd = moment(data.end_registration_at, ['YYYY-MM-DD HH:mm'], 'nb');
    const signOffDeadline = moment(data.sign_off_deadline, ['YYYY-MM-DD HH:mm'], 'nb');
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

    const limit = data.limit;
    const attending = data.list_count;
    const onWait = data.waiting_list_count;

    // Buttons for applying and unapplying to events.
    let applyButton = null;
    if (data.closed) {
        applyButton = (
        <Typography align='center' color='error'>{Text.closed}</Typography>
        );
    } else if (!data.sign_up) {
      applyButton = (
      <Typography align='center'></Typography>
      );
    } else if (data.sign_up && today > signUpEnd) {
      applyButton = (
      <Typography align='center'>{Text.signUpEnded}</Typography>

      );
    } else if (data.sign_up && today < signUpStart) {
      applyButton = (
      <Typography align='center'>{Text.inactive}</Typography>

      );
    } else if (data.sign_up && userEvent && today > signOffDeadline) {
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
                data={data}
                userData={userData}
                userEvent={userEvent}
                status={modalShow}
                applyToEvent={applyToEvent}
                isApplying={isApplying}
                message={message}
                applySuccess={applySuccess} />}
            {data.image && <img className={classes.image} src={data.image} alt={data.image_alt} /> }
            <div className={classes.grid} >
                <div>
                  <div className={classes.details}>
                      <DetailContent title="Fra: " info={getDate(moment(startDate, ['YYYY-MM-DD HH:mm'], 'nb'))} />
                      <DetailContent title="Til: " info={getDate(moment(endDate, ['YYYY-MM-DD HH:mm'], 'nb'))} />
                      <DetailContent title="Sted: " info={data.location} />
                    </div>
                  {data.sign_up &&
                    <div className={classes.details}>
                        <DetailContent title="Påmeldte:" info={attending + '/' + limit} />
                        <DetailContent title="Venteliste:" info={onWait + ''} />
                        {today <= signUpStart && !userEvent && <DetailContent title="Påmeldingsstart:" info={getDate(moment(signUpStart, ['YYYY-MM-DD HH:mm'], 'nb'))} /> }
                        {today > signUpStart && today < signUpEnd && !userEvent && <DetailContent title="Påmeldingsslutt:" info={getDate(moment(signUpEnd, ['YYYY-MM-DD HH:mm'], 'nb'))} /> }
                        {userEvent && <DetailContent title="Avmeldingsfrist:" info={getDate(moment(signOffDeadline, ['YYYY-MM-DD HH:mm'], 'nb'))} /> }
                    </div>
                  }
                  {today <= startDate && applyButton }
                      {(userEvent && userEvent.is_on_wait) &&
                        <div className={classes.waitlistContainer}>
                          <Typography className={classes.redText} variant='subtitle1'>Du er på ventelisten</Typography>
                        </div>}
                </div>
                <div className={classes.content}>
                    <Typography className={classes.title} variant='h5'><strong>{data.title}</strong></Typography>
                    <MarkdownRenderer className={classes.description} value={description} />
                </div>
            </div>
        </div>
    );
};

EventRenderer.propTypes = {
    classes: PropTypes.object,
    data: PropTypes.object.isRequired,
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
