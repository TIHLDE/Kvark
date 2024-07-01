import EditIcon from '@mui/icons-material/EditRounded';
import FormsIcon from '@mui/icons-material/HelpOutlineRounded';
import OpenIcon from '@mui/icons-material/OpenInBrowserRounded';
import ParticipantsIcon from '@mui/icons-material/PeopleRounded';
import RegisterIcon from '@mui/icons-material/PlaylistAddCheckRounded';
import { ChevronRight, CircleHelp, ListChecks, Pencil, Plus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import URLS from 'URLS';

import { useEventById } from 'hooks/Event';
import useMediaQuery, { MEDIUM_SCREEN } from 'hooks/MediaQuery';

import EventEditor from 'pages/EventAdministration/components/EventEditor';
import EventFormAdmin from 'pages/EventAdministration/components/EventFormAdmin';
import EventParticipants from 'pages/EventAdministration/components/EventParticipants';

import Page from 'components/navigation/Page';
import { Button } from 'components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';

import EventList from './components/EventList';

const EventAdministration = () => {
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
  const isDesktop = useMediaQuery(MEDIUM_SCREEN);

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

  const RegisterButton = () => (
    <Button asChild className='px-2 md:px-4' variant='outline'>
      <Link to={`${URLS.events}${eventId}/${URLS.eventRegister}`}>
        <ListChecks className='w-5 h-5 mr-2 stroke-[1.5px]' />
        Registrering
      </Link>
    </Button>
  );

  return (
    <Page className='max-w-6xl mx-auto space-y-6'>
      <div className='space-y-4 md:space-y-0 md:flex items-center justify-between'>
        <h1 className='font-bold text-4xl md:text-5xl'>{eventId ? 'Endre arrangement' : 'Nytt arrangement'}</h1>

        <div className='flex items-center space-x-2'>
          <EventList />

          {eventId && (
            <>
              <Button asChild size='icon' variant='outline'>
                <Link to={URLS.eventAdmin}>
                  <Plus className='w-5 h-5 stroke-[1.5px]' />
                </Link>
              </Button>

              {!isDesktop && <RegisterButton />}

              <Button asChild className='p-0' variant='link'>
                <Link to={`${URLS.events}${eventId}/`}>
                  Se arrangement
                  <ChevronRight className='ml-1 w-5 h-5 stroke-[1.5px]' />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className='space-y-2'>
        {!eventId && <EventEditor eventId={null} goToEvent={goToEvent} />}
        {eventId && (
          <Tabs defaultValue='edit'>
            <div className='flex items-center justify-between'>
              <TabsList>
                <TabsTrigger value='edit'>
                  <Pencil className='w-5 h-5 mr-2 stroke-[1.5px]' />
                  Rediger
                </TabsTrigger>
                <TabsTrigger value='participants'>
                  <Users className='w-5 h-5 mr-2 stroke-[1.5px]' />
                  Deltagere
                </TabsTrigger>
                <TabsTrigger value='forms'>
                  <CircleHelp className='w-5 h-5 mr-2 stroke-[1.5px]' />
                  Spørsmål
                </TabsTrigger>
              </TabsList>

              {isDesktop && <RegisterButton />}
            </div>
            <TabsContent value='edit'>
              <EventEditor eventId={Number(eventId)} goToEvent={goToEvent} />
            </TabsContent>
            <TabsContent value='participants'>
              <EventParticipants eventId={Number(eventId)} />
            </TabsContent>
            <TabsContent value='forms'>
              <EventFormAdmin eventId={Number(eventId)} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Page>
  );
};

export default EventAdministration;
