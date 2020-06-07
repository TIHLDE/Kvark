import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import URLS from '../../URLS';

// API and store imports
import EventService from '../../api/services/EventService';

// Material-UI
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

// Project components
import Paper from '../../components/layout/Paper';
import Navigation from '../../components/navigation/Navigation';
import SidebarList from '../../components/layout/SidebarList';
import DropdownButton from '../../components/miscellaneous/DropdownButton';
import EventRenderer from '../EventDetails/components/EventRenderer';
import EventEditor from './components/EventEditor';
import EventParticipants from './components/EventParticipants';

const SIDEBAR_WIDTH = 300;

const styles = (theme) => ({
  root: {
    paddingLeft: SIDEBAR_WIDTH,
    paddingBottom: 50,
    '@media only screen and (max-width: 800px)': {
      padding: 0,
    },
  },
  content: {
    width: '80%',
    maxWidth: 1100,
    marginTop: 50,
    display: 'block',
    margin: 'auto',

    '@media only screen and (max-width: 800px)': {
      width: 'auto',
      margin: 10,
      padding: '36px 20px',
    },
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  snackbar: {
    marginTop: 55,
    backgroundColor: theme.colors.background.smoke,
    color: theme.colors.text.main,
  },
  header: {
    color: theme.colors.text.main,
  },
});

const defaultEvent = {
  title: null,
  location: null,
  start_date: new Date().toISOString().substring(0, 16),
  end_date: new Date().toISOString().substring(0, 16),
  sign_up: false,
  limit: 0,
  start_registration_at: new Date().toISOString().substring(0, 16),
  end_registration_at: new Date().toISOString().substring(0, 16),
  sign_off_deadline: new Date().toISOString().substring(0, 16),
  registration_priorities: [{'user_class': 1, 'user_study': 1}, {'user_class': 1, 'user_study': 2}, {'user_class': 1, 'user_study': 3}, {'user_class': 1, 'user_study': 5}, {'user_class': 2, 'user_study': 1}, {'user_class': 2, 'user_study': 2}, {'user_class': 2, 'user_study': 3}, {'user_class': 2, 'user_study': 5}, {'user_class': 3, 'user_study': 1}, {'user_class': 3, 'user_study': 2}, {'user_class': 3, 'user_study': 3}, {'user_class': 3, 'user_study': 5}, {'user_class': 4, 'user_study': 4}, {'user_class': 5, 'user_study': 4}],
  optional_fields: [],
  description: null,
  image: null,
  image_alt: null,
  priority: 0,
  category: '',
  closed: false,
};

function EventAdministration(props) {
  const {classes, history} = props;

  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(defaultEvent);
  const [expiredItems, setExpiredItems] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Gets the job posts
  const loadEvents = (parameters = {page: 1}) => {
    parameters['newest'] = true;
    setIsLoading(true);

    // Fetch job posts from server
    EventService.getEvents(parameters)
        .then((data) => {
          setEvents([...events, ...data.results]);
          const nextPageUrl = data.next;
          const urlParameters = {};

          // If we have a url for the next page convert it into a object
          if (nextPageUrl) {
            const nextPageUrlQuery = nextPageUrl.substring(nextPageUrl.indexOf('?') + 1);
            const parameterArray = nextPageUrlQuery.split('&');
            parameterArray.forEach((parameter) => {
              const parameterString = parameter.split('=');
              urlParameters[parameterString[0]] = parameterString[1];
            });
          }
          setNextPage(urlParameters['page'] ? Number(urlParameters['page']) : null);
          setIsLoading(false);
        });
  };

  const saveEvent = () => {
    if (selectedEvent.id) {
      EventService.putEvent(selectedEvent.id, selectedEvent)
          .then((data) => {
            setEvents((events) => events.map((eventItem) => {
              let returnValue = {...eventItem};
              if (eventItem.id === selectedEvent.id) {
                returnValue = selectedEvent;
              }
              return returnValue;
            }));
            openSnackbar('Arrangementet ble oppdatert');
          })
          .catch((e) => openSnackbar(JSON.stringify(e)));
    } else {
      EventService.createNewEvent(selectedEvent)
          .then((data) => {
            const newEvent = {...selectedEvent, id: data.id};
            setEvents((events) => [...events, newEvent]);
            setSelectedEvent(newEvent);
            openSnackbar('Arrangementet ble opprettet');
          })
          .catch((e) => openSnackbar(JSON.stringify(e)));
    }
  };

  const deleteEvent = () => {
    if (selectedEvent.id) {
      EventService.deleteEvent(selectedEvent.id)
          .then((data) => {
            setEvents((events) => events.filter((eventItem) => eventItem.id !== selectedEvent.id));
            setSelectedEvent(defaultEvent);
            openSnackbar('Arrangementet ble slettet');
          })
          .catch((e) => openSnackbar(JSON.stringify(e)));
    } else {
      openSnackbar('Du kan ikke slette et arrangement som ikke er opprettet');
    }
  };

  const closeEvent = () => {
    if (selectedEvent.id) {
      EventService.putEvent(selectedEvent.id, {closed: true}).then(() => {
        setSelectedEvent({...selectedEvent, closed: true});
        openSnackbar('Arrangementet ble stengt');
      });
    } else {
      openSnackbar('Du kan ikke stenge et arrangement som ikke er opprettet');
    }
  };

  const fetchExpired = () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    EventService.getExpiredData((isError, data) => {
      if (!isError) {
        setExpiredItems(data.results || data || []);
      }
      setIsLoading(false);
    });
  };

  const getNextPage = () => {
    loadEvents({page: nextPage});
  };

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
  };

  const goToRegistration = () => {
    if (selectedEvent.id) {
      history.push(URLS.events.concat(selectedEvent.id).concat('/registrering/'));
    } else {
      openSnackbar('Du kan ikke registrere ankomne før arrangementet er opprettet');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadEvents();
    EventService.getCategories()
        .then((data) => {
          if (data) {
            setCategories(data);
          }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = [{text: 'Lagre', func: () => saveEvent()}, {text: 'Registrer ankomne', func: () => goToRegistration()}, {text: 'Steng', func: () => closeEvent()}, {text: 'Slett', func: () => deleteEvent()}];

  return (
    <Navigation whitesmoke>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={() => setShowSnackbar(false)}>

        <SnackbarContent
          className={classes.snackbar}
          message={snackbarMessage}/>
      </Snackbar>
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.top}>
            <Typography className={classes.header} variant='h4'>{selectedEvent.id ? 'Endre arrangement' : 'Nytt arrangement'}</Typography>
            <DropdownButton options={options} />
          </div>
          <Tabs
            value={tab}
            indicatorColor='primary'
            textColor='primary'
            onChange={(e, newTab) => setTab(newTab)}
            aria-label='tabs'
          >
            <Tab id='0' label={selectedEvent.id ? 'Endre' : 'Skriv'} />
            <Tab id='1' label='Deltagere' />
            <Tab id='2' label='Forhåndsvis' />
          </Tabs>
          <Paper noPadding >
            {tab === 0 && <EventEditor event={selectedEvent} setEvent={(item) => setSelectedEvent(item)} categories={categories} />}
            {tab === 1 && <EventParticipants event={selectedEvent} openSnackbar={openSnackbar} />}
            {tab === 2 && <EventRenderer eventData={selectedEvent} preview />}
          </Paper>
        </div>
      </div>
      <SidebarList
        items={events}
        selectedItemId={selectedEvent?.id || null}
        onItemClick={(item) => setSelectedEvent(item || defaultEvent)}
        expiredItems={expiredItems}
        fetchExpired={fetchExpired}
        getNextPage={getNextPage}
        nextPage={nextPage}
        title='Arrangementer'
        isLoading={isLoading}
        width={SIDEBAR_WIDTH}
      />
    </Navigation>
  );
}

EventAdministration.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object,
};

export default withStyles(styles)(EventAdministration);
