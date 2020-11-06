import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import URLS from '../../URLS';
import Helmet from 'react-helmet';
import { useNavigate } from 'react-router-dom';

// API and store imports
import { useEvent } from '../../api/hooks/Event';
import { useMisc } from '../../api/hooks/Misc';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
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
      margin: 0,
      padding: theme.spacing(4, 2),
    },
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  snackbar: {
    marginTop: 55,
    backgroundColor: theme.palette.colors.background.smoke,
    color: theme.palette.colors.text.main,
  },
  header: {
    color: theme.palette.colors.text.main,
  },
  preview: {
    padding: theme.spacing(1),
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
  registration_priorities: [
    { user_class: 1, user_study: 1 },
    { user_class: 1, user_study: 2 },
    { user_class: 1, user_study: 3 },
    { user_class: 1, user_study: 5 },
    { user_class: 2, user_study: 1 },
    { user_class: 2, user_study: 2 },
    { user_class: 2, user_study: 3 },
    { user_class: 2, user_study: 5 },
    { user_class: 3, user_study: 1 },
    { user_class: 3, user_study: 2 },
    { user_class: 3, user_study: 3 },
    { user_class: 3, user_study: 5 },
    { user_class: 4, user_study: 4 },
    { user_class: 5, user_study: 4 },
  ],
  optional_fields: [],
  description: null,
  image: null,
  image_alt: null,
  priority: 0,
  category: '',
  closed: false,
};

function EventAdministration(props) {
  const { classes } = props;
  const navigate = useNavigate();
  const { getEvents, updateEvent, createEvent, deleteEvent, getExpiredEvents } = useEvent();
  const { getCategories } = useMisc();
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
  const loadEvents = (parameters = { page: 1 }) => {
    parameters['newest'] = true;
    setIsLoading(true);

    // Fetch job posts from server
    getEvents(parameters).then((data) => {
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
      updateEvent(selectedEvent.id, selectedEvent)
        .then((data) => {
          setEvents((events) =>
            events.map((eventItem) => {
              let returnValue = { ...eventItem };
              if (eventItem.id === data.id) {
                returnValue = data;
              }
              return returnValue;
            }),
          );
          openSnackbar('Arrangementet ble oppdatert');
        })
        .catch((e) => openSnackbar(e.detail));
    } else {
      createEvent(selectedEvent)
        .then((data) => {
          setEvents((events) => [...events, data]);
          setSelectedEvent(data);
          openSnackbar('Arrangementet ble opprettet');
        })
        .catch((e) => openSnackbar(e.detail));
    }
  };

  const delEvent = () => {
    if (selectedEvent.id) {
      deleteEvent(selectedEvent.id)
        .then((data) => {
          setEvents((events) => events.filter((eventItem) => eventItem.id !== selectedEvent.id));
          setSelectedEvent(defaultEvent);
          openSnackbar(data.detail);
        })
        .catch((e) => openSnackbar(e.detail));
    } else {
      openSnackbar('Du kan ikke slette et arrangement som ikke er opprettet');
    }
  };

  const closeEvent = () => {
    if (selectedEvent.id) {
      updateEvent(selectedEvent.id, { closed: true })
        .then((data) => {
          setSelectedEvent(data);
          setEvents((events) =>
            events.map((eventItem) => {
              let returnValue = { ...eventItem };
              if (eventItem.id === data.id) {
                returnValue = data;
              }
              return returnValue;
            }),
          );
          openSnackbar('Arrangementet ble stengt');
        })
        .catch((e) => openSnackbar(e.detail));
    } else {
      openSnackbar('Du kan ikke stenge et arrangement som ikke er opprettet');
    }
  };

  const fetchExpired = () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    getExpiredEvents
      .then((data) => setExpiredItems(data.results || data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  const getNextPage = () => {
    loadEvents({ page: nextPage });
  };

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
  };

  const goToRegistration = () => {
    if (selectedEvent.id) {
      navigate(URLS.events.concat(selectedEvent.id).concat('/registrering/'));
    } else {
      openSnackbar('Du kan ikke registrere ankomne før arrangementet er opprettet');
    }
  };

  useEffect(() => {
    loadEvents();
    getCategories()
      .then((data) => setCategories(data))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = [
    { text: 'Lagre', func: () => saveEvent() },
    { text: 'Registrer ankomne', func: () => goToRegistration() },
    { text: 'Steng', func: () => closeEvent() },
    { text: 'Slett', func: () => delEvent() },
  ];

  return (
    <Navigation noFooter whitesmoke>
      <Helmet>
        <title>Arrangementadmin - TIHLDE</title>
      </Helmet>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        open={showSnackbar}>
        <SnackbarContent className={classes.snackbar} message={snackbarMessage} />
      </Snackbar>
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.top}>
            <Typography className={classes.header} variant='h4'>
              {selectedEvent.id ? 'Endre arrangement' : 'Nytt arrangement'}
            </Typography>
            <DropdownButton options={options} />
          </div>
          <Tabs
            aria-label='tabs'
            indicatorColor='primary'
            onChange={(e, newTab) => setTab(newTab)}
            scrollButtons='desktop'
            textColor='primary'
            value={tab}
            variant='scrollable'>
            <Tab id='0' label={selectedEvent.id ? 'Endre' : 'Skriv'} />
            <Tab id='1' label='Deltagere' />
            <Tab id='2' label='Forhåndsvis' />
          </Tabs>
          <Paper noPadding>
            {tab === 0 && <EventEditor categories={categories} event={selectedEvent} setEvent={(item) => setSelectedEvent(item)} />}
            {tab === 1 && <EventParticipants event={selectedEvent} openSnackbar={openSnackbar} />}
            {tab === 2 && (
              <div className={classes.preview}>
                <EventRenderer event={selectedEvent} preview />
              </div>
            )}
          </Paper>
        </div>
      </div>
      <SidebarList
        expiredItems={expiredItems}
        fetchExpired={fetchExpired}
        getNextPage={getNextPage}
        isLoading={isLoading}
        items={events}
        nextPage={nextPage}
        onItemClick={(item) => setSelectedEvent(item || defaultEvent)}
        selectedItemId={selectedEvent?.id || null}
        title='Arrangementer'
        width={SIDEBAR_WIDTH}
      />
    </Navigation>
  );
}

EventAdministration.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventAdministration);
