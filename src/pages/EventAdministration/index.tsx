import Page from '~/components/navigation/Page';
import { Button } from '~/components/ui/button';
import NavLink from '~/components/ui/navlink';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useEventById } from '~/hooks/Event';
import useMediaQuery, { MEDIUM_SCREEN } from '~/hooks/MediaQuery';
import EventEditor from '~/pages/EventAdministration/components/EventEditor';
import EventParticipants from '~/pages/EventAdministration/components/EventParticipants';
import URLS from '~/URLS';
import { urlEncode } from '~/utils';
import { ChevronRight, CircleHelp, ListChecks, Pencil, Plus, Users } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { Route } from './+types';
import EventFormAdmin from './components/EventFormAdmin';
import EventList from './components/EventList';

export function clientLoader({ params }: Route.ClientLoaderArgs) {
  return {
    eventId: params.eventId,
  };
}

export default function EventAdministration({ loaderData }: Route.ComponentProps) {
  const { eventId } = loaderData;
  const navigate = useNavigate();
  const { data: event, isError } = useEventById(eventId ? Number(eventId) : -1);
  const isDesktop = useMediaQuery(MEDIUM_SCREEN);

  const goToEvent = (newEvent: number | null) => {
    if (newEvent) {
      navigate(`${URLS.eventAdmin}${newEvent}/`);
    } else {
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

  const RegisterButton = ({ id }: { id: string }) => (
    <Button asChild className='px-2 md:px-4' variant='outline'>
      <NavLink params={{ id }} to='/arrangementer/registrering/:id'>
        <ListChecks className='w-5 h-5 mr-2 stroke-[1.5px]' />
        Registrering
      </NavLink>
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
                <NavLink to='/admin/arrangementer/:eventId?'>
                  <Plus className='w-5 h-5 stroke-[1.5px]' />
                </NavLink>
              </Button>

              {!isDesktop && <RegisterButton id={eventId} />}

              <Button asChild className='p-0' variant='link'>
                <NavLink
                  params={{
                    id: eventId,
                    urlTitle: event?.title ? urlEncode(event.title) : undefined,
                  }}
                  to='/arrangementer/:id/:urlTitle?'>
                  Se arrangement
                  <ChevronRight className='ml-1 w-5 h-5 stroke-[1.5px]' />
                </NavLink>
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

              {isDesktop && <RegisterButton id={eventId} />}
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
}
