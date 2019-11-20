import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Service and action imports
import EventService from '../../api/services/EventService';

// Text imports
import Text from '../../text/EventRegistrationText';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

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
    },
    main: {
        maxWidth: 1000,
        margin: 'auto',
        position: 'relative',
    },
    paper: {
        width: '75%',
        maxWidth: 460,
        margin: 'auto',
        position: 'absolute',
        left: 0, right: 0,
        top: '-60px',
        padding: 28,
    },
    
    mt: {marginTop: 16},
    progress: {
        position: 'absolute',
        top: 0, left: 0, right: 0,
    }
};

class EventRegistration extends Component {

    constructor() {
        super();
        this.state = {
            errorMessage: null,
            isLoading: false,
            eventName: '',
        };

        this.username = React.createRef();
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadEventName();
    }

    handleChange = (event) => {
        this.setState({errorMessage: null})
    }

    loadEventName () {
        
        const id = this.props.match.params.id;

        // Load event item
        this.setState({isLoading: true});
        EventService.getEventById(id)
        .then((event) => {
            if(!event) {
                this.props.history.replace('/'); // Redirect to landing page given id is invalid
            } else {
                this.setState({isLoading: false, eventName: event.title});
            }
        });
    }

    onRegistration = (event) => {
        event.preventDefault();

        if(this.state.isLoading) {
            return;
        }

        const username = this.username.value;
        const body = {"has_attended": true};
        const event_id = this.props.match.params.id;


        this.setState({errorMessage: null, isLoading: true});
        EventService.putAttended(event_id, body, username).then((data) => {
            if(data.detail === "User event successfully updated.") {
                this.setState({isLoading: false});
                this.username.value = '';
            } else {
                this.setState({errorMessage: Text.wrongCred, isLoading: false})
            }
        });
    }

    render() {
        const {classes} = this.props;
        return (
            <Navigation footer>
                <div className={classes.root}>
                    <div className={classes.top}>
                
                    </div>
                    <div className={classes.main}>
                        <Paper className={classes.paper} square elevation={3}>
                            {this.state.isLoading && <LinearProgress className={classes.progress} />}
                            
                            <Typography variant='h5' align='center'>{this.state.eventName}</Typography>
                            
                            <form onSubmit={this.onRegistration}>
                                <Grid container direction='column'>
                                    <TextField
                                        onChange={this.handleChange}
                                        inputRef={(e) => this.username = e}
                                        helperText={this.state.errorMessage}
                                        error={this.state.errorMessage !== null}
                                        label='Brukernavn'
                                        variant='outlined'
                                        margin='normal'
                                        type='Brukernavn'
                                        required/>
                                    <Button className={classes.mt}
                                        variant='contained'
                                        color='primary'
                                        disabled={this.state.isLoading}
                                        type='submit'>
                                    Meld ankomst
                                    </Button>
                                </Grid>
                            </form>
                        </Paper>
                    </div>
                </div>
            </Navigation>
        );
    }
}

EventRegistration.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(EventRegistration);

