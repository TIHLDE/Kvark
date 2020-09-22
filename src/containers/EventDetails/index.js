import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import URLS from '../../URLS';
import { usePalette } from 'react-palette';
import Helmet from 'react-helmet';
import { useParams, useHistory } from 'react-router-dom';
import { urlEncode } from '../../utils';

// Service imports
import EventService from '../../api/services/EventService';
import UserService from '../../api/services/UserService';
import AuthService from '../../api/services/AuthService';

// Project components
import Navigation from '../../components/navigation/Navigation';
import EventRenderer from './components/EventRenderer';
import TIHLDELOGO from '../../assets/img/TihldeBackgroundNew.png';

const styles = (theme) => ({
  root: {
    minHeight: '90vh',
  },
  wrapper: {
    maxWidth: 1100,
    margin: 'auto',
    padding: '60px 48px 48px 48px',
    position: 'relative',
    color: theme.colors.text.main,
    '@media only screen and (max-width: 1000px)': {
      padding: '60px 0px 48px 0px',
    },
  },
  top: {
    position: 'absolute',
    width: '100%',
    overflow: 'hidden',

    '&::after': {
      position: 'absolute',
      bottom: 0,
      borderBottom: 'solid 150px ' + theme.colors.background.main,
      borderLeft: '100vw solid rgba(0,0,0,0)',
      content: '""',
    },
  },
  topInner: {
    height: 350,
    padding: 60,
    transition: '3s',
    background: theme.colors.gradient.main.top,
  },
});

function EventDetails(props) {
  const { classes } = props;
  const { id } = useParams();
  const history = useHistory();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userEvent, setUserEvent] = useState(null);
  const [userEventLoaded, setUserEventLoaded] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [message, setMessage] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  // Gets the event
  const loadEvent = () => {
    // Load event item
    setIsLoading(true);
    EventService.getEventById(id).then(async (event) => {
      if (!event) {
        history.replace(URLS.events); // Redirect to events page given if id is invalid
      } else {
        history.replace(URLS.events + id + '/' + urlEncode(event.title) + '/');
        setIsLoading(false);
        setEvent({ ...event });
      }
    });
  };

  // Gets the user data
  const loadUserData = () => {
    if (AuthService.isAuthenticated()) {
      setIsLoadingUserData(true);
      UserService.getUserData().then((userData) => {
        if (userData) {
          setUserData(userData);
        }
        setIsLoadingUserData(false);
      });
    }
  };

  const applyToEvent = (optionalFieldsAnswers, allowPhoto) => {
    setIsApplying(true);
    if (!userEvent) {
      // Apply to event
      return EventService.putUserOnEventList(event.id, userData, optionalFieldsAnswers, allowPhoto)
        .then((result) => {
          const newEvent = { ...event };
          if (newEvent.limit <= newEvent.list_count) {
            newEvent.waiting_list_count++;
          } else {
            newEvent.list_count++;
          }
          const newUserData = { ...userData };
          newUserData.events.push(newEvent);
          UserService.updateUserEvents(newUserData.events);
          setMessage('Påmelding registrert!');
          setEvent(newEvent);
          setApplySuccess(true);
          setUserEventLoaded(false);
        })
        .catch(() => {
          setMessage('Kunne ikke registrere påmelding.');
          setApplySuccess(false);
        })
        .then(() => {
          setIsApplying(false);
        });
    } else {
      // The reverse
      return EventService.deleteUserFromEventList(event.id, userData)
        .then((result) => {
          const newEvent = { ...event };
          if (userEvent.is_on_wait) {
            newEvent.waiting_list_count--;
          } else {
            newEvent.list_count--;
          }
          const newUserEvents = [...userData.events];
          for (let i = 0; i < newUserEvents.length; i++) {
            if (newUserEvents[i].id === newEvent.id) {
              newUserEvents.splice(i, 1);
            }
          }
          UserService.updateUserEvents(newUserEvents);
          setMessage('Avmelding registrert 😢');
          setEvent(newEvent);
          setApplySuccess(true);
          setUserEvent(null);
          setUserEventLoaded(false);
        })
        .catch(() => {
          setMessage('Kunne ikke registrere påmelding.');
          setApplySuccess(false);
        })
        .then(() => {
          setIsApplying(false);
        });
    }
  };

  // Clear the message
  const clearMessage = () => setMessage('');

  useEffect(() => {
    window.scrollTo(0, 0);
    loadEvent();
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!userEventLoaded && event && userData) {
      EventService.getUserEventObject(event.id, userData)
        .then((result) => {
          setUserEvent(result);
        })
        .finally(() => {
          setUserEventLoaded(true);
        });
    } else if (!userEventLoaded && event && !AuthService.isAuthenticated()) {
      setUserEventLoaded(true);
    }
  }, [event, userData, userEventLoaded]);

  // Find a dominant color in the image, uses a proxy to be able to retrieve images with CORS-policy until all images are stored in our own server
  const { data } = usePalette(
    event ? 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=' + encodeURIComponent(event?.image) : '',
  );

  return (
    <Navigation fancyNavbar footer isLoading={isLoading} whitesmoke>
      {!isLoading && event && (
        <div className={classes.root}>
          <Helmet>
            <title>{event.title} - TIHLDE</title>
            <meta content={event.title} property='og:title' />
            <meta content='website' property='og:type' />
            <meta content={window.location.href} property='og:url' />
            <meta content={event.image || 'https://tihlde.org' + TIHLDELOGO} property='og:image' />
          </Helmet>
          <div className={classes.top}>
            <div className={classes.topInner} style={{ background: data.muted ? data.muted : '' }}></div>
          </div>
          <div className={classes.wrapper}>
            <EventRenderer
              applySuccess={applySuccess}
              applyToEvent={applyToEvent}
              clearMessage={clearMessage}
              eventData={event}
              history={history}
              isApplying={isApplying}
              isLoadingEvent={isLoading}
              isLoadingUserData={isLoadingUserData}
              message={message}
              userData={userData}
              userEvent={userEvent}
              userEventLoaded={userEventLoaded}
            />
          </div>
        </div>
      )}
    </Navigation>
  );
}

EventDetails.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(EventDetails);
