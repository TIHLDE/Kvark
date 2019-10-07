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
        }
    }

    // Gets the event
    loadEvent = () => {

        // Get eventItem id
        const id = this.props.match.params.id;

        // Load event item
        this.setState({isLoading: true});
        EventService.getEventById(id)
        .then((event) => {
            if(!event) {
                this.props.history.replace('/'); // Redirect to landing page given id is invalid
            } else {
                this.setState({isLoading: false, event: event});
            }
        });
    };

    // Gets the user data
    loadUserData = () => {
      if (AuthService.isAuthenticated()) {
        UserService.getUserData().then((userData) => {
          if (userData) {
            this.setState({user: userData});
          }
        });
      }

    }

    applyToEvent = () => {
      const {event, user} = this.state;
      EventService.putUserOnEventList(event.id,user).then((result) => {
      }).catch(() => {
        console.log('Nope.avi')
        alert('Kunne ikke melde opp til dette arrangementet!');
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
        const {event, user} = this.state;
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
                              applyToEvent={this.applyToEvent} />
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
