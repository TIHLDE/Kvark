import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Service imports
import EventService from '../../api/services/EventService';
import UserService from  '../../api/services/UserService';
import AuthService from '../../api/services/AuthService';

// Project components
import Navigation from '../../components/navigation/Navigation';
import EventRenderer from './components/EventRenderer';

const styles = {
    root:{
        minHeight: '90vh',

    },
    wrapper:{
        maxWidth: 1200,
        margin: 'auto',
        padding: '20px 48px 48px 48px',

        '@media only screen and (max-width: 1200px)': {
            padding: '12px 0px 48px 0px',
        }
    },
};


class EventDetails extends Component {
    constructor(props){
        super(props);
        this.state = {
            event: null,
            isLoading: false,
            userData: null,
            userEvent: null,
            userEventLoaded: false,
            isLoadingUserData: false,
            isApplying: false,
            message: '',
            applySuccess: false,
        }
    }

    loadUserEvent = (prevState) => {
      const {event, user} = prevState
      EventService.getUserEventObject(event.id, user).then((result) => {
          this.setState({userEvent: result});
      }).catch(() => {
          // Actions performed if the user is not attending the event
      }).then(() => {
          this.setState({userEventLoaded: true});
      })
    }

    // Gets the event
    loadEvent = () => {

        // Get eventItem id
        const id = this.props.match.params.id;

        // Load event item
        this.setState({isLoading: true});
        EventService.getEventById(id)
        .then(async (event) => {
            if(!event) {
                this.props.history.replace('/'); // Redirect to landing page given id is invalid
            } else {
                this.setState({isLoading: false, event: {...event}});
            }
        });
    };

    // Gets the user data
    loadUserData = () => {
      if (AuthService.isAuthenticated()) {
        this.setState({isLoadingUserData: true});
        UserService.getUserData().then((userData) => {

          if (userData) {
            this.setState({user: userData});
          }
          this.setState({isLoadingUserData: false});
        });
      }

    }

    applyToEvent = () => {
      const {event, user, userEvent} = this.state;
      this.setState({isApplying: true});
      if (!userEvent) {
        // Apply to event
        return EventService.putUserOnEventList(event.id, user).then((result) => {
          this.setState((oldState) => {
            let newEvent = oldState.event;
            if (newEvent.limit <= newEvent.list_count) {
              newEvent.waiting_list_count++;
            } else {
              newEvent.list_count++;
            }
            user.events.push(newEvent);
            UserService.updateUserEvents(user.events);
            return {
                message: 'Påmelding registrert!',
                event: newEvent,
                applySuccess: true,
                userEventLoaded: false
            }
          });
        }).catch(() => {
          this.setState({message: 'Kunne ikke registrere påmelding.', applySuccess: false});
        }).then(() => {
          this.setState({isApplying: false});
        })

      } else {
        // The reverse
        return EventService.deleteUserFromEventList(event.id, user).then((result) => {
          this.setState((oldState) => {
            let newEvent = oldState.event;
            if (userEvent.is_on_wait) {
              newEvent.waiting_list_count--;
            } else {
              newEvent.list_count--;
            }
            for (var i = 0; i < user.events.length; i++){ 
              if (user.events[i].id === newEvent.id) {
                user.events.splice(i, 1); 
              }
            }
            UserService.updateUserEvents(user.events);
            return {
                message: 'Avmelding registrert 😢',
                event: newEvent,
                applySuccess: true,
                userEvent: null,
                userEventLoaded: false
            }
          })
        }).catch(() => {
          this.setState({message: 'Kunne ikke registrere påmelding.', applySuccess: false});
        }).then(() => {
          this.setState({isApplying: false});
        });
      }
    }

    // Clear the message
    clearMessage = () => {
      this.setState({message: ''});
    }

    componentDidMount(){
        window.scrollTo(0,0);
        //get data here
        this.loadEvent();
        this.loadUserData();
    }

    componentDidUpdate(prevProps, prevState) {
        const {event, userEventLoaded, user} = prevState;
        if (!userEventLoaded && event && user){
          console.log(prevState)
          this.loadUserEvent(prevState);
        }

    }

    render() {
        const {classes} = this.props;
        const {
          event,
          user,
          isLoadingUserData,
          isLoading,
          isApplying,
          message,
          applySuccess,
          userEvent,
          userEventLoaded,
        } = this.state;
        const eventData = event || {};
        const userData = user;

        return (
            <Navigation isLoading={this.state.isLoading} footer whitesmoke>
                {(this.state.isLoading)? null :
                    <div className={classes.root}>
                        <div className={classes.wrapper}>
                            <EventRenderer
                              data={eventData}
                              userData={userData}
                              userEvent={userEvent}
                              userEventLoaded={userEventLoaded}
                              history={this.props.history}
                              applyToEvent={this.applyToEvent}
                              isLoadingUserData={isLoadingUserData}
                              isLoadingEvent={isLoading}
                              isApplying={isApplying}
                              message={message}
                              applySuccess={applySuccess}
                              clearMessage={this.clearMessage} />
                        </div>
                    </div>
                }
            </Navigation>
        );
    }
}


EventDetails.propTypes = {
    classes: PropTypes.object,
    match: PropTypes.object,
    grid: PropTypes.object,
};

EventDetails.defaultProps = {
    id: '-1',
};

export default (withStyles(styles)(EventDetails));
