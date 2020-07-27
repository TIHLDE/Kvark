import React, {Component, useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import jsQR from 'jsqr';
import Helmet from 'react-helmet';

// Service and action imports
import EventService from '../../api/services/EventService';

// Text imports
import Text from '../../text/EventRegistrationText';

// Material UI Components
import {withStyles} from '@material-ui/core/styles';
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
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';

// Icons
import TextFields from '@material-ui/icons/TextFields';
import PhotoCameraOutlinedIcon from '@material-ui/icons/PhotoCameraOutlined';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import Paper from '../../components/layout/Paper';

const styles = (theme) => ({
  root: {
    minHeight: '100vh',
    width: '100%',
  },
  top: {
    height: 220,
    background: theme.colors.gradient.main.top,
    transition: '2s',
  },
  main: {
    maxWidth: 1000,
    margin: 'auto',
    position: 'relative',
  },
  paper: {
    width: '90%',
    maxWidth: 460,
    margin: 'auto',
    position: 'relative',
    left: 0, right: 0,
    top: '-60px',
  },
  progress: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
  },
  searchField: {
    width: '100%',
  },
  snackbar: {
    bottom: '20px',
    position: 'fixed',
    borderRadius: theme.sizes.border.radius,
    color: theme.colors.constant.white,
    textAlign: 'center',
    maxWidth: '75%',
    display: 'flex',
    justifyContent: 'center',

    '@media only screen and (min-width: 600px)': {
      whiteSpace: 'nowrap',
    },
  },
  snackbar_success: {
    backgroundColor: theme.colors.status.green,
  },
  snackbar_error: {
    backgroundColor: theme.colors.status.red,
  },
  qr: {
    width: '100%',
    borderRadius: theme.sizes.border.radius,
    overflow: 'hidden',
    marginTop: 5,
  },
  cardContent: {
    padding: '5px 20px',
    display: 'flex',
    boxShadow: '0px 2px 4px ' + theme.colors.border.main + '88',
    borderRadius: theme.sizes.border.radius,
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
    color: theme.colors.text.light,
  },
  cardButtonLabel: {
    marginRight: -10,
  },
  cardButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    color: theme.colors.text.light,
  },
  cardActionArea: {
    display: 'flex',
  },
  lightText: {
    color: theme.colors.text.light,
  },
  title: {
    color: theme.colors.text.main,
  },
});

const ParticipantCard = withStyles(styles)((props) => {
  const [checkedState, setCheckedState] = useState(props.user.has_attended);
  const handleCheck = (actionEvent) => {
    setCheckedState(actionEvent.target.checked);
    EventService.updateUserEvent(props.eventId, {user_id: props.user.user_info.user_id, has_attended: actionEvent.target.checked});
  };
  return (
    <div className={props.classes.cardContent}>
      <div className={props.classes.cardUserName}>
        <Typography className={props.classes.cardText}>{props.user.user_info.first_name + ' ' + props.user.user_info.last_name}</Typography>
      </div>
      <div className={props.classes.cardActionArea}>
        <div className={props.classes.cardButtonContainer}>
          <FormControlLabel
            label={<Hidden xsDown>Ankommet</Hidden>}
            className={props.classes.cardButtonLabel}
            control={
              <Checkbox
                onChange={
                  handleCheck
                }
                checked={checkedState}
              />}
          />
        </div>
      </div>
    </div>
  );
});
ParticipantCard.propTypes = {
  user: PropTypes.object,
  eventId: PropTypes.string,
};

class EventRegistration extends Component {

  constructor() {
    super();
    this.state = {
      isLoading: false,
      eventName: '',
      snackbarOpen: false,
      Transition: Slide,
      snackbarMessage: '',
      tabViewMode: 0,
      allParticipants: null,
      participantsToShow: null,
      error: false,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
    this.canvasLoad = this.canvasLoad.bind(this);
  }

  canvasLoad() {
    let video; let canvasElement; let canvas;
    const timer = setInterval(function () {
      if (document.getElementById('canvas') !== null) clearInterval(timer);
      video = document.createElement('video');
      canvasElement = document.getElementById('canvas');
      canvas = canvasElement.getContext('2d');
      startQrScan();
    }, 200);

    const drawLine = (begin, end, color) => {
      canvas.beginPath();
      canvas.moveTo(begin.x, begin.y);
      canvas.lineTo(end.x, end.y);
      canvas.lineWidth = 4;
      canvas.strokeStyle = color;
      canvas.stroke();
    };

    const startQrScan = () => {
      navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}}).then(function (stream) {
        video.srcObject = stream;
        video.setAttribute('playsinline', true);
        video.setAttribute('muted', true);
        video.play();
        requestAnimationFrame(tick);
      });
    };

    const tick = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.hidden = false;
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;

        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {inversionAttempts: 'dontInvert'});
        if (code && !this.state.isLoading) {
          drawLine(code.location.topLeftCorner, code.location.topRightCorner, '#FF3B58');
          drawLine(code.location.topRightCorner, code.location.bottomRightCorner, '#FF3B58');
          drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, '#FF3B58');
          drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, '#FF3B58');
          this.markAttended(code.data);
        }
      }
      requestAnimationFrame(tick);
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadEventName();
    this.loadEventUsers();
  }

  handleTabChange(event, newValue) {
    this.setState({tabViewMode: newValue});
    if (newValue === 1) {
      this.canvasLoad();
    }
  }

  loadEventName() {
    const id = this.props.match.params.id;

    // Load event item
    this.setState({isLoading: true});
    EventService.getEventById(id).then((event) => {
      if (!event) {
        this.props.history.replace('/'); // Redirect to landing page given id is invalid
      } else {
        this.setState({isLoading: false, eventName: event.title});
      }
    });
  }
  loadEventUsers() {
    const id = this.props.match.params.id;
    this.setState({isLoading: true});
    EventService.getEventParticipants(id).then((participants) => {
      const participantsIn = participants.filter((user) => !user.is_on_wait);
      this.setState({isLoading: false, allParticipants: participantsIn, participantsToShow: participantsIn});
    });
  }

  markAttended(username) {
    const body = {'has_attended': true};
    const eventId = this.props.match.params.id;

    this.setState({isLoading: true});
    EventService.putAttended(eventId, body, username).then((data) => {
      if (data && data.detail === 'User event successfully updated.') {
        this.setState({snackbarMessage: 'Deltageren er registrert ankommet!', snackbarOpen: true, error: false});
      } else {
        this.setState({snackbarMessage: Text.wrongCred, snackbarOpen: true, error: true});
      }
    });
  }
    handleSnackbarClose = () => {
      this.setState({snackbarOpen: false, isLoading: false});
    }

    search = (name) => {
      let participantsToPrint = this.state.participantsToShow;
      if (participantsToPrint && (typeof name === 'string' || name instanceof String) && name !== '') {
        participantsToPrint = participantsToPrint.filter((user) => (user.user_info.first_name + ' ' + user.user_info.last_name).toLowerCase().includes(name.toLowerCase()));
        this.setState({participantsToShow: participantsToPrint});
      } else {
        this.setState({participantsToShow: this.state.allParticipants, participantsToPrint: this.state.allParticipants});
      }
    }

    Participants = () => {
      let elements = <Typography className={this.props.classes.lightText}>Ingen påmeldte.</Typography>;
      const participantsToPrint = this.state.participantsToShow;

      if (participantsToPrint && participantsToPrint.length > 0) {
        elements = participantsToPrint.map((user, key) => {
          return <ParticipantCard
            key={key}
            eventId={this.props.match.params.id}
            user={user} />;
        });
      }

      return elements;
    };

    render() {
      const {classes} = this.props;

      return (
        <Navigation footer fancyNavbar>
          <Helmet>
            <title>{this.state.eventName} - registering - TIHLDE</title>
          </Helmet>
          <div className={classes.root}>
            <div className={classes.top}></div>
            <div className={classes.main}>
              <Paper className={classes.paper}>
                {this.state.isLoading && <LinearProgress className={classes.progress} />}
                <Typography variant='h5' align='center' className={classes.title}>{this.state.eventName}</Typography>
                <Tabs variant="fullWidth" scrollButtons="on" centered className={classes.lightText} value={this.state.tabViewMode} onChange={this.handleTabChange}>
                  <Tab id='0' icon={<TextFields />} label='Navn' />
                  <Tab id='1' icon={<PhotoCameraOutlinedIcon />} label='QR-kode' />
                </Tabs>
                {this.state.tabViewMode === 0 ?
                  <div>
                    <TextField
                      className={classes.searchField}
                      onChange={(e) => this.search(e.target.value)}
                      label='Søk'
                      variant='outlined'
                      margin='normal'
                      type='Søk'
                    />
                    <this.Participants/>
                  </div> :
                  <div>
                    <canvas id="canvas" hidden className={classes.qr}></canvas>
                  </div>
                }
              </Paper>
            </div>
          </div>
          <Snackbar open={this.state.snackbarOpen} onClose={this.handleSnackbarClose} TransitionComponent={this.state.Transition}>
            <SnackbarContent
              className={this.state.error ? classNames(classes.snackbar, classes.snackbar_error) : classNames(classes.snackbar, classes.snackbar_success)}
              message={this.state.snackbarMessage}
              action={
                <Button color="inherit" size="small" onClick={this.handleSnackbarClose} className={classes.lightText}>
                                Neste
                </Button>
              }
            />
          </Snackbar>
        </Navigation>
      );
    }
}

EventRegistration.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
};

export default withStyles(styles)(EventRegistration);
