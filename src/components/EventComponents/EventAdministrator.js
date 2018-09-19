import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// API imports
import API from '../../api/api';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ButtonBase from '@material-ui/core/ButtonBase';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

// Icons

const SIDEBAR_WIDTH = 300;

const styles = (theme) => ({
    root: {
        paddingLeft: SIDEBAR_WIDTH,

        '@media only screen and (max-width: 800px)': {
            padding: 0,
        }
    },
    sidebar: {
        paddingTop: 64,
        position: 'fixed',
        left: 0, top: 0, bottom: 0,
        width: SIDEBAR_WIDTH,

        '@media only screen and (max-width: 800px)': {
            position: 'static',
            width: '100%',
            padding: 0,
        }
    },
    sidebarTop: {
        backgroundColor: 'whitesmoke',
        
    },
    eventItem: {
        padding: '10px 10px',
        textAlign: 'left',
    },
    selected: {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
    },
    field: {
        margin: '5px 0px',
        maxWidth: 300,
    },
    content: {
        width: '80%',
        maxWidth: 1000,
        marginTop: 150,
        display: 'block',
        margin: 'auto',
        padding: 36,

        '@media only screen and (max-width: 800px)': {
            width: 'auto',
            marginTop: 0,
        }
    },
    margin: {
        margin: '10px 0px',
    },

    snackbar: {
        marginTop: 44,
        backgroundColor: theme.palette.error.main,
    },
    messageView: {
        padding: 30,
        minWidth: 300,
        minHeight: 200,
    },
    deleteButton: {
        color: theme.palette.error.main,
    },
    progress: {
        minHeight: 300,
    },
    flexRow: {
        margin: '10px 0',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',

        '@media only screen and (max-width: 800px)': {
            flexDirection: 'column',
        }
    },
    padding: {
        padding: '10px 5px',
    }
});

const MessageView = withStyles(styles, {withTheme: true})((props) => {
    const {classes} = props;
    return (
        <Grid className={classNames(classes.messageView, props.className)} container direction='column' alignItems='center' justify='center'>
            <Typography className={classes.margin} variant='headline' align='center'>{props.title}</Typography>
            <Button className={classes.margin} variant='raised' color='primary' onClick={props.onClick}>{props.buttonText}</Button>
        </Grid>
    )
});

const EventItem = withStyles(styles, {withTheme: true})((props) => {
    const {classes} = props;
    return (
        <Fragment>
            <ButtonBase onClick={props.onClick}>
                <Grid className={classNames(classes.eventItem, (props.selected)? classes.selected : '' )} container direction='row' alignItems='center' justify='space-between'>
                    <Grid container direction='column' justify='center'>
                        <Typography variant='subheading' color='inherit'>{props.title}</Typography>
                        <Typography variant='caption'  color='inherit'>{props.location}</Typography>
                    </Grid>
                </Grid>
            </ButtonBase>
        <Divider/>
        </Fragment>
    );
});

EventItem.propTypes = {
    title: PropTypes.string,
    location: PropTypes.string,
};

const priorities = ['Lav', 'Middels', 'Høy'];
const eventCreated = 'Arrangementet ble opprettet';
const eventChanged = 'Endringen ble publisert';
const eventDeleted = 'Arrangementet ble slettet';
const snackbarHideDuration = 4000;

class EventAdministrator extends Component {

    constructor() {
        super();
        this.state = {
            pageLoading: false,
            isLoading: false,

            events: [],
            eventLists: [],
            selectedEvent: null,

            title: '',
            location: '',
            startDate: new Date().toISOString(),
            description: '',
            signUp: false,
            priority: 0,
            image: '',
            // imageAlt: '',
            eventlist: 0,

            showMessage: false,
            errorMessage: 'Det oppstod en feil',
            showSuccessMessage: false,
            successMessage: eventCreated,
        };
    }

    componentDidMount() {
        // Get all events
        const response = API.getEventItems().response();
        response.then((data) => {
            console.log(data);
            if (response.isError === false) {
                this.setState({events: data});
            }
        });

        // Get all eventlists
        const listResponse = API.getEventLists().response();
        listResponse.then((data) => {
            console.log(data);
            if (response.isError === false) {
                this.setState({eventLists: data});
            }
        });
    }

    onEventClick = (event) => {
        const {selectedEvent} = this.state;

        if(selectedEvent !== null && selectedEvent.id === event.id) {
            this.setState({
                selectedEvent: null,
                title: '',
                location: '',
                description: '',
                priority: 0,
                image: '',
                imageAlt: '',
                eventlist: 0,
                startDate: new Date().toISOString().substring(0, 16),
                signUp: false,
            });
        } else {
            this.setState({
                selectedEvent: event,
                title: event.title,
                location: event.location,
                description: event.description,
                priority: event.priority,
                image: event.image,
                // imageAlt: event.imageAlt,
                eventlist: event.eventlist,
                startDate: event.start.substring(0,16),
                signUp: event.signUp,
            });
        }
        this.setState({showSuccessMessage: false});
    }

    handleChange = (name) => (event) => {
        this.setState({[name]: event.target.value});
    }

    toggleSnackbar = () => {
        this.setState({showMessage: !this.state.showMessage});
    }

    toggleSuccessView = () => {
        this.setState({showSuccessMessage: !this.state.showSuccessMessage});
    }

    getStateEventItem = () => ({
        title: this.state.title,    
        location: this.state.location,
        description: this.state.description,
        priority: this.state.priority,
        image: this.state.image,
        imageAlt: 'event',
        eventlist: this.state.eventlist,
        start: this.state.startDate,
        signUp: this.state.signUp,
    });

    createNewEvent = (event) => {
        event.preventDefault();

        const item = this.getStateEventItem();

        this.setState({isLoading: true});

        // Create new Event Item
        const response = API.createEventItem(item).response();
        response.then((data) => {
            console.log(data);
            if(response.isError === false) {
                const newEvents = Object.assign([], this.state.events);
                newEvents.unshift(data);
                this.setState({events: newEvents, showSuccessMessage: true, successMessage: eventCreated});
            } else {
                this.setState({showMessage: true, snackMessage: 'Det oppstod en feil'});
            }
            this.setState({isLoading: false});
        });
    }

    editEventItem = (event) => {
        event.preventDefault();

        const item = this.getStateEventItem();
        const {selectedEvent} = this.state;

        this.setState({isLoading: true});

        // Create new Event Item
        const response = API.editEventItem(selectedEvent.id, item).response();
        response.then((data) => {
            console.log(data);
            if(response.isError === false) {
                const newEvents = Object.assign([], this.state.events);
                const index = newEvents.findIndex((elem) => elem.id === selectedEvent.id);
                if(index !== -1) {
                    newEvents[index] = data;
                    this.setState({events: newEvents, showSuccessMessage: true, successMessage: eventChanged});
                }
            } else {
                this.setState({showMessage: true, snackMessage: 'Det oppstod en feil'});
            }
            this.setState({isLoading: false});
        });
    }

    deleteEventItem = (event) => {
        event.preventDefault();

        const {selectedEvent} = this.state;

        this.setState({isLoading: true});

        // Create new Event Item
        const response = API.deleteEventItem(selectedEvent.id).response();
        response.then((data) => {
            console.log(data);
            if(response.isError === false) {
                const newEvents = Object.assign([], this.state.events);
                const index = newEvents.findIndex((elem) => elem.id === selectedEvent.id);
                if(index !== -1) {
                    newEvents.splice(index, 1);
                    this.setState({events: newEvents, selectedEvent: null, showSuccessMessage: true, successMessage: eventDeleted});
                }
            }
            this.setState({isLoading: false});
        });
    }

    render() {
        const {classes} = this.props;
        const {selectedEvent, title, location, description, image, priority, eventlist} = this.state;
        const selectedEventId = (selectedEvent)? selectedEvent.id : '';
        const eventLists = (this.state.eventLists)? this.state.eventLists : [];
        const isNewItem = (selectedEvent === null);
        const header = (isNewItem)? 'Lag et nytt arrangement' : 'Endre arrangement';

        return (
            <Fragment>
                <div className={classes.root}>
                    <Snackbar
                        open={this.state.showMessage}
                        autoHideDuration={snackbarHideDuration}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        onClose={this.toggleSnackbar}>
                        
                            <SnackbarContent
                                className={classes.snackbar}
                                message={this.state.snackMessage}/>
                        </Snackbar>

                    <Paper className={classes.content} square>
                        {(this.state.isLoading)? <Grid className={classes.progress} container justify='center' alignItems='center'><CircularProgress /></Grid> :
                        (this.state.showSuccessMessage)? <MessageView title={this.state.successMessage} buttonText='Nice' onClick={this.toggleSuccessView}/> :
                            <form>
                                <Grid container direction='column' wrap='nowrap'>
                                    <Typography variant='headline'>{header}</Typography>
                                    <TextField className={classes.field} label='Tittel' value={title} onChange={this.handleChange('title')} required/>
                                    <TextField className={classes.field} label='Sted' value={location} onChange={this.handleChange('location')} required/>
                                    <TextField className={classes.margin} multiline label='Beskrivelse' value={description} onChange={this.handleChange('description')} required/>

                                    <TextField className={classes.margin} fullWidth label='Bilde' value={image} onChange={this.handleChange('image')} required/>

                                    <div className={classes.flexRow}>
                                        <TextField className={classes.margin} select fullWidth label='Proritering' value={priority} onChange={this.handleChange('priority')}>
                                            {priorities.map((value, index) => (
                                                <MenuItem key={index} value={index}>
                                                    {value}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                        <TextField className={classes.margin} select fullWidth label='Arrangement Liste' value={eventlist} onChange={this.handleChange('eventlist')}>
                                            {eventLists.map((value, index) => (
                                                <MenuItem key={index} value={value.id}>
                                                    {value.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                        <TextField className={classes.margin} fullWidth type='datetime-local' pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" label='Start dato' value={this.state.startDate} onChange={this.handleChange('startDate')} />
                                    </div>

                                    <Grid container direction='row' wrap='nowrap' justify='space-between'>
                                        {(isNewItem)? 
                                            <Button onClick={this.createNewEvent} type='submit' variant='raised' color='primary'>Lag nytt event</Button> :
                                            <Fragment>
                                                <Button onClick={this.editEventItem} variant='raised' color='primary'>Lagre</Button>
                                                <Button className={classes.deleteButton} onClick={this.deleteEventItem} variant='outlined'>Slett</Button>
                                            </Fragment>
                                        }
                                    </Grid>
                                </Grid>
                            </form>
                        }
                    </Paper>

                </div>
                <Paper className={classes.sidebar}>
                    <Grid container direction='column' wrap='nowrap'>
                        <div className={classNames(classes.sidebarTop, classes.padding)}>
                            <Typography variant='title' color='inherit'>Arrangementer</Typography>
                        </div>
                        {this.state.events.map((value, index) => (
                            <EventItem
                                key={index}
                                selected={value.id === selectedEventId}
                                onClick={() => this.onEventClick(value)}
                                title={value.title}
                                location={value.location} />
                        ))}
                    </Grid>
                </Paper>
            </Fragment>
        );
    }
}

EventAdministrator.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles, {withTheme: true})(EventAdministrator);
