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
            isLoadingUserData: false,
            isApplying: false,
            message: '',
            applySuccess: false,
        }
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
                // Get the number of participants
                let participantsCount = await EventService.getEventParticipants(id)
                .catch((error) => {
                  return error;
                });

                // Set to 0 if we have noe valid data.
                if (participantsCount.length === undefined) {
                  participantsCount = 0
                } else {
                  participantsCount = participantsCount.length
                }

                // Update state
                this.setState({isLoading: false, event: {...event, participantsCount: participantsCount}});
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
      const {event, user, applySuccess} = this.state;
      this.setState({isApplying: true});
      return EventService.putUserOnEventList(event.id,user).then((result) => {
        this.setState((oldState) => {
          let newEvent = oldState.event;
          newEvent.participantsCount++;
          return {message: 'Påmelding registrert!', event: newEvent, applySuccess: true}
        });
      }).catch(() => {
        this.setState({message: 'Kunne ikke registrere påmelding.', applySuccess: false});
      }).then(() => {
        this.setState({isApplying: false});
      })
    }

    componentDidMount(){
        window.scrollTo(0,0);
        //get data here
        this.loadEvent();
        this.loadUserData();
    }

    render() {
        const {classes} = this.props;
        const {event, user, isLoadingUserData, isApplying, message, applySuccess} = this.state;
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
                              history={this.props.history}
                              applyToEvent={this.applyToEvent}
                              isLoadingUserData={isLoadingUserData}
                              isApplying={isApplying}
                              message={message}
                              applySuccess={applySuccess} />
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
