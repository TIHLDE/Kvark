import { Stack } from '@mui/material';
import { TIHLDE_API_URL } from 'constant';
import { CalendarPlusIcon, ChevronDownIcon, ChevronRightIcon, InfoIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import { USERS_ENDPOINT } from 'api/api';

import { useUser, useUserEvents } from 'hooks/User';

import Pagination from 'components/layout/Pagination';
import EventListItem, { EventListItemLoading } from 'components/miscellaneous/EventListItem';
import { Pre } from 'components/miscellaneous/MarkdownRenderer';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import { Alert, AlertDescription, AlertTitle } from 'components/ui/alert';
import { Button } from 'components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'components/ui/collapsible';

export const EventsSubscription = () => {
  const { data: user } = useUser();
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <Collapsible className='w-full bg-white dark:bg-inherit border border-secondary rounded-md' onOpenChange={setOpen} open={isOpen}>
      <CollapsibleTrigger asChild>
        <Button
          className='py-8 w-full rounded-t-md rounded-b-none bg-white dark:bg-inherit dark:hover:bg-secondary border-none flex justify-between items-center'
          variant='outline'>
          <div className='flex items-center space-x-4'>
            <CalendarPlusIcon className='stroke-[1.5px]' />
            <div className='text-start'>
              <h1>Kalender-abonnement</h1>
              <h1 className='text-sm'>Påmeldinger rett inn i kalenderen</h1>
            </div>
          </div>
          <div>{isOpen ? <ChevronDownIcon className='stroke-[1.5px]' /> : <ChevronRightIcon className='stroke-[1.5px]' />}</div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className='border border-t-secondary border-b-0 border-x-0 p-4'>
        <h1 className='text-sm pb-2'>
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
          <Pre>{`${TIHLDE_API_URL}${USERS_ENDPOINT}/${user.user_id}/events.ics`}</Pre>
        ) : (
          <Alert className='space-x-4'>
            <InfoIcon className='stroke-[1.5px]' />
            <AlertTitle>Du har skrudd av offentlige arrangementspåmeldinger.</AlertTitle>
            <AlertDescription>Du må skru det på i profilen for å kunne abonnere på din arrangement-kalender.</AlertDescription>
          </Alert>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

const ProfileEvents = () => {
  const [tab, setTab] = useState<'present' | 'expired'>('present');
  const { data, hasNextPage, fetchNextPage, isFetching } = useUserEvents(undefined, tab !== 'present');
  const events = useMemo(() => (data !== undefined ? data.pages.map((page) => page.results).flat(1) : []), [data]);

  return (
    <Stack gap={1}>
      <EventsSubscription />

      <div className='grid grid-cols-1 space-y-2 md:space-y-0 md:flex md:items-center md:justify-center md:space-x-4'>
        <Button
          className={`w-full md:text-md ${tab === 'present' ? 'bg-white dark:bg-secondary' : ''}`}
          onClick={() => setTab('present')}
          size='lg'
          variant='outline'>
          Kommende arrangementer
        </Button>
        <Button
          className={`w-full md:text-md ${tab === 'expired' ? 'bg-white dark:bg-secondary' : ''}`}
          onClick={() => setTab('expired')}
          size='lg'
          variant='outline'>
          Tidligere arrangementer
        </Button>
      </div>

      {!data ? (
        <EventListItemLoading />
      ) : !events.length ? (
        <NotFoundIndicator header='Fant ingen arrangementer' subtitle='Du er ikke påmeldt noen kommende arrangementer' />
      ) : (
        <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} label='Last flere arrangementer' nextPage={() => fetchNextPage()}>
          {events?.map((event) => (
            <EventListItem event={event} key={event.id} />
          ))}
        </Pagination>
      )}
    </Stack>
  );
};

export default ProfileEvents;
