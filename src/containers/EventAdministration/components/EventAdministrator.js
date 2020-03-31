import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import Link from 'react-router-dom/Link';
import URLS from '../../../URLS';
import { getUserStudyShort } from '../../../utils';

// API imports
import EventService from '../../../api/services/EventService';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
            margin: 10,
            marginTop: 70,
        },
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: '#fff',
    },
    margin: {
        margin: '10px 0px',
    },
    mr: {
        marginRight: 10,
        marginBottom: 5,
        flexGrow: 1,
    },
    link: {
        textDecoration: 'none',
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
    },
    expansionPanel: {
        width: '100%',
        boxShadow: '0px 2px 4px #ddd',
    },
    formWrapper: {
        width: '100%',
    },
    formGroup: {
        padding: '10px 0',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        flexWrap: 'nowrap',
        '@media only screen and (max-width: 800px)': {
            gridTemplateColumns: '1fr',
        },
    },
    formGroupSmall: {
        padding: '10px 0',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
    },
    chipYes: {
        color: '#ffffff',
        backgroundColor: '#0b7c0b',
        borderColor: '#0b7c0b',
        '&:hover': {
            color: '#ffffff',
            backgroundColor: '#0b7c0b',
            borderColor: '#0b7c0b',
        },
    },
    chipNo: {
        color: '#b20101',
        borderColor: '#b20101',
        '&:hover': {
            color: '#b20101',
            borderColor: '#b20101',
        },
    },
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
            startDate: new Date().toISOString().substring(0, 16),
            endDate: new Date().toISOString().substring(0, 16),
            startSignUp: new Date().toISOString().substring(0, 16),
            endSignUp: new Date().toISOString().substring(0, 16),
            signOffDeadline: new Date().toISOString().substring(0, 16),
            description: '',
            evaluate_link: '',
            sign_up: false,
            priority: 0,
            registration_priorities: [{"user_class":1,"user_study":1},{"user_class":1,"user_study":2},{"user_class":1,"user_study":3},{"user_class":1,"user_study":5},{"user_class":2,"user_study":1},{"user_class":2,"user_study":2},{"user_class":2,"user_study":3},{"user_class":2,"user_study":5},{"user_class":3,"user_study":1},{"user_class":3,"user_study":2},{"user_class":3,"user_study":3},{"user_class":3,"user_study":5},{"user_class":4,"user_study":4},{"user_class":5,"user_study":4}],
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
                evaluate_link: event.evaluate_link,
                priority: event.priority,
                registration_priorities: event.registration_priorities,
                image: event.image,
                category: event.category,
                startDate: event.start_date.substring(0,16),
                endDate: event.end_date.substring(0,16),
                startSignUp: event.start_registration_at.substring(0,16),
                endSignUp: event.end_registration_at.substring(0,16),
                signOffDeadline: event.sign_off_deadline.substring(0,16),
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
            evaluate_link: '',
            priority: 0,
            registration_priorities: [{"user_class":1,"user_study":1},{"user_class":1,"user_study":2},{"user_class":1,"user_study":3},{"user_class":1,"user_study":5},{"user_class":2,"user_study":1},{"user_class":2,"user_study":2},{"user_class":2,"user_study":3},{"user_class":2,"user_study":5},{"user_class":3,"user_study":1},{"user_class":3,"user_study":2},{"user_class":3,"user_study":3},{"user_class":3,"user_study":5},{"user_class":4,"user_study":4},{"user_class":5,"user_study":4}],
            image: '',
            imageAlt: '',
            category: 0,
            startDate: new Date().toISOString().substring(0, 16),
            endDate: new Date().toISOString().substring(0, 16),
            startSignUp: new Date().toISOString().substring(0, 16),
            endSignUp: new Date().toISOString().substring(0, 16),
            signOffDeadline: new Date().toISOString().substring(0, 16),
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

    handlePriorityChange = (user_class, user_study) => () => {
        if (this.state.registration_priorities.some((item) => item.user_class === user_class && item.user_study === user_study)) {
            let index = this.state.registration_priorities.findIndex((item) => item.user_class === user_class && item.user_study === user_study);
            let newArray = this.state.registration_priorities;
            newArray.splice(index, 1);
            this.setState({registration_priorities: newArray});
        } else {
            let newArray = this.state.registration_priorities;
            newArray.push({"user_class": user_class, "user_study": user_study});
            this.setState({registration_priorities: newArray});
        }
    }
    toggleAllPriorities = (addAll) => () => {
        if (addAll) {
            this.setState({registration_priorities: [{"user_class":1,"user_study":1},{"user_class":1,"user_study":2},{"user_class":1,"user_study":3},{"user_class":1,"user_study":5},{"user_class":2,"user_study":1},{"user_class":2,"user_study":2},{"user_class":2,"user_study":3},{"user_class":2,"user_study":5},{"user_class":3,"user_study":1},{"user_class":3,"user_study":2},{"user_class":3,"user_study":3},{"user_class":3,"user_study":5},{"user_class":4,"user_study":4},{"user_class":5,"user_study":4}]});
        } else {
            this.setState({registration_priorities: []});
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
        evaluate_link: this.state.evaluate_link,
        priority: this.state.priority,
        registration_priorities: this.state.registration_priorities,
        image: this.state.image,
        imageAlt: 'event',
        category: this.state.category,
        start_date: moment(this.state.startDate).format('YYYY-MM-DDTHH:mm'),
        end_date: moment(this.state.endDate).format('YYYY-MM-DDTHH:mm'),
        start_registration_at: moment(this.state.startSignUp).format('YYYY-MM-DDTHH:mm'),
        end_registration_at: moment(this.state.endSignUp).format('YYYY-MM-DDTHH:mm'),
        sign_off_deadline: moment(this.state.signOffDeadline).format('YYYY-MM-DDTHH:mm'),
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
                    newEvents[index] = {id: selectedEvent.id, ...item};
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
            if (user.user_info.user_id !== user_id) return user

            return false
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

    toggleUserEvent = (user_id, event, parameters) => {
      EventService.updateUserEvent(event.id, {user_id: user_id, ...parameters}).then((data) => {
        this.setState((oldState) => {
          // Change the state to reflect the database data.
          const newParticipants = oldState.participants.map((user) => {
            let newUser = user;
            if (user.user_info.user_id === user_id) {
              newUser = {...newUser, ...parameters};
            }
            return newUser;
          })
          return {participants: newParticipants};
        })
      }).catch((error) => {
        this.setState({showMessage: true, snackMessage: errorMessage(error)});
      })
    }

    closeEvent = () => {
      const {selectedEvent} = this.state;
      EventService.putEvent(selectedEvent.id, {closed: true}).then(() => {
        this.setState((oldState) => {
          let newEvent = oldState.selectedEvent;
          newEvent.closed = true;
          return {selectedEvent: newEvent};
        });
      });
    }

    confirmRemoveUserFromEvent = (user_id, event) => {
      this.setState({showDialog: true, userEvent: {user_id: user_id, event: event}});
    }

    getNextPage = () => {
      this.fetchEvents({page: this.state.nextPage})
    }

    render() {
        const {classes} = this.props;
        const {selectedEvent, title, location, description, evaluate_link, image, priority, registration_priorities, categories, category, sign_up, showParticipants, limit, participants} = this.state;

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

                    <div className={classes.content}>
                      {showParticipants ?
                        <EventParticipants
                          removeUserFromEvent={this.confirmRemoveUserFromEvent}
                          participants={participants}
                          event={selectedEvent}
                          closeParticipants={this.handleToggleChange('showParticipants')}
                          toggleUserEvent={this.toggleUserEvent} />
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
                                      {sign_up && <div className={classes.flexRow}>
                                          <TextField className={classes.margin} fullWidth type='datetime-local' pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" label='Start påmelding' value={this.state.startSignUp} onChange={this.handleChange('startSignUp')} />
                                          <TextField className={classes.margin} fullWidth type='datetime-local' pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" label='Slutt påmelding' value={this.state.endSignUp} onChange={this.handleChange('endSignUp')} />
                                          <TextField className={classes.margin} fullWidth type='datetime-local' pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" label='Avmeldingsfrist' value={this.state.signOffDeadline} onChange={this.handleChange('signOffDeadline')} />
                                      </div>}
                                      {sign_up && <div className={classes.flexRow}>
                                          <TextField className={classes.margin} fullWidth label='Link til evalueringsundersøkelse' value={evaluate_link} onChange={this.handleChange('evaluate_link')}/>
                                      </div>}
                                      {sign_up && registration_priorities &&
                                      <div className={classes.flexRow}>
                                        <ExpansionPanel className={classes.expansionPanel}>
                                            <ExpansionPanelSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="priorities"
                                                id="priorities-header"
                                            >
                                                <Typography className={classes.heading}>Prioriterte</Typography>
                                            </ExpansionPanelSummary>
                                            <ExpansionPanelDetails>
                                                <div className={classes.formWrapper}>
                                                    <FormGroup className={classes.formGrou}>
                                                        {[1,2,3,5].map((user_study) => {
                                                            return (
                                                                <React.Fragment key={user_study}>
                                                                    <FormLabel component="legend">{getUserStudyShort(user_study)}</FormLabel>
                                                                    <FormGroup className={classes.formGroup} key={user_study}>
                                                                        {[1,2,3].map((user_class) => {
                                                                        return (
                                                                            <Button
                                                                                key={user_class}
                                                                                className={classes.mr}
                                                                                classes={registration_priorities.some((item) => item.user_class === user_class && item.user_study === user_study) ? {outlinedPrimary:classes.chipYes} : {outlinedPrimary:classes.chipNo}}
                                                                                variant='outlined'
                                                                                color='primary'
                                                                                onClick={this.handlePriorityChange(user_class, user_study)}>
                                                                                {user_class + '. ' + getUserStudyShort(user_study)}
                                                                            </Button>
                                                                        );
                                                                        })}
                                                                    </FormGroup>
                                                                </React.Fragment>
                                                            )
                                                        })}
                                                        <FormLabel component="legend">{getUserStudyShort(4)}</FormLabel>
                                                            <FormGroup className={classes.formGroup}>
                                                            <Button
                                                                className={classes.mr}
                                                                classes={registration_priorities.some((item) => item.user_class === 4 && item.user_study === 4) ? {outlinedPrimary:classes.chipYes} : {outlinedPrimary:classes.chipNo}}
                                                                variant='outlined'
                                                                color='primary'
                                                                onClick={this.handlePriorityChange(4, 4)}>
                                                                {4 + '. ' + getUserStudyShort(4)}
                                                            </Button>
                                                            <Button
                                                                className={classes.mr}
                                                                classes={registration_priorities.some((item) => item.user_class === 5 && item.user_study === 4) ? {outlinedPrimary:classes.chipYes} : {outlinedPrimary:classes.chipNo}}
                                                                variant='outlined'
                                                                color='primary'
                                                                onClick={this.handlePriorityChange(5, 4)}>
                                                                {5 + '. ' + getUserStudyShort(4)}
                                                            </Button>
                                                        </FormGroup>
                                                    </FormGroup>
                                                    <FormGroup className={classes.formGroupSmall}>
                                                        <Button className={classes.mr} variant='outlined' color='primary' onClick={this.toggleAllPriorities(true)}>Alle</Button>
                                                        <Button className={classes.mr} variant='outlined' color='primary' onClick={this.toggleAllPriorities(false)}>Ingen</Button>
                                                    </FormGroup>
                                                </div>
                                            </ExpansionPanelDetails>
                                        </ExpansionPanel>
                                      </div>}

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
                                      </div>
                                      <div className={classes.flexRow}>
                                          <TextField className={classes.margin} fullWidth type='datetime-local' pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" label='Start dato' value={this.state.startDate} onChange={this.handleChange('startDate')} />
                                          <TextField className={classes.margin} fullWidth type='datetime-local' pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" label='Slutt dato' value={this.state.endDate} onChange={this.handleChange('endDate')} />
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
                                                      <Button className={classes.mr} variant='outlined' color='primary' onClick={this.handleToggleChange('showParticipants')}>Se påmeldte</Button>
                                                      <Link to={URLS.events.concat(selectedEventId).concat('/registrering/')} className={classes.link}><Button className={classes.mr} variant='outlined' color='primary'>Registrer ankomne</Button></Link>
                                                  </div>
                                                  <div>
                                                      <Button disabled={selectedEvent.closed && true} className={classNames(classes.mr, classes.deleteButton)} onClick={this.closeEvent} variant='outlined'>Steng</Button>
                                                      <Button className={classNames(classes.mr, classes.deleteButton)} onClick={this.deleteEventItem} variant='outlined'>Slett</Button>
                                                  </div>
                                              </Fragment>
                                          }
                                      </Grid>
                                  </Grid>
                              </form>
                          }
                      </React.Fragment>
                    }
                    </div>

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
