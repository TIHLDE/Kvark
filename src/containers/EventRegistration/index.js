import React, {Component, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import QrReader from 'react-qr-reader';

// Service and action imports
import EventService from '../../api/services/EventService';

// Text imports
import Text from '../../text/EventRegistrationText';

// Material UI Components
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

// Icons
import TextFields from '@material-ui/icons/TextFields';
import PhotoCameraOutlinedIcon from '@material-ui/icons/PhotoCameraOutlined';

// Project Components
import Navigation from '../../components/navigation/Navigation';

const styles = {
    root: {
        minHeight: '100vh',
        width: '100%',
    },
    top: {
        height: 160,
        backgroundImage: 'linear-gradient(90deg, #f80759, #500e60)',
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
        padding: 28,
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: '#fff',
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
        borderRadius: '4px',
        backgroundColor: 'green',
        color: 'white',
        textAlign: 'center',
        maxWidth: '75%',
        display: 'flex',
        justifyContent: 'center',

        '@media only screen and (min-width: 600px)': {
            whiteSpace: 'nowrap',
        },
    },
    qr: {
        width: '100%',
        borderRadius: 5,
        overflow: 'hidden',
        marginTop: 5,
    },
    cardContent: {
        padding: '5px 20px',
        display: 'flex',
        boxShadow: '0px 2px 4px #ddd',
        borderRadius: 5,
        marginBottom: 3,
        '@media only screen and (max-width: 600px)': {
            paddingTop: 15,
            flexDirection: 'column',
        },
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
    },
    cardButtonContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    cardActionArea: {
        display: 'flex',
    },
};

const ParticipantCard = withStyles(styles)((props) => {
    const [checkedState, setCheckedState] = useState(props.user.has_attended);
    const handleCheck = (actionEvent) => {
        setCheckedState(actionEvent.target.checked);
        EventService.updateUserEvent(props.eventId, {user_id: props.user.user_info.user_id, has_attended: actionEvent.target.checked});
    };
    return(
    <div className={props.classes.cardContent}>
        <div className={props.classes.cardUserName}>
            <Typography className={props.classes.cardText}>{props.user.user_info.first_name + ' ' + props.user.user_info.last_name}</Typography>
        </div>
        <div className={props.classes.cardActionArea}>
            <div className={props.classes.cardButtonContainer}>
                <FormControlLabel
                    label="Ankommet"
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
)});
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
            qrResult: '',
            allParticipants: null,
            participantsToShow: null,
        };

        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleScan = this.handleScan.bind(this);
    }

    handleScan(data) {
        if (data) {
            this.markAttended(data);
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadEventName();
        this.loadEventUsers();
    }

    handleTabChange(event, newValue) {
        this.setState({ tabViewMode: newValue });
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
            let participantsIn = participants.filter((user) => !user.is_on_wait);
            this.setState({isLoading: false, allParticipants: participantsIn, participantsToShow: participantsIn});
        });
    }

    markAttended(username) {
        const body = {'has_attended': true};
        const eventId = this.props.match.params.id;

        this.setState({isLoading: true});
        EventService.putAttended(eventId, body, username).then((data) => {
            if (data.detail === 'User event successfully updated.') {
                this.setState({ username: '', qrResult: '', snackbarMessage: 'Velkommen! Du er registrert ankommet!', snackbarOpen: true, isLoading: false });
            } else {
                this.setState({qrResult: Text.wrongCred, isLoading: false});
            }
        });
    }
    handleSnackbarClose = () => {
        this.setState({
            snackbarOpen: false,
        });
    }

    search = (name) => {
        let participantsToPrint = this.state.participantsToShow;
        if (participantsToPrint && (typeof name === 'string' || name instanceof String) && name !== '') {
            participantsToPrint = participantsToPrint.filter((user) => (user.user_info.first_name + " " + user.user_info.last_name).toLowerCase().includes(name.toLowerCase()));
            this.setState({participantsToShow: participantsToPrint});
        } else {
            this.setState({participantsToShow: this.state.allParticipants, participantsToPrint: this.state.allParticipants});
        }
        
    }

    Participants = () => {
        let elements = <Typography>Ingen påmeldte.</Typography>;
        let participantsToPrint = this.state.participantsToShow;

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
            <Navigation footer>
                <div className={classes.root}>
                    <div className={classes.top}></div>
                    <div className={classes.main}>
                        <div className={classes.paper}>
                            {this.state.isLoading && <LinearProgress className={classes.progress} />}
                            <Typography variant='h5' align='center'>{this.state.eventName}</Typography>
                            <Tabs variant="fullWidth" scrollButtons="on" centered className={classes.tabs} value={this.state.tabViewMode} onChange={this.handleTabChange}>
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
                                </div>
                            :
                            <div>
                                <QrReader
                                delay={300}
                                resolution={600}
                                onScan={this.handleScan}
                                className={classes.qr}
                                showViewFinder={false}
                                />
                                <p>{this.state.qrResult}</p>
                            </div>
                            }
                        </div>
                    </div>
                </div>
                <Snackbar open={this.state.snackbarOpen} onClose={this.handleSnackbarClose} TransitionComponent={this.state.Transition} autoHideDuration={3000}>
                    <SnackbarContent className={classes.snackbar} message={this.state.snackbarMessage} />
                </Snackbar>
            </Navigation>
        );
    }
}

EventRegistration.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(EventRegistration);
