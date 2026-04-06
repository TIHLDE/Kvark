import { useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import TIHLDE_LOGO from '~/assets/img/TihldeBackground.jpg';
import DetailContent from '~/components/miscellaneous/DetailContent';
import ShareButton from '~/components/miscellaneous/ShareButton';
import UpdatedAgo from '~/components/miscellaneous/UpdatedAgo';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import Expandable from '~/components/ui/expandable';
import { Skeleton } from '~/components/ui/skeleton';
import {
  registerForEventMutation,
  unregisterFromEventMutation,
  updateFavoriteEventMutation,
} from '~/api/queries/events';
import { useOptionalAuth } from '~/hooks/auth';
import { useAnalytics } from '~/hooks/Utils';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';
import { formatDate } from '~/utils';
import { parseISO } from 'date-fns';
import { Heart, LoaderCircle } from 'lucide-react';
import { cn } from '~/lib/utils';
import { toast } from 'sonner';
import type { paths } from '@tihlde/sdk';

type Event = paths['/api/event/{eventId}']['get'] extends { responses: { 200: { content: { 'application/json': infer T } } } } ? T : never;

export type EventRendererProps = {
  data: Event;
  preview?: boolean;
};

const EventRenderer = ({ data, preview = false }: EventRendererProps) => {
  const { event: analyticsEvent } = useAnalytics();
  const { auth } = useOptionalAuth();
  const user = auth?.user ?? null;

  const startDate = parseISO(data.startTime);
  const endDate = parseISO(data.endTime);

  const registerMutation = useMutation(registerForEventMutation);
  const unregisterMutation = useMutation(unregisterFromEventMutation);
  const favoriteMutation = useMutation(updateFavoriteEventMutation);

  // TODO: Re-add confetti on sign up — previously used useConfetti()

  const signUp = () => {
    registerMutation.mutate(
      { eventId: data.id },
      {
        onSuccess: () => {
          toast.success('Pameldingen var vellykket');
          analyticsEvent('registered', 'event-registration', `Registered for event: ${data.title}`);
        },
        onError: (e) => {
          toast.error(String(e));
        },
      },
    );
  };

  const signOff = () => {
    unregisterMutation.mutate(
      { eventId: data.id },
      {
        onSuccess: () => {
          toast.success('Du er avmeldt arrangementet');
          analyticsEvent('unregistered', 'event-registration', `Unregistered for event: ${data.title}`);
        },
        onError: (e) => {
          toast.error(String(e));
        },
      },
    );
  };

  const registrationInfo = (() => {
    const reg = data.registration;
    if (!reg) return null;

    if (reg.status === 'waitlisted') {
      return (
        <Alert>
          <AlertDescription>
            Du star pa plass {reg.waitlistPosition ?? '?'} pa ventelisten, vi gir deg beskjed hvis du far plass
          </AlertDescription>
        </Alert>
      );
    }

    if (reg.status === 'registered' || reg.status === 'attended') {
      return (
        <Alert variant='success'>
          <AlertDescription>
            {reg.status === 'attended' ? 'Du har deltatt pa arrangementet!' : 'Du har plass pa arrangementet!'}
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  })();

  const applyInfo = (() => {
    if (preview) return null;
    if (data.closed) {
      return (
        <Alert variant='warning'>
          <AlertDescription>Dette arrangementet er stengt. Det er derfor ikke mulig a melde seg av eller pa.</AlertDescription>
        </Alert>
      );
    }

    if (data.registration) {
      return (
        <>
          {registrationInfo}
          {data.registration.status !== 'cancelled' && (
            <ResponsiveAlertDialog
              action={signOff}
              description='Om du melder deg av arrangementet vil du miste plassen din og eventuelt havne pa venteliste om det er en.'
              title='Meld deg av arrangementet'
              trigger={
                <Button className='w-full' variant='destructive'>
                  Meld deg av
                </Button>
              }
            />
          )}
        </>
      );
    }

    if (!user) {
      return (
        <Button className='w-full' size='lg' variant='default' asChild>
          <Link to='/logg-inn' search={{ redirectTo: typeof window !== 'undefined' ? window.location.pathname : '' }}>
            Logg inn for a melde deg pa
          </Link>
        </Button>
      );
    }

    // TODO: Re-add unanswered evaluations check — previously checked user.unanswered_evaluations_count
    // TODO: Re-add priority pool check — previously checked only_allow_prioritized
    return (
      <Button className='w-full' disabled={registerMutation.isPending} onClick={signUp} size='lg'>
        {registerMutation.isPending ? <LoaderCircle className='w-5 h-5 animate-spin' /> : 'Meld deg pa'}
      </Button>
    );
  })();

  const toggleFavorite = () => {
    // TODO: Re-add individual favorite status check — previously used useEventIsFavorite()
    // The new API only has updateFavoriteEvent (PUT) and getFavoriteEvents (list all), no GET for single event
    analyticsEvent('mark-as-favorite', 'event', `Marked event (${data.title}) as favorite`);
    favoriteMutation.mutate(
      { eventId: data.id, data: { isFavorite: true } },
      {
        onSuccess: () => {
          toast.success('Arrangementet er na en av dine favoritter.');
        },
        onError: (e) => {
          toast.error(String(e));
        },
      },
    );
  };

  const info = (
    <>
      <Card>
        <CardHeader className='py-1 px-4'>
          <CardTitle className='flex items-center justify-between'>
            <h1>Detaljer</h1>
            {user && !preview && (
              <Button onClick={toggleFavorite} size='icon' variant='ghost' disabled={favoriteMutation.isPending}>
                <Heart className={cn('w-5 h-5 stroke-[1.5px]')} />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className='py-2 px-4 space-y-3'>
          <DetailContent info={formatDate(startDate)} title='Fra:' />
          <DetailContent info={formatDate(endDate)} title='Til:' />
          {data.location && <DetailContent info={data.location} title='Sted:' />}
          <DetailContent info={data.category.label} title='Hva:' />
          {data.organizer && (
            <DetailContent
              info={
                <Link to='/grupper/$slug' params={{ slug: data.organizer.slug }}>
                  {data.organizer.name}
                </Link>
              }
              title='Arrangor:'
            />
          )}
          {data.payInfo && <DetailContent info={data.payInfo.price + ' kr'} title='Pris:' />}
        </CardContent>
      </Card>

      {Boolean(data.priorityPools.length) && (
        <Card>
          <CardHeader className='py-3 px-4'>
            <CardTitle>
              <h1>Prioritert</h1>
            </CardTitle>
          </CardHeader>
          <CardContent className='py-2 px-4'>
            <div className='space-y-2'>
              {data.priorityPools.map((pool, index) => (
                <Card className='rounded-sm' key={index}>
                  <CardContent className='py-1 px-2'>
                    <h1 className='text-xs'>{pool.groups.map((g) => g.name).join(' og ')}</h1>
                  </CardContent>
                </Card>
              ))}
              <Expandable title='Hvordan fungerer prioritering?'>
                <p className='text-sm text-muted-foreground'>
                  Boksene ovenfor viser dette arrangementets prioriteringsgrupper. Du er prioritert om du er medlem av
                  alle gruppene i en av prioriteringsgruppene. Rekkefolgene til gruppene har ingenting a si.
                </p>
              </Expandable>
            </div>
          </CardContent>
        </Card>
      )}

      {data.enforcesPreviousStrikes && (
        <Alert>
          <AlertDescription>Dette arrangementet handhever aktive prikker</AlertDescription>
        </Alert>
      )}

      {applyInfo}
    </>
  );

  return (
    <div className='flex flex-col-reverse lg:flex-row gap-1 lg:gap-2 lg:mt-2'>
      <div className='w-full lg:max-w-[335px] space-y-2'>
        {/* Desktop sidebar info */}
        <div className='hidden md:block'>
          {info}
        </div>
      </div>
      <div className='space-y-2 w-full'>
        <img alt={data.title} className='rounded-md aspect-auto mx-auto' src={data.image || TIHLDE_LOGO} />

        <div className='space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between'>
          <div className='flex items-center space-x-2'>
            <ShareButton shareId={data.id} shareType='event' title={data.title} />
            {/* TODO: Re-add edit button — previously checked data.permissions.write */}
          </div>
          {/* TODO: Re-add emoji reactions — previously used ReactionHandler with emojis_allowed check */}
        </div>

        {/* Mobile info section */}
        <div className='md:hidden'>
          {info}
        </div>

        <Card>
          <CardHeader className='pt-6 pb-2 px-6'>
            <CardTitle className='text-4xl break-words'>{data.title}</CardTitle>
          </CardHeader>
          <CardContent className='py-2 px-6'>
            {/* TODO: Re-add description rendering — the new Event schema does not include a description field yet */}
            <p className='text-muted-foreground'>Beskrivelse er ikke tilgjengelig i den nye API-en enna.</p>
          </CardContent>
        </Card>

        {data.updatedAt && <UpdatedAgo updatedAt={data.updatedAt} />}
      </div>
    </div>
  );
};

export default EventRenderer;

export const EventRendererLoading = () => (
  <div className='flex flex-col-reverse lg:flex-row gap-1 lg:gap-2 lg:mt-2'>
    <div className='w-full lg:max-w-[335px] space-y-2'>
      <Skeleton className='w-full h-60' />
      <Skeleton className='w-full h-32' />
      <Skeleton className='w-full h-20' />
    </div>

    <div className='space-y-2 w-full'>
      <Skeleton className='w-full h-96' />
      <Skeleton className='w-full h-60' />
    </div>
  </div>
);
