import { zodResolver } from '@hookform/resolvers/zod';
import { Copy, Info } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { Event } from 'types';

import { useEventById, useEventRegistrations } from 'hooks/Event';

import EventMessageSender from 'pages/EventAdministration/components/EventMessageSender';
import EventStatistics from 'pages/EventAdministration/components/EventStatistics';
import Participant from 'pages/EventAdministration/components/Participant';

import { Alert, AlertDescription, AlertTitle } from 'components/ui/alert';
import { Button, PaginateButton } from 'components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Checkbox } from 'components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from 'components/ui/form';
import { Separator } from 'components/ui/separator';
import { Skeleton } from 'components/ui/skeleton';

import EventUserRegistrator from './EventUserRegistrator';

type RegistrationsProps = {
  onWait?: boolean;
  eventId: Event['id'];
  needsSorting?: boolean;
};

const formSchema = z.object({
  names: z.boolean(),
  emails: z.boolean(),
});

const Registrations = ({ onWait = false, eventId, needsSorting = false }: RegistrationsProps) => {
  const [showHasNotAttended, setShowHasNotAttended] = useState<boolean>(false);
  const [showHasAllergy, setShowHasAllergy] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const { data, hasNextPage, isFetching, isLoading, fetchNextPage, refetch } = useEventRegistrations(eventId, {
    is_on_wait: onWait,
    ...(showHasNotAttended ? { has_attended: false } : {}),
    ...(searchParams.has('year') && !onWait ? { year: searchParams.get('year') } : {}),
    ...(searchParams.has('study') && !onWait ? { study: searchParams.get('study') } : {}),
    ...(showHasAllergy ? { has_allergy: true } : {}),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { names: false, emails: false },
  });

  const registrations = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  useEffect(() => {
    refetch();
  }, [showHasNotAttended, searchParams, showHasAllergy]);

  let sortedRegistrations = registrations;

  if (needsSorting) {
    sortedRegistrations = registrations.sort((a, b) => {
      const waitA = a.wait_queue_number ?? Number.MAX_SAFE_INTEGER;
      const waitB = b.wait_queue_number ?? Number.MAX_SAFE_INTEGER;
      return waitA - waitB;
    });
  }

  const getRegistrationDetails = (values: z.infer<typeof formSchema>) => {
    const { names, emails } = values;

    if (!names && !emails) {
      return '';
    }
    return registrations
      .map((registration) => {
        const data: string[] = [];
        data.push(registration.user_info.user_id);
        names && data.push(`${registration.user_info.first_name} ${registration.user_info.last_name}`);
        emails && data.push(registration.user_info.email);
        return data.join(',');
      })
      .join('\n');
  };

  const copyRegistrationDetails = (values: z.infer<typeof formSchema>) => {
    const tempInput = document.createElement('textarea');
    tempInput.value = getRegistrationDetails(values);

    if (!tempInput.value) {
      return toast.error('Ingen detaljer valgt for kopiering');
    }

    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    toast.success('Detaljene ble kopiert til utklippstavlen');
  };

  return (
    <>
      <div className='flex items-center justify-between'>
        <h1 className='text-lg font-bold'>
          {onWait ? 'Venteliste' : 'Påmeldte'} ({data?.pages[0]?.count || 0})
        </h1>
        {!onWait && (
          <div className='flex gap-2'>
            <div className='items-top flex space-x-2'>
              <Checkbox checked={showHasAllergy} id='terms2' onCheckedChange={(checked) => setShowHasAllergy(Boolean(checked))} />
              <div className='grid leading-none'>
                <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer' htmlFor='terms1'>
                  Har allergi
                </label>
              </div>
            </div>
            <div className='items-top flex space-x-2'>
              <Checkbox checked={showHasNotAttended} id='terms1' onCheckedChange={(checked) => setShowHasNotAttended(Boolean(checked))} />
              <div className='grid leading-none'>
                <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer' htmlFor='terms1'>
                  Ikke ankommet
                </label>
              </div>
            </div>
          </div>
        )}
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

              <Form {...form}>
                <form className='p-4 space-y-2' onSubmit={form.handleSubmit(copyRegistrationDetails)}>
                  <div className='space-y-2 md:space-y-0 md:flex md:items-center md:space-x-2'>
                    <FormField
                      control={form.control}
                      name='names'
                      render={({ field }) => (
                        <FormItem className='w-full'>
                          <label
                            className='w-full flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:border-primary'
                            htmlFor='names'>
                            <FormControl>
                              <Checkbox checked={field.value} id='names' onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className='space-y-1 leading-none'>
                              <FormLabel>Navn</FormLabel>
                              <FormDescription>Kopier navnene til deltagerne</FormDescription>
                            </div>
                          </label>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='emails'
                      render={({ field }) => (
                        <FormItem className='w-full'>
                          <label
                            className='w-full flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:border-primary'
                            htmlFor='emails'>
                            <FormControl>
                              <Checkbox checked={field.value} id='emails' onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className='space-y-1 leading-none'>
                              <FormLabel>Epost</FormLabel>
                              <FormDescription>Kopier epostene til deltagerne</FormDescription>
                            </div>
                          </label>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button className='w-full' type='submit' variant='outline'>
                    <Copy className='w-5 h-5 mr-2' />
                    Kopier detaljer om deltagere
                  </Button>
                </form>
              </Form>
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

          <EventStatistics eventId={eventId} />
          <Registrations eventId={eventId} />
          <Registrations eventId={eventId} needsSorting={needsSorting} onWait />
        </div>
      </CardContent>
    </Card>
  );
};

export default EventParticipants;
