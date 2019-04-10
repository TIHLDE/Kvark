import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

// API imports
import EventService from '../../../api/services/EventService';

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
import IconButton from '@material-ui/core/IconButton';

// Icons
import AddIcon from '@material-ui/icons/Add';
import DownloadIcon from '@material-ui/icons/CloudDownload';

// Project Components
import TextEditor from '../../../components/inputs/TextEditor';
import EventPreview from './EventPreview';

const SIDEBAR_WIDTH = 300;

const styles = (theme) => ({
    root: {
        paddingLeft: SIDEBAR_WIDTH,
        paddingBottom: 100,
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
        padding: '10px 5px 10px 12px',
    },
    miniTop: {
        padding: '5px 5px 5px 12px',
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
    mr: {marginRight: 10},
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
const errorMessage = (data) => 'Det oppstod en feil! '.concat(JSON.stringify(data || {}));
const snackbarHideDuration = 4000;

class EventAdministrator extends Component {

    constructor() {
        super();
        this.state = {
            isLocked: true,
            isLoading: false,
            isFetching: false,

            events: [],
            expired: [],
            eventLists: [],
            categories: [],
            selectedEvent: null,

            title: '',
            location: '',
            startDate: new Date().toISOString(),
            description: '',
            signUp: false,
            priority: 0,
            image: '',
            category: 0,
            // imageAlt: '',
            eventlist: 0,

            showMessage: false,
            errorMessage: 'Det oppstod en feil',
            showSuccessMessage: false,
            successMessage: eventCreated,
            showPreview: false,
        };
    }

    componentDidMount() {
    
        // Get all eventlists
        EventService.getEventLists()
        .then((data) => {
            if(data) {
                this.setState({eventLists: data});
            }
        });

        // Get all categories
        EventService.getCategories()
        .then((data) => {
            if(data) {
                this.setState({categories: data});
            }
        });

        // Get all events
        EventService.getEvents()
        .then((data) => {
            if(data) {
                this.setState({events: data});
            }
        })
    }

    fetchExpired = () => {
        console.log(this.state.isFetching);
        if(this.state.isFetching) {
            return;
        }

        this.setState({isFetching: false});
        EventService.getExpiredData((isError, data) => {

            if (!isError) {
                this.setState({expired: data});
            }
            this.setState({isFetching: true});
        });
    }

    onEventClick = (event) => {
        const {selectedEvent} = this.state;

        if(selectedEvent !== null && selectedEvent.id === event.id) {
            this.resetEventState();
        } else {
            this.setState({
                selectedEvent: event,
                title: event.title,
                location: event.location,
                description: event.description,
                priority: event.priority,
                image: event.image,
                category: event.category,
                eventlist: event.eventlist,
                startDate: event.start.substring(0,16),
                signUp: event.signUp,
            });
        }
        this.setState({showSuccessMessage: false});
    }

    resetEventState = () => {
        this.setState({
            selectedEvent: null,
            title: '',
            location: '',
            description: '',
            priority: 0,
            image: '',
            imageAlt: '',
            eventlist: 0,
            category: 0,
            startDate: new Date().toISOString().substring(0, 16),
            signUp: false,
        });
    }

    handleChange = (name) => (event) => {
        this.setState({[name]: event.target.value});
    }

    handleToggleChange = (name) => () => {
        this.setState({[name]: !this.state[name]});
    }

    onChange = (name) => (value) => {
        this.setState({[name]: value});
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
        category: this.state.category,
        eventlist: this.state.eventlist,
        start: moment(this.state.startDate).format('YYYY-MM-DDThh:mm'),
        signUp: this.state.signUp,
    });

    createNewEvent = (event) => {
        event.preventDefault();

        const item = this.getStateEventItem();

        this.setState({isLoading: true});

        // Create new Event Item
        EventService.createNewEvent(item, (isError, data) => {
            if(!isError) {
                const newEvents = Object.assign([], this.state.events);
                newEvents.unshift(data);
                this.setState({events: newEvents, showSuccessMessage: true, successMessage: eventCreated});
            } else {
                this.setState({showMessage: true, snackMessage: errorMessage(data)});
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
        EventService.putEvent(selectedEvent.id, item, (isError, data) => {
            if(!isError) {
                // Update stored event with the new data
                const newEvents = Object.assign([], this.state.events);
                const index = newEvents.findIndex((elem) => elem.id === selectedEvent.id); // Finding event by id
                if(index !== -1) {
                    newEvents[index] = data;
                    this.setState({events: newEvents, showSuccessMessage: true, successMessage: eventChanged});
                }
            } else {
                this.setState({showMessage: true, snackMessage: errorMessage(data)});
            }
            this.setState({isLoading: false});
        });
    }

    deleteEventItem = (event) => {
        event.preventDefault();

        const {selectedEvent} = this.state;

        this.setState({isLoading: true});

        // Create new Event Item
        EventService.deleteEvent(selectedEvent.id, (isError, data) => {
            if(isError === false) {
                // Remove the deleted event from the state
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
        const {selectedEvent, title, location, description, image, priority, eventlist, categories, category} = this.state;
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
                                    
                                    <TextEditor className={classes.margin} value={description} onChange={this.onChange('description')}/>

                                    <Divider className={classes.margin} />

                                    <TextField className={classes.margin} fullWidth label='Bilde' value={image} onChange={this.handleChange('image')}/>

                                    <div className={classes.flexRow}>
                                        <TextField className={classes.margin} select fullWidth label='Proritering' value={priority} onChange={this.handleChange('priority')}>
                                            {priorities.map((value, index) => (
                                                <MenuItem key={index} value={index}>
                                                    {value}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                        <TextField className={classes.margin} select fullWidth label='Kategori' value={category} onChange={this.handleChange('category')}>
                                            {categories.map((value, index) => (
                                                <MenuItem key={index} value={value.id}>
                                                    {value.text}
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
                                            <div>
                                                <Button className={classes.mr} onClick={this.createNewEvent} type='submit' variant='raised' color='primary'>Lag nytt event</Button>
                                                <Button variant='outlined' color='primary' onClick={this.handleToggleChange('showPreview')}>Preview</Button>
                                            </div>
                                             
                                            :
                                            <Fragment>
                                                <div>
                                                    <Button className={classes.mr} onClick={this.editEventItem} variant='raised' type='submit' color='primary'>Lagre</Button>
                                                    <Button variant='outlined' color='primary' onClick={this.handleToggleChange('showPreview')}>Preview</Button>
                                                </div>
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
                        <Grid className={classNames(classes.sidebarTop)} container direction='row' wrap='nowrap' alignItems='center' justify='space-between'>
                            <Typography variant='title' color='inherit'>Arrangementer</Typography>
                            <IconButton onClick={this.resetEventState}><AddIcon/></IconButton>
                        </Grid>
                        {this.state.events.map((value, index) => (
                            <EventItem
                                key={index}
                                selected={value.id === selectedEventId}
                                onClick={() => this.onEventClick(value)}
                                title={value.title}
                                location={value.location} />
                        ))}
                        <Grid className={classNames(classes.sidebarTop, classes.miniTop)} container direction='row' wrap='nowrap' alignItems='center' justify='space-between'>
                            <Typography variant='title' color='inherit'>Utgåtte</Typography>
                            <IconButton onClick={this.fetchExpired}><DownloadIcon/></IconButton>
                        </Grid>
                        {this.state.expired.map((value, index) => (
                            <EventItem
                                key={index}
                                selected={value.id === selectedEventId}
                                onClick={() => this.onEventClick(value)}
                                title={value.title}
                                location={value.location} />
                        ))}
                    </Grid>
                </Paper>
                <EventPreview data={this.getStateEventItem()} open={this.state.showPreview} onClose={this.handleToggleChange('showPreview')}/>
            </Fragment>
        );
    }
}

EventAdministrator.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles, {withTheme: true})(EventAdministrator);
