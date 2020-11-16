import React, { useState, useEffect } from 'react';
import URLS from 'URLS';
import { getParameterByName } from 'utils';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Event } from 'types/Types';

// API and store imports
import { useEvent } from 'api/hooks/Event';

// Material-UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// Project components
import Paper from 'components/layout/Paper';
import Navigation from 'components/navigation/Navigation';
import SidebarList from 'components/layout/SidebarList';
import EventEditor from 'containers/EventAdministration/components/EventEditor';
import EventParticipants from 'containers/EventAdministration/components/EventParticipants';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(4),
    marginLeft: theme.spacing(35),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(4, 1, 6),
      marginLeft: 0,
    },
  },
  content: {
    maxWidth: 900,
    margin: '0 auto',
  },
  header: {
    color: theme.palette.colors.text.main,
    paddingLeft: theme.spacing(2),
  },
  preview: {
    padding: theme.spacing(1),
  },
}));

const EventAdministration = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { getEvents, getExpiredEvents } = useEvent();
  const { eventId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [events, setEvents] = useState<Array<Event>>([]);
  const [expiredItems, setExpiredItems] = useState<Array<Event>>([]);
  const [page, setPage] = useState<number | null>(1);
  const [nextPage, setNextPage] = useState<number | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const parameters = {
      page: page,
      newest: true,
    };
    getEvents(parameters)
      .then((data) => {
        const next = getParameterByName('page', data.next);
        setNextPage(next ? Number(next) : null);
        setEvents((prevFiles) => [...prevFiles, ...data.results]);
      })
      .catch(() => {
        setNextPage(null);
        setEvents([]);
      })
      .finally(() => setIsLoading(false));
  }, [page, getEvents]);

  const fetchExpired = () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    getExpiredEvents()
      .then((data) => setExpiredItems(data.results || data || []))
      .finally(() => setIsLoading(false));
  };

  const goToNextPage = () => {
    if (nextPage) {
      setPage(nextPage);
    }
  };

  const goToEvent = (newEvent: number | null) => {
    if (newEvent) {
      navigate(`${URLS.eventAdmin}${newEvent}/`);
    } else {
      navigate(URLS.eventAdmin);
    }
  };

  return (
    <Navigation maxWidth={false} noFooter whitesmoke>
      <SidebarList
        expiredItems={expiredItems}
        fetchExpired={fetchExpired}
        getNextPage={goToNextPage}
        isLoading={isLoading}
        items={events}
        nextPage={nextPage}
        onItemClick={(id: number | null) => goToEvent(id || null)}
        selectedItemId={Number(eventId)}
        title='Arrangementer'
      />
      <div className={classes.root}>
        <div className={classes.content}>
          <Typography className={classes.header} variant='h2'>
            {eventId ? 'Endre arrangement' : 'Nytt arrangement'}
          </Typography>
          <Tabs indicatorColor='primary' onChange={(e, newTab) => setTab(newTab)} textColor='primary' value={tab} variant='scrollable'>
            <Tab id='0' label={eventId ? 'Endre' : 'Skriv'} />
            {eventId && <Tab id='1' label='Deltagere' />}
            {eventId && <Tab component={Link} id='2' label='Registrering' to={`${URLS.events}${eventId}/registrering/`} />}
          </Tabs>
          <Paper>
            <Collapse in={tab === 0} mountOnEnter>
              <EventEditor eventId={Number(eventId)} goToEvent={goToEvent} setEvents={setEvents} />
            </Collapse>
            <Collapse in={tab === 1} mountOnEnter unmountOnExit>
              <EventParticipants eventId={Number(eventId)} />
            </Collapse>
          </Paper>
        </div>
      </div>
    </Navigation>
  );
};

export default EventAdministration;
