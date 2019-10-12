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
//mport ButtonBase from '@material-ui/core/ButtonBase';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
//import IconButton from '@material-ui/core/IconButton';

// Project Components
import TextEditor from '../../../components/inputs/TextEditor';
import Dialog from '../../../components/navigation/Dialog';
import EventPreview from './EventPreview';
import EventSidebar from './EventSidebar';
import EventParticipants from './EventParticipants';

const SIDEBAR_WIDTH = 300;

const styles = (theme) => ({
    root: {
        paddingLeft: SIDEBAR_WIDTH,
        paddingBottom: 100,
        '@media only screen and (max-width: 800px)': {
            padding: 0,
        }
    },
    field: {
        margin: '5px 0px',
        maxWidth: 300,
    },
    content: {
        width: '80%',
        maxWidth: 1100,
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
            <Typography className={classes.margin} variant='h5' align='center'>{props.title}</Typography>
            <Button className={classes.margin} variant='contained' color='primary' onClick={props.onClick}>{props.buttonText}</Button>
        </Grid>
    )
});

const priorities = ['Lav', 'Middels', 'Høy'];
const eventCreated = 'Arrangementet ble opprettet';
const eventChanged = 'Endringen ble publisert';
const eventDeleted = 'Arrangementet ble slettet';
const userRemoved = 'Bruker ble fjernet fra arrangementet';
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
            categories: [],
            selectedEvent: null,

            title: '',
            location: '',
            startDate: new Date().toISOString(),
            description: '',
            sign_up: false,
            priority: 0,
            image: '',
            category: 0,
            limit: 0,
            participants: [],
            userEvent: false,
            // imageAlt: '',

            showMessage: false,
            showDialog: false,
            errorMessage: 'Det oppstod en feil',
            showSuccessMessage: false,
            successMessage: eventCreated,
            showPreview: false,
            showParticipants: false,
        };
    }

    componentDidMount() {

        // Get all categories
        EventService.getCategories()
        .then((data) => {
            if(data) {
                this.setState({categories: data});
            }
        });

        // Get all events
        this.fetchEvents()

    }

    fetchEvents = (parameters = {page: 1}) => {
      // We need to add this in order to noe show expired events.
      parameters['newest'] = true

      EventService.getEvents(parameters)
      .then((data) => {

        // For backward compabillity
        let displayedEvents = data.results || data;

        let nextPageUrl = data.next;
        let urlParameters = {};

        // If we have a url for the next page convert it into a object
        if (nextPageUrl) {
          let nextPageUrlQuery = nextPageUrl.substring(nextPageUrl.indexOf('?') + 1);
          let parameterArray = nextPageUrlQuery.split('&');
          parameterArray.forEach((parameter) => {
            const parameterString = parameter.split('=')
            urlParameters[parameterString[0]] = parameterString[1]
          })
        }

        // Get the page number from the object if it exists
        let nextPage = urlParameters['page'] ? urlParameters['page'] : null;

        this.setState((oldState) => {
          // If we allready have events
          if (this.state.events.length > 0) {
            displayedEvents = oldState.events.concat(displayedEvents)
          }
          return {events: displayedEvents, nextPage: nextPage}
        }
        );

      })
    }

    fetchExpired = () => {

        if(this.state.isFetching) {
            return;
        }

        this.setState({isFetching: false});
        EventService.getExpiredData((isError, data) => {

            if (!isError) {
                this.setState({expired: data.results || data || []});
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
                startDate: event.start.substring(0,16),
                sign_up: event.sign_up,
                limit: event.limit,
                participants: [],
            });
        }
        this.setState({showSuccessMessage: false});

        // Fetch participants
        EventService.getEventParticipants(event.id).then((result) => {
          this.setState({participants: result})
        });
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
            category: 0,
            startDate: new Date().toISOString().substring(0, 16),
            sign_up: false,
            participants: [],
            showParticipants: false,
        });
    }

    handleChange = (name) => (event) => {
      event.persist();
      if (event.target.type === 'checkbox'){
        this.setState({[name]: event.target.checked});
      } else {
        this.setState({[name]: event.target.value});
      }

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
        start: moment(this.state.startDate).format('YYYY-MM-DDTHH:mm'),
        sign_up: this.state.sign_up,
        limit: this.state.limit,
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

        // Edit event
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

    removeUserFromEvent = () => {
      const {user_id, event} = this.state.userEvent;
      EventService.deleteUserFromEventList(event.id, {user_id: user_id}).then((result) => {
        this.setState((oldState) => {
          const newParticipants = oldState.participants.filter((user) => {
            if (user.user_id !== user_id) return user
          });
          return {
            participants: newParticipants,
            showSuccessMessage: true,
            successMessage: userRemoved

          };
        });
      }).catch((error) => {
        this.setState({showMessage: true, snackMessage: errorMessage(error)});
      })
      this.setState({showDialog: false});
    }

    confirmRemoveUserFromEvent = (user_id, event) => {
      this.setState({showDialog: true, userEvent: {user_id: user_id, event: event}});
    }

    getNextPage = () => {
      this.fetchEvents({page: this.state.nextPage})
    }

    render() {
        const {classes} = this.props;
        const {selectedEvent, title, location, description, image, priority, categories, category, sign_up, showParticipants, limit, participants} = this.state;
        const selectedEventId = (selectedEvent)? selectedEvent.id : '';
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

                    <Dialog
                      onClose={() => this.setState({showDialog: false, userEvent: false})}
                      status={this.state.showDialog}
                      title='Bekreft sletting'
                      message={'Er du sikker på at du vil fjerne denne brukeren fra dette arrangementet?'}
                      submitText={'Slett'}
                      onSubmit={this.removeUserFromEvent} />

                    <Paper className={classes.content} square>
                      {showParticipants ?
                        <EventParticipants removeUserFromEvent={this.confirmRemoveUserFromEvent} participants={participants} event={selectedEvent} closeParticipants={this.handleToggleChange('showParticipants')} />
                        :
                      <React.Fragment>
                          {(this.state.isLoading)? <Grid className={classes.progress} container justify='center' alignItems='center'><CircularProgress /></Grid> :
                          (this.state.showSuccessMessage)? <MessageView title={this.state.successMessage} buttonText='Nice' onClick={this.toggleSuccessView}/> :
                              <form>
                                  <Grid container direction='column' wrap='nowrap'>
                                      <Typography variant='h5'>{header}</Typography>
                                      <TextField className={classes.field} label='Tittel' value={title} onChange={this.handleChange('title')} required/>
                                      <TextField className={classes.field} label='Sted' value={location} onChange={this.handleChange('location')} required/>
                                      <TextField className={classes.field} label='Antall plasser' value={limit} onChange={this.handleChange('limit')} required/>
                                      <FormControlLabel
                                        control={
                                          <Checkbox onChange={this.handleChange('sign_up')} checked={sign_up} />
                                        }
                                        label="Åpen for påmelding"/>

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

                                          <TextField className={classes.margin} fullWidth type='datetime-local' pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" label='Start dato' value={this.state.startDate} onChange={this.handleChange('startDate')} />
                                      </div>

                                      <Grid container direction='row' wrap='nowrap' justify='space-between'>
                                          {(isNewItem)?
                                              <div>
                                                  <Button className={classes.mr} onClick={this.createNewEvent} type='submit' variant='contained' color='primary'>Lag nytt event</Button>
                                                  <Button variant='outlined' color='primary' onClick={this.handleToggleChange('showPreview')}>Preview</Button>
                                              </div>

                                              :
                                              <Fragment>
                                                  <div>
                                                      <Button className={classes.mr} onClick={this.editEventItem} variant='contained' type='submit' color='primary'>Lagre</Button>
                                                      <Button className={classes.mr} variant='outlined' color='primary' onClick={this.handleToggleChange('showPreview')}>Preview</Button>
                                                      <Button variant='outlined' color='primary' onClick={this.handleToggleChange('showParticipants')}>Se påmeldte</Button>
                                                  </div>
                                                  <Button className={classes.deleteButton} onClick={this.deleteEventItem} variant='outlined'>Slett</Button>
                                              </Fragment>
                                          }
                                      </Grid>
                                  </Grid>
                              </form>
                          }
                      </React.Fragment>
                    }
                    </Paper>

                </div>
                <EventSidebar
                    events={this.state.events}
                    expiredEvents={this.state.expired}
                    selectedEventId={selectedEventId}
                    onEventClick={this.onEventClick}
                    resetEventState={this.resetEventState}
                    fetchExpired={this.fetchExpired}
                    nextPage={this.state.nextPage}
                    getNextPage={this.getNextPage}
                />
                <EventPreview data={this.getStateEventItem()} open={this.state.showPreview} onClose={this.handleToggleChange('showPreview')}/>
            </Fragment>
        );
    }
}

EventAdministrator.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles, {withTheme: true})(EventAdministrator);
