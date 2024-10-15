import { TIHLDE_API_URL } from 'constant';
import { CalendarPlusIcon, InfoIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import { USERS_ENDPOINT } from 'api/api';

import { useUser, useUserEvents } from 'hooks/User';

import EventListItem, { EventListItemLoading } from 'components/miscellaneous/EventListItem';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import { Alert, AlertDescription } from 'components/ui/alert';
import { Button, PaginateButton } from 'components/ui/button';
import Expandable from 'components/ui/expandable';

export const EventsSubscription = () => {
  const { data: user } = useUser();

  return (
    <Expandable description='Påmeldinger rett inn i kalenderen' icon={<CalendarPlusIcon className='stroke-[1.5px]' />} title='Kalender-abonnement'>
      <div className='space-y-4'>
        <h1 className='text-sm'>
          Du kan abonnere på din arrangement-kalender slik at nye påmeldinger kommer automatisk inn i kalenderen din. Kopier URLen under og åpne{' '}
          <a
            className='underline text-blue-500 dark:text-indigo-300'
            href='https://calendar.google.com/calendar/u/0/r/settings/addbyurl'
            rel='noopener noreferrer'
            target='_blank'>
            Google Calendar
          </a>
          ,{' '}
          <a
            className='underline text-blue-500 dark:text-indigo-300'
            href='https://support.apple.com/no-no/guide/calendar/icl1022/mac'
            rel='noopener noreferrer'
            target='_blank'>
            Apple Calendar (fremgangsmåte)
          </a>
          ,{' '}
          <a
            className='underline text-blue-500 dark:text-indigo-300'
            href='https://support.microsoft.com/nb-no/office/cff1429c-5af6-41ec-a5b4-74f2c278e98c'
            rel='noopener noreferrer'
            target='_blank'>
            Microsoft Outlook (fremgangsmåte)
          </a>{' '}
          eller en annen kalender for å begynne å abonnere på arrangement-kalenderen din. Hvis nye påmeldinger til arrangementer ikke kommer inn i kalenderen
          din umiddelbart, så kan det være fordi kalenderen sjelden ser etter oppdateringer. Oppdaterings-frekvensen varierer fra kalender til kalender, enkelte
          oppdateres kun daglig.
        </h1>
        {!user ? null : user.public_event_registrations ? (
          <pre className='bg-card rounded-md p-2 overflow-x-auto'>{`${TIHLDE_API_URL}${USERS_ENDPOINT}/${user.user_id}/events.ics`}</pre>
        ) : (
          <Alert>
            <InfoIcon className='stroke-[1.5px]' />
            <AlertDescription>
              Du har skrudd av offentlige arrangementspåmeldinger. Du må skru det på i profilen for å kunne abonnere på din arrangement-kalender.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Expandable>
  );
};

const ProfileEvents = () => {
  const [tab, setTab] = useState<'present' | 'expired'>('present');
  const { data, hasNextPage, fetchNextPage, isFetching } = useUserEvents(undefined, tab !== 'present');
  const events = useMemo(() => (data !== undefined ? data.pages.map((page) => page.results).flat(1) : []), [data]);

  return (
    <div className='space-y-2'>
      <EventsSubscription />

      <div className='grid grid-cols-1 space-y-2 md:space-y-0 md:flex md:items-center md:justify-center md:space-x-4'>
        <Button
          className={`w-full md:text-md ${tab === 'present' ? 'bg-white dark:bg-secondary' : ''}`}
          onClick={() => setTab('present')}
          size='default'
          variant='outline'>
          Kommende arrangementer
        </Button>
        <Button
          className={`w-full md:text-md ${tab === 'expired' ? 'bg-white dark:bg-secondary' : ''}`}
          onClick={() => setTab('expired')}
          size='default'
          variant='outline'>
          Tidligere arrangementer
        </Button>
      </div>

      {!data ? (
        <EventListItemLoading />
      ) : !events.length ? (
        <NotFoundIndicator header='Fant ingen arrangementer' subtitle='Du er ikke påmeldt noen kommende arrangementer' />
      ) : (
        <div className='space-y-2'>
          {events?.map((event) => (
            <EventListItem event={event} key={event.id} size='medium' />
          ))}
        </div>
      )}
      {hasNextPage && <PaginateButton className='w-full mt-4' isLoading={isFetching} nextPage={fetchNextPage} />}
    </div>
  );
};

export default ProfileEvents;
