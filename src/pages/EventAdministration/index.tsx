import { useState, useEffect } from 'react';
import URLS from 'URLS';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEvents, useEventById } from 'hooks/Event';
import { parseISO } from 'date-fns';
import { formatDate } from 'utils';

// Material-UI
import { makeStyles } from '@mui/styles';
import { Typography, Collapse } from '@mui/material';

// Icons
import EditIcon from '@mui/icons-material/EditRounded';
import ParticipantsIcon from '@mui/icons-material/PeopleRounded';
import RegisterIcon from '@mui/icons-material/PlaylistAddCheckRounded';
import OpenIcon from '@mui/icons-material/OpenInBrowserRounded';
import FormsIcon from '@mui/icons-material/HelpOutlineRounded';

// Project components
import Paper from 'components/layout/Paper';
import Tabs from 'components/layout/Tabs';
import Page from 'components/navigation/Page';
import SidebarList from 'components/layout/SidebarList';
import EventEditor from 'pages/EventAdministration/components/EventEditor';
import EventParticipants from 'pages/EventAdministration/components/EventParticipants';
import EventFormAdmin from 'pages/EventAdministration/components/EventFormAdmin';

const useStyles = makeStyles((theme) => ({
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
  const classes = useStyles();
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { data: event, isError } = useEventById(eventId ? Number(eventId) : -1);
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

  return (
    <Page
      maxWidth={false}
      options={{ lightColor: 'blue', filledTopbar: true, gutterBottom: true, gutterTop: true, noFooter: true, title: 'Admin arrangementer' }}>
      <SidebarList
        descKey='start_date'
        formatDesc={(desc) => formatDate(parseISO(desc))}
        hookArgs={{ is_admin: true }}
        idKey='id'
        onItemClick={(id: number | null) => goToEvent(id || null)}
        selectedItemId={Number(eventId)}
        title='Arrangementer'
        titleKey='title'
        useHook={useEvents}
      />
      <div className={classes.root}>
        <div className={classes.content}>
          <Typography className={classes.header} variant='h2'>
            {eventId ? 'Endre arrangement' : 'Nytt arrangement'}
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
