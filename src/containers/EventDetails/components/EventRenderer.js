import React, {useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import moment from 'moment';

// Text
import Text from '../../../text/EventText';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

// Icons
import Location from '@material-ui/icons/LocationOn';
import Time from '@material-ui/icons/AccessTime';
import Persons from '@material-ui/icons/PeopleOutline';
import Timer from '@material-ui/icons/Timer';
import TimerOff from '@material-ui/icons/TimerOff';
import Stop from '@material-ui/icons/Stop';
import Start from '@material-ui/icons/PlayArrow';
import Exit from '@material-ui/icons/ExitToApp';

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
        gridTemplateColumns: '1fr 3fr',
        gridTemplateRows: 'auto',
        gridGap: '5px',

        position: 'relative',
        overflow: 'hidden',

        '@media only screen and (max-width: 800px)': {
            gridTemplateColumns: '100%',
            justifyContent: 'center',
        },
    },
    paper: {
        padding: 26,
    },
    image: {
        width: '100%',
        height: 'auto',
        maxHeight: 456,
        objectFit: 'cover',
    },
    title: {
        color: 'black',
        padding: 26,
    },
    content: {
        padding: 26,
        '@media only screen and (max-width: 800px)': {
            order: 1,
        },
    },
    details: {
        padding: 26,
        paddingBottom: '8px',
        '@media only screen and (max-width: 800px)': {
            order: 0,
        },
    },
    info: {
        width: 'auto',
        marginBottom: 10,

        '@media only screen and (max-width: 800px)': {
            justifyContent: 'space-between',
        },
    },
    ml: {marginLeft: 10},
    mt: {marginTop: 10},
    waitlistContainer: {
      margin: '10px auto',
      textAlign: 'center',
      padding: '5px',
    },
    redText: {
      color: '#cd0202',
    },
    tooltip: {
      top: '-75px !important',
      zIndex: 10002,
    },
};

const InfoContent = withStyles(styles)((props) => (
    <Grid className={props.classes.info} container direction='row' wrap='nowrap' alignItems='center' justify='flex-start'>
        <Tooltip classes={{ popper: props.classes.tooltip }} title={props.title}>
          {props.icon}
        </Tooltip>
        <Typography className={props.classes.ml} variant='subtitle1'>{props.label}</Typography>
    </Grid>
));
InfoContent.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string,
  title: PropTypes.string,
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
        <Paper className={classes.img} square>
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
            <img className={classes.image} src={data.image} alt={data.image_alt} />
            <Typography className={classes.title} variant='h5'><strong>{data.title}</strong></Typography>
            <Divider />
            <div className={classes.grid} >

                <div className={classes.details}>
                    <InfoContent title="Start" icon={<Start />} label={startDate.format('DD.MM.YYYY, HH:mm')} />
                    <InfoContent title="Slutt" icon={<Stop />} label={endDate.format('DD.MM.YYYY, HH:mm')} />
                    {data.sign_up && today <= signUpStart && !userEvent && <InfoContent title="Påmelding start" icon={<Time />} label={signUpStart.format('DD.MM.YYYY, HH:mm')} /> }
                    {data.sign_up && today > signUpStart && today < signUpEnd && !userEvent && <InfoContent title="Påmelding slutt" icon={<TimerOff />} label={signUpEnd.format('DD.MM.YYYY, HH:mm')} /> }
                    {data.sign_up && userEvent && <InfoContent title="Avmeldingsfrist" icon={<Exit />} label={signOffDeadline.format('DD.MM.YYYY, HH:mm')} /> }
                    <InfoContent title="Sted" icon={<Location />} label={data.location} />
                    {data.sign_up && <InfoContent title="Deltagere" icon={<Persons />} label={attending + '/' + limit} /> }
                    {data.sign_up && <InfoContent title="Venteliste" icon={<Timer />} label={onWait + ''} /> }
                    {data.price && <InfoContent icon={<Time />} label={data.price} />}
                    {today <= startDate && applyButton }
                    {(userEvent && userEvent.is_on_wait) &&
                      <div className={classes.waitlistContainer}>
                        <Typography className={classes.redText} variant='subtitle1'>Du er på ventelisten</Typography>
                      </div>}
                </div>
                <div className={classes.content}>
                    <MarkdownRenderer value={description} />
                </div>
            </div>
        </Paper>
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
