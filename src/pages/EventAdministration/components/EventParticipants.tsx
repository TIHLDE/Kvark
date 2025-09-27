import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Button, PaginateButton } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { Separator } from '~/components/ui/separator';
import { Skeleton } from '~/components/ui/skeleton';
import { useEventById, useEventRegistrations } from '~/hooks/Event';
import EventMessageSender from '~/pages/EventAdministration/components/EventMessageSender';
import EventStatistics from '~/pages/EventAdministration/components/EventStatistics';
import Participant from '~/pages/EventAdministration/components/Participant';
import type { Event } from '~/types';
import { Copy, Info } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'sonner';

import EventParticipantSearch from './EventParticipantSearch';
import EventUserRegistrator from './EventUserRegistrator';

type RegistrationsProps = {
  onWait?: boolean;
  eventId: Event['id'];
  needsSorting?: boolean;
};

const Registrations = ({ onWait = false, eventId, needsSorting = false }: RegistrationsProps) => {
  const [searchParams] = useSearchParams();
  const { data, hasNextPage, isFetching, isLoading, fetchNextPage, refetch } = useEventRegistrations(eventId, {
    is_on_wait: onWait,
    ...(searchParams.has('has_attended') ? { has_attended: searchParams.get('has_attended') } : {}),
    ...(searchParams.has('year') && !onWait ? { year: searchParams.get('year') } : {}),
    ...(searchParams.has('study') && !onWait ? { study: searchParams.get('study') } : {}),
    ...(searchParams.has('has_allergy') && !onWait ? { has_allergy: searchParams.get('has_allergy') } : {}),
    ...(searchParams.has('search') && !onWait ? { search: searchParams.get('search') } : {}),
    ...(searchParams.has('has_paid') && !onWait ? { has_paid: searchParams.get('has_paid') } : {}),
    ...(searchParams.has('allow_photo') && !onWait ? { allow_photo: searchParams.get('allow_photo') } : {}),
  });

  const [names, setNames] = useState(false);
  const [emails, setEmails] = useState(false);

  function handleCopyDetails() {
    if (!names && !emails) {
      return toast.info('Ingenting kopier til utklippstavlen');
    }
    navigator.clipboard.writeText(getRegistrationDetails(names, emails));
    toast.success('Detaljene ble kopiert til utklippstavlen');
  }

  const registrations = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  useEffect(() => {
    refetch();
  }, [searchParams]);

  let sortedRegistrations = registrations;

  if (needsSorting) {
    sortedRegistrations = registrations.sort((a, b) => {
      const waitA = a.wait_queue_number ?? Number.MAX_SAFE_INTEGER;
      const waitB = b.wait_queue_number ?? Number.MAX_SAFE_INTEGER;
      return waitA - waitB;
    });
  }

  const getRegistrationDetails = (names: boolean, emails: boolean) => {
    if (!names && !emails) {
      return '';
    }
    return registrations
      .map((registration) => {
        const data: string[] = [];
        data.push(registration.user_info.user_id);
        if (names) data.push(`${registration.user_info.first_name} ${registration.user_info.last_name}`);
        if (emails) data.push(registration.user_info.email);
        return data.join(',');
      })
      .join('\n');
  };

  return (
    <>
      <div className='flex items-center justify-between'>
        <h1 className='text-lg font-bold'>
          {onWait ? 'Venteliste' : 'Påmeldte'} ({data?.pages[0]?.count || 0})
        </h1>
      </div>

      {isLoading && (
        <div className='space-y-2'>
          {[...Array(5)].map((_, index) => (
            <Skeleton className='h-10' key={index} />
          ))}
        </div>
      )}

      {!isLoading && registrations.length ? (
        <>
          <div className='w-full flex items-center justify-between text-sm text-muted-foreground'>
            <p>Detaljer</p>
            {!onWait && <p>Ankommet</p>}
          </div>

          <div className='space-y-2'>
            {sortedRegistrations.map((registration, index) => (
              <Participant eventId={eventId} key={index} registration={registration} />
            ))}
          </div>

          {!onWait && !hasNextPage && (
            <>
              <Alert variant='warning'>
                <Info className='w-5 h-5' />
                <AlertTitle>Sende epost?</AlertTitle>
                <AlertDescription>
                  Bruk &quot;Send epost til deltagere&quot; hvis du kan. Det er lurt at alle eposter kommer fra samme epost og ser like ut for at brukerne skal
                  stole på eposter som mottas. Våre eposter havner heller ikke i søppelpost. Kopier alle eposter kun om du virkelig er nødt til å sende epost
                  selv.
                </AlertDescription>
              </Alert>

              <div className='p-4 space-y-2'>
                <div className='space-y-2 md:space-y-0 md:flex md:items-center md:space-x-2'>
                  <label className='w-full flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:border-primary'>
                    <Checkbox checked={names} onCheckedChange={(v) => setNames(Boolean(v))} />
                    <div className='space-y-1 leading-none'>
                      Navn
                      <p>Kopier navnene til deltagerne</p>
                    </div>
                  </label>

                  <label className='w-full flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:border-primary'>
                    <Checkbox checked={emails} onCheckedChange={(v) => setEmails(Boolean(v))} />
                    <div className='space-y-1 leading-none'>
                      Epost
                      <p>Kopier epostene til deltagerne</p>
                    </div>
                  </label>
                </div>

                <Button className='w-full' variant='outline' onClick={handleCopyDetails}>
                  <Copy className='w-5 h-5 mr-2' />
                  Kopier detaljer om deltagere
                </Button>
              </div>
            </>
          )}
          {hasNextPage && <PaginateButton className='w-full mt-4' isLoading={isFetching} nextPage={fetchNextPage} />}
        </>
      ) : (
        <h1>{onWait ? 'Ingen på ventelisten' : 'Ingen påmeldte'}</h1>
      )}
    </>
  );
};

export type EventParticipantsProps = {
  eventId: Event['id'];
};

const EventParticipants = ({ eventId }: EventParticipantsProps) => {
  const { data, isLoading } = useEventById(eventId);

  if (isLoading) {
    return null;
  }

  //TODO: Implement searching by first name and last name
  const needsSorting = data && data.priority_pools && data.priority_pools.length > 0;

  return (
    <Card>
      <CardHeader className='space-y-2 lg:space-y-0 flex lg:flex-row lg:justify-between lg:items-center'>
        <CardTitle>{data?.title || 'Laster...'}</CardTitle>
        <div className='flex items-center space-x-2'>
          <EventMessageSender eventId={eventId} />
          <EventUserRegistrator eventId={eventId} />
        </div>
      </CardHeader>
      <CardContent>
        <Separator className='mb-2' />

        <div className='space-y-4'>
          <h1 className='text-lg font-bold'>Statistikk</h1>
          <EventStatistics eventId={eventId} isPaid={data?.is_paid_event ?? false} />
          <EventParticipantSearch />
          <Registrations eventId={eventId} />
          <Registrations eventId={eventId} needsSorting={needsSorting} onWait />
        </div>
      </CardContent>
    </Card>
  );
};

export default EventParticipants;
