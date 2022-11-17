import EditIcon from '@mui/icons-material/EditRounded';
import FormsIcon from '@mui/icons-material/HelpOutlineRounded';
import OpenIcon from '@mui/icons-material/OpenInBrowserRounded';
import ParticipantsIcon from '@mui/icons-material/PeopleRounded';
import RegisterIcon from '@mui/icons-material/PlaylistAddCheckRounded';
import { Alert, Collapse, Typography } from '@mui/material';
import { parseISO } from 'date-fns';
import { makeStyles } from 'makeStyles';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate } from 'utils';

import { useEventById, useEventsWhereIsAdmin } from 'hooks/Event';

import EventEditor from 'pages/EventAdministration/components/EventEditor';
import EventFormAdmin from 'pages/EventAdministration/components/EventFormAdmin';
import EventParticipants from 'pages/EventAdministration/components/EventParticipants';

import Paper from 'components/layout/Paper';
import SidebarList from 'components/layout/SidebarList';
import Tabs from 'components/layout/Tabs';
import Page from 'components/navigation/Page';

const useStyles = makeStyles()((theme) => ({
  root: {
    padding: theme.spacing(4),
    marginLeft: theme.spacing(35),
    [theme.breakpoints.down('lg')]: {
      padding: theme.spacing(2, 1, 6),
      marginLeft: 0,
    },
  },
  content: {
    maxWidth: 900,
    margin: '0 auto',
  },
  header: {
    color: theme.palette.text.primary,
    paddingLeft: theme.spacing(2),
  },
}));

const EventAdministration = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { data: event, isLoading, isError } = useEventById(eventId ? Number(eventId) : -1);
  const editTab = { value: 'edit', label: eventId ? 'Endre' : 'Skriv', icon: EditIcon };
  const participantsTab = { value: 'participants', label: 'Deltagere', icon: ParticipantsIcon };
  const formsTab = { value: 'forms', label: 'Spørsmål', icon: FormsIcon };
  const registerTab = { value: 'register', label: 'Registrering', icon: RegisterIcon };
  const navigateTab = { value: 'navigate', label: 'Se arrangement', icon: OpenIcon };
  const tabs = eventId ? [editTab, ...(event?.sign_up ? [participantsTab, formsTab, registerTab] : []), navigateTab] : [editTab];
  const [tab, setTab] = useState(editTab.value);

  const goToEvent = (newEvent: number | null) => {
    if (newEvent) {
      navigate(`${URLS.eventAdmin}${newEvent}/`);
    } else {
      setTab(editTab.value);
      navigate(URLS.eventAdmin);
    }
  };

  /**
   * Go to "New Event" if there is an error loading current event or the user don't have write-access to the event
   */
  useEffect(() => {
    if ((event && !event.permissions.write) || isError) {
      goToEvent(null);
    }
  }, [isError, event]);

  useEffect(() => {
    if (!isLoading && !tabs.some((t) => t.value === tab)) {
      setTab(tabs[0].value);
    }
  }, [tab, isLoading]);

  return (
    <Page
      maxWidth={false}
      options={{ lightColor: 'blue', filledTopbar: true, gutterBottom: true, gutterTop: true, noFooter: true, title: 'Admin arrangementer' }}>
      <SidebarList
        descKey='start_date'
        formatDesc={(desc) => formatDate(parseISO(desc))}
        idKey='id'
        onItemClick={(id: number | null) => goToEvent(id || null)}
        selectedItemId={Number(eventId)}
        title='Arrangementer'
        titleKey='title'
        useHook={useEventsWhereIsAdmin}
      />
      <div className={classes.root}>
        <div className={classes.content}>
          {event && event.closed && (
            <Alert severity='warning' sx={{ mb: 1 }}>
              Dette arrangementet er stengt.
            </Alert>
          )}
          <Typography className={classes.header} variant='h2'>
            {eventId ? 'Administrer arrangement' : 'Nytt arrangement'}
          </Typography>
          <Tabs selected={tab} setSelected={setTab} tabs={tabs} />
          <Paper>
            <Collapse in={tab === editTab.value} mountOnEnter>
              <EventEditor eventId={Number(eventId)} goToEvent={goToEvent} />
            </Collapse>
            <Collapse in={tab === participantsTab.value} mountOnEnter>
              <EventParticipants eventId={Number(eventId)} />
            </Collapse>
            <Collapse in={tab === formsTab.value} mountOnEnter>
              <EventFormAdmin eventId={Number(eventId)} />
            </Collapse>
            {tab === registerTab.value && <Navigate to={`${URLS.events}${eventId}/${URLS.eventRegister}`} />}
            {tab === navigateTab.value && <Navigate to={`${URLS.events}${eventId}/`} />}
          </Paper>
        </div>
      </div>
    </Page>
  );
};

export default EventAdministration;
