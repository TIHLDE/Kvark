import { useMemo, useState } from 'react';
import URLS from 'URLS';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEvents } from 'api/hooks/Event';

// Material-UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';

// Icons
import EditIcon from '@material-ui/icons/EditRounded';
import ParticipantsIcon from '@material-ui/icons/PeopleRounded';
import RegisterIcon from '@material-ui/icons/PlaylistAddCheckRounded';

// Project components
import Paper from 'components/layout/Paper';
import Tabs from 'components/layout/Tabs';
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
    color: theme.palette.text.primary,
    paddingLeft: theme.spacing(2),
  },
}));

const EventAdministration = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { data, hasNextPage, fetchNextPage, isLoading } = useEvents();
  const events = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  const { data: expiredData, fetchNextPage: fetchNextExpiredPage } = useEvents({ expired: true });
  const expiredEvents = useMemo(() => (expiredData ? expiredData.pages.map((page) => page.results).flat() : []), [expiredData]);
  const editTab = { value: 'edit', label: eventId ? 'Endre' : 'Skriv', icon: EditIcon };
  const participantsTab = { value: 'participants', label: 'Deltagere', icon: ParticipantsIcon };
  const registerTab = { value: 'register', label: 'Registrering', icon: RegisterIcon };
  const tabs = [editTab, participantsTab, registerTab];
  const [tab, setTab] = useState(editTab.value);

  const goToEvent = (newEvent: number | null) => {
    if (newEvent) {
      navigate(`${URLS.eventAdmin}${newEvent}/`);
    } else {
      navigate(URLS.eventAdmin);
    }
  };

  return (
    <Navigation maxWidth={false} noFooter>
      <SidebarList
        expiredItems={expiredEvents}
        fetchExpired={() => fetchNextExpiredPage()}
        getNextPage={() => fetchNextPage()}
        isLoading={isLoading}
        items={events}
        nextPage={hasNextPage}
        onItemClick={(id: number | null) => goToEvent(id || null)}
        selectedItemId={Number(eventId)}
        title='Arrangementer'
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
            <Collapse in={tab === registerTab.value} mountOnEnter>
              <Navigate to={`${URLS.events}${eventId}/registrering/`} />
            </Collapse>
          </Paper>
        </div>
      </div>
    </Navigation>
  );
};

export default EventAdministration;
