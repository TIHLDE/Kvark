import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteFilledIcon from '@mui/icons-material/FavoriteRounded';
import { IconButton, IconButtonProps, Button as MuiButton, Skeleton, Stack, styled, Theme, Tooltip, useMediaQuery } from '@mui/material';
import { addHours, formatDistanceToNowStrict, isFuture, isPast, parseISO, subHours } from 'date-fns';
import nbLocale from 'date-fns/locale/nb';
import { CalendarIcon, HandCoinsIcon, PencilIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate, getICSFromEvent, getStrikesDelayedRegistrationHours } from 'utils';

import { Event, Registration } from 'types';

import { useConfetti } from 'hooks/Confetti';
import {
  useCreateEventRegistration,
  useDeleteEventRegistration,
  useEventIsFavorite,
  useEventRegistration,
  useEventSetIsFavorite,
  useUpdateEventRegistration,
} from 'hooks/Event';
import { useSetRedirectUrl } from 'hooks/Misc';
import { useSnackbar } from 'hooks/Snackbar';
import { useUser } from 'hooks/User';
import { useAnalytics, useInterval } from 'hooks/Utils';

import CountdownTimer from 'pages/EventDetails/components/CountdownTimer';
import EventPriorityPools from 'pages/EventDetails/components/EventPriorityPools';
import EventPublicRegistrationsList from 'pages/EventDetails/components/EventPublicRegistrationsList';
import { EventsSubscription } from 'pages/Profile/components/ProfileEvents';

import FormUserAnswers from 'components/forms/FormUserAnswers';
import Expand from 'components/layout/Expand';
import Paper from 'components/layout/Paper';
import VerifyDialog from 'components/layout/VerifyDialog';
import { AspectRatioLoading } from 'components/miscellaneous/AspectRatioImg';
import DetailContent, { DetailContentLoading } from 'components/miscellaneous/DetailContent';
import LoadingSpinnner from 'components/miscellaneous/LoadingSpinner';
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import QRButton from 'components/miscellaneous/QRButton';
import { ReactionHandler } from 'components/miscellaneous/reactions/ReactionHandler';
import ShareButton from 'components/miscellaneous/ShareButton';
import UpdatedAgo from 'components/miscellaneous/UpdatedAgo';
import { Alert, AlertDescription } from 'components/ui/alert';
import { Button } from 'components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Checkbox } from 'components/ui/checkbox';

import TIHLDE_LOGO from 'assets/img/TihldeBackground.jpg';

const DetailsPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  display: 'grid',
  gap: theme.spacing(1),
}));

const ContentPaper = styled(Paper)({
  height: 'fit-content',
  overflowX: 'auto',
});

export type EventRendererProps = {
  data: Event;
  preview?: boolean;
};

const EventRenderer = ({ data, preview = false }: EventRendererProps) => {
  const { event } = useAnalytics();
  const { data: user } = useUser();
  const { data: registration } = useEventRegistration(data.id, preview || !user ? '' : user.user_id);
  const deleteRegistration = useDeleteEventRegistration(data.id);
  const setLogInRedirectURL = useSetRedirectUrl();
  const showSnackbar = useSnackbar();
  const startDate = parseISO(data.start_date);
  const endDate = parseISO(data.end_date);
  const strikesDelayedRegistrationHours = user ? getStrikesDelayedRegistrationHours(user.number_of_strikes) : 0;
  const startRegistrationDate = parseISO(data.start_registration_at);
  const userStartRegistrationDate = addHours(startRegistrationDate, data.enforces_previous_strikes ? strikesDelayedRegistrationHours : 0);
  const endRegistrationDate = parseISO(data.end_registration_at);
  const signOffDeadlineDate = parseISO(data.sign_off_deadline);
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
  const updateRegistration = useUpdateEventRegistration(data.id);
  const [allowPhoto, setAllowPhoto] = useState(true);
  const [isLoadingSignUp, setIsLoadingSignUp] = useState(false);

  const { run } = useConfetti();
  const createRegistration = useCreateEventRegistration(data.id);

  const handleImageRuleChange = async () => {
    updateRegistration.mutate(
      { userId: user?.user_id || '', registration: { allow_photo: !allowPhoto } },
      {
        onSuccess: (newRegistration) => {
          if (newRegistration.allow_photo === true) {
            showSnackbar('Du tillater å bli tatt bilde av', 'success');
            setAllowPhoto(true);
          } else {
            showSnackbar('Du tillater ikke å bli tatt bilde av', 'success');
            setAllowPhoto(false);
          }
        },
        onError: () => {
          showSnackbar('Endringen ble ikke registrert', 'error');
        },
      },
    );
  };

  useEffect(() => {
    setAllowPhoto(registration?.allow_photo || true);
  }, [registration]);

  const signUp = async () => {
    setIsLoadingSignUp(true);
    createRegistration.mutate(
      {},
      {
        onSuccess: () => {
          run();
          showSnackbar('Påmeldingen var vellykket', 'success');
          event('registered', 'event-registration', `Registered for event: ${data.title}`);
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
        onSettled: () => {
          setIsLoadingSignUp(false);
        },
      },
    );
  };

  const signOff = async () => {
    if (user) {
      deleteRegistration.mutate(user.user_id, {
        onSuccess: (response) => {
          showSnackbar(response.detail, 'success');
          event('unregistered', 'event-registration', `Unregistered for event: ${data.title}`);
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      });
    }
  };

  type RegistrationInfoProps = { registration: Registration; event: Event };

  const RegistrationInfo = ({ registration, event }: RegistrationInfoProps) => {
    const unregisteringGivesStrike = isPast(signOffDeadlineDate) && !registration.is_on_wait && data.can_cause_strikes;
    return (
      <>
        {registration.is_on_wait ? (
          <>
            <Alert>
              <AlertDescription>
                Du står på plass {registration.wait_queue_number}/{event.waiting_list_count} på ventelisten, vi gir deg beskjed hvis du får plass
              </AlertDescription>
            </Alert>
            {registration.survey_submission.answers.length > 0 && (
              <div>
                <Expand flat header='Dine svar på spørsmål'>
                  <FormUserAnswers submission={registration.survey_submission} />
                </Expand>
              </div>
            )}
          </>
        ) : (
          <>
            {data.paid_information && !registration.has_paid_order ? (
              <Alert variant='warning'>
                <HandCoinsIcon className='stroke-[1.5px]' />
                <AlertDescription>Du er meldt på arrangementet! Men du må huske å betale</AlertDescription>
              </Alert>
            ) : (
              <>
                <Alert variant='success'>
                  <AlertDescription>{`Du har ${registration.has_attended ? 'deltatt' : 'plass'} på arrangementet!`}</AlertDescription>
                </Alert>
                <QRButton qrValue={registration.user_info.user_id} subtitle={`${registration.user_info.first_name} ${registration.user_info.last_name}`}>
                  Påmeldingsbevis
                </QRButton>
              </>
            )}
            {registration.survey_submission.answers.length > 0 && (
              <div>
                <Expand flat header='Påmeldingsspørsmål'>
                  <FormUserAnswers submission={registration.survey_submission} />
                </Expand>
              </div>
            )}
            {registration.has_unanswered_evaluation && (
              <>
                <Alert variant='warning'>
                  <AlertDescription>
                    Du har ikke svart på evalueringen av dette arrangementet. Du må svare på den før du kan melde deg på flere arrangementer.
                  </AlertDescription>
                </Alert>
                <MuiButton component={Link} fullWidth to={`${URLS.form}${data.evaluation}/`} variant='contained'>
                  Svar på evaluering
                </MuiButton>
              </>
            )}
          </>
        )}
        {isFuture(subHours(parseISO(data.start_date), 2)) && !registration.has_paid_order ? (
          <>
            <VerifyDialog
              color='error'
              contentText={`Om du melder deg på igjen vil du havne på bunnen av en eventuell venteliste. ${
                unregisteringGivesStrike ? 'Du vil også få 1 prikk for å melde deg av etter avmeldingsfristen.' : ''
              }`}
              fullWidth
              onConfirm={signOff}
              variant='outlined'>
              Meld deg av
            </VerifyDialog>
            {unregisteringGivesStrike && (
              <Alert>
                <AlertDescription>
                  Avmeldingsfristen har passert. Du kan allikevel melde deg av frem til 2 timer før arrangementsstart, men du vil da få 1 prikk.
                </AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          <Alert>
            <AlertDescription>Det er ikke lenger mulig å melde seg av arrangementet</AlertDescription>
          </Alert>
        )}
      </>
    );
  };

  const HasUnansweredEvaluations = () =>
    user?.unanswered_evaluations_count ? (
      <Alert variant='destructive'>
        <AlertDescription>
          {`Du må svare på ${user.unanswered_evaluations_count} ubesvarte evalueringsskjemaer før du kan melde deg på flere arrangementer. Du finner dine ubesvarte evalueringsskjemaer under "Spørreskjemaer" i profilen.`}
        </AlertDescription>
      </Alert>
    ) : null;

  const ApplyInfo = () => {
    const [notOpenText, setNotOpenText] = useState<string | null>(
      isFuture(userStartRegistrationDate) ? formatDistanceToNowStrict(userStartRegistrationDate, { addSuffix: true, locale: nbLocale }) : null,
    );

    useInterval(() => {
      if (isFuture(userStartRegistrationDate)) {
        setNotOpenText(formatDistanceToNowStrict(userStartRegistrationDate, { addSuffix: true, locale: nbLocale }));
      } else {
        !notOpenText || setNotOpenText(null);
      }
    }, 1000);

    if (preview || !data.sign_up) {
      return null;
    }
    if (data.closed) {
      return (
        <Alert variant='warning'>
          <AlertDescription>Dette arrangementet er stengt. Det er derfor ikke mulig å melde seg av eller på.</AlertDescription>
        </Alert>
      );
    }
    if (notOpenText) {
      return (
        <>
          <HasUnansweredEvaluations />
          <Button className='w-full' disabled size='lg' variant='outline'>
            {`Påmelding åpner ${notOpenText}`}
          </Button>
        </>
      );
    }
    if (!user) {
      return isFuture(endRegistrationDate) ? (
        <Button className='w-full' size='lg' variant='default'>
          <Link onClick={() => setLogInRedirectURL(window.location.pathname)} to={URLS.login}>
            Logg inn for å melde deg på
          </Link>
        </Button>
      ) : null;
    }
    if (registration) {
      return <RegistrationInfo event={data} registration={registration} />;
    }
    if (isPast(endRegistrationDate)) {
      return null;
    }

    const is_prioritized = data.priority_pools.some((pool) => pool.groups.filter((group) => !group.viewer_is_member).length === 0);
    if (data.only_allow_prioritized && data.priority_pools.length > 0 && !is_prioritized) {
      return (
        <Button className='w-full' disabled size='lg' variant='outline'>
          Kun åpent for prioriterte
        </Button>
      );
    }
    return (
      <>
        <HasUnansweredEvaluations />
        <Button className='w-full' disabled={user?.unanswered_evaluations_count > 0 || isLoadingSignUp} onClick={() => signUp()} size='lg'>
          {!isLoadingSignUp ? 'Meld deg på' : <LoadingSpinnner />}
        </Button>
      </>
    );
  };

  type FavoriteProps = IconButtonProps & {
    eventId: Event['id'];
  };

  const Favorite = ({ eventId, ...props }: FavoriteProps) => {
    const { data: favorite } = useEventIsFavorite(eventId);
    const updateFavorite = useEventSetIsFavorite(eventId);
    const toggleFavorite = (isFavorite: boolean) => {
      event('mark-as-favorite', 'event', `Marked event (${data.title}) as favorite`);
      updateFavorite.mutate(
        { is_favorite: isFavorite },
        {
          onSuccess: (data) =>
            showSnackbar(
              data.is_favorite
                ? 'Arrangementet er nå en av dine favoritter. Du kan finne dine favoritter med filtrering på arrangement-siden. Vi vil varsle deg ved påmeldingsstart.'
                : 'Arrangementet er ikke lenger en av dine favoritter',
              data.is_favorite ? 'success' : 'info',
            ),
          onError: (e) => showSnackbar(e.detail, 'error'),
        },
      );
    };

    if (favorite) {
      return (
        <Tooltip title={favorite.is_favorite ? 'Fjern favorittmarkering' : 'Merk som favoritt'}>
          <IconButton {...props} onClick={() => toggleFavorite(!favorite.is_favorite)}>
            {favorite.is_favorite ? <FavoriteFilledIcon color='error' /> : <FavoriteOutlinedIcon />}
          </IconButton>
        </Tooltip>
      );
    }
    return null;
  };

  const Info = () => (
    <>
      <Card>
        <CardHeader className='py-1 px-4'>
          <CardTitle className='flex items-center justify-between'>
            <h1>Detaljer</h1>
            {user && !preview && <Favorite eventId={data.id} />}
          </CardTitle>
        </CardHeader>
        <CardContent className='py-2 px-4 space-y-3'>
          <DetailContent info={formatDate(startDate)} title='Fra:' />
          <DetailContent info={formatDate(endDate)} title='Til:' />
          <DetailContent info={data.location} title='Sted:' />
          <DetailContent
            // TODO: Fix Event types
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            info={data.category?.text || 'Laster...'}
            title='Hva:'
          />
          {data.organizer && <DetailContent info={<Link to={URLS.groups.details(data.organizer.slug)}>{data.organizer.name}</Link>} title='Arrangør:' />}
          {data.contact_person && (
            <DetailContent
              info={
                <Link
                  className='text-blue-500 dark:text-indigo-300'
                  to={`${URLS.profile}${data.contact_person?.user_id}/`}>{`${data.contact_person?.first_name} ${data.contact_person?.last_name}`}</Link>
              }
              title='Kontaktperson:'
            />
          )}
          {data.paid_information && <DetailContent info={data.paid_information.price + ' kr'} title='Pris:' />}
        </CardContent>
      </Card>
      {data.sign_up && (
        <>
          <Card>
            <CardHeader className='py-1 px-4'>
              <CardTitle className='flex items-center justify-between'>
                <h1>Påmelding</h1>
                {user && <EventPublicRegistrationsList eventId={data.id} />}
              </CardTitle>
            </CardHeader>
            <CardContent className='py-2 px-4 space-y-3'>
              <DetailContent info={`${data.list_count}/${data.limit === 0 ? '∞' : data.limit}`} title='Påmeldte:' />
              <DetailContent info={String(data.waiting_list_count)} title='Venteliste:' />
              {registration && isFuture(signOffDeadlineDate) ? (
                <DetailContent info={formatDate(signOffDeadlineDate)} title='Avmeldingsfrist:' />
              ) : (
                <>
                  {isFuture(userStartRegistrationDate) && <DetailContent info={formatDate(startRegistrationDate)} title='Start:' />}
                  {isPast(userStartRegistrationDate) && isFuture(endRegistrationDate) && (
                    <DetailContent info={formatDate(endRegistrationDate)} title='Stenger:' />
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {Boolean(data.priority_pools.length) && (
            <Card>
              <CardHeader className='py-3 px-4'>
                <CardTitle>
                  <h1>Prioritert</h1>
                </CardTitle>
              </CardHeader>
              <CardContent className='py-2 px-4'>
                <EventPriorityPools priorityPools={data.priority_pools} />
              </CardContent>
            </Card>
          )}
          {data.enforces_previous_strikes ? (
            strikesDelayedRegistrationHours > 0 &&
            isFuture(userStartRegistrationDate) && (
              <Alert variant='warning'>
                <AlertDescription>
                  Du har {user?.number_of_strikes} prikker og må dermed vente {strikesDelayedRegistrationHours} timer før du kan melde deg på
                </AlertDescription>
              </Alert>
            )
          ) : (
            <Alert>
              <AlertDescription>Dette arrangementet håndhever ikke aktive prikker</AlertDescription>
            </Alert>
          )}
        </>
      )}
      <ApplyInfo />
    </>
  );

  const addToCalendarAnalytics = () => event('add-to-calendar', 'event', `Event: ${data.title}`);

  return (
    <div className='flex flex-col-reverse lg:flex-row gap-1 lg:gap-2 lg:mt-2'>
      <div className='w-full lg:max-w-[335px] space-y-2'>
        {!lgDown && <Info />}
        <Button className='flex items-center space-x-2 w-full' size='lg' variant='outline'>
          <CalendarIcon className='stroke-[1.5px] w-5 h-5' />
          <a href={getICSFromEvent(data)} onClick={addToCalendarAnalytics}>
            Legg til i kalender
          </a>
        </Button>
        {Boolean(user) && <EventsSubscription />}
        {registration && (
          <div className='flex justify-center items-center space-x-2 mt-2'>
            <Checkbox checked={allowPhoto} onCheckedChange={handleImageRuleChange} />
            <h1>Godkjenner å bli tatt bilde av</h1>
          </div>
        )}
      </div>
      <div className='space-y-2 w-full'>
        <img alt={data.image_alt || data.title} className='rounded-md aspect-auto mx-auto' src={data.image || TIHLDE_LOGO} />

        <div className='space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between'>
          <div className='flex items-center space-x-2'>
            <ShareButton shareId={data.id} shareType='event' title={data.title} />
            {!preview && data.permissions.write && (
              <Button className='w-full flex items-center space-x-2' size='lg' variant='outline'>
                <PencilIcon className='w-4 h-4 md:w-5 md:h-5 stroke-[1.5px]' />
                <Link className='text-sm md:text-md' to={`${URLS.eventAdmin}${data.id}/`}>
                  Endre arrangement
                </Link>
              </Button>
            )}
          </div>
          {!preview && data.emojis_allowed && user && <ReactionHandler content_type='event' data={data} />}
        </div>

        {lgDown && <Info />}
        {registration && data.paid_information && !registration.has_paid_order && !registration.is_on_wait && (
          <CountdownTimer event_id={data.id} payment_expiredate={registration.payment_expiredate} />
        )}
        <Card>
          <CardHeader className='pt-6 pb-2 px-6'>
            <CardTitle className='text-4xl break-words'>{data.title}</CardTitle>
          </CardHeader>
          <CardContent className='py-2 px-6'>
            <MarkdownRenderer value={data.description} />
          </CardContent>
        </Card>

        {data.updated_at && <UpdatedAgo updatedAt={data.updated_at} />}
      </div>
    </div>
  );
};

export default EventRenderer;

export const EventRendererLoading = () => (
  <Stack direction={{ xs: 'column-reverse', lg: 'row' }} gap={1} sx={{ mt: { xs: 1, lg: 2 } }}>
    <Stack gap={1} sx={{ width: '100%', maxWidth: { lg: 335 } }}>
      <DetailsPaper noPadding>
        <DetailContentLoading />
        <DetailContentLoading />
        <DetailContentLoading />
      </DetailsPaper>
      <DetailsPaper noPadding>
        <DetailContentLoading />
        <DetailContentLoading />
      </DetailsPaper>
    </Stack>
    <Stack gap={1} sx={{ width: '100%' }}>
      <AspectRatioLoading borderRadius />
      <ContentPaper>
        <Skeleton height={80} width='60%' />
        <Skeleton height={40} width={250} />
        <Skeleton height={40} width='80%' />
        <Skeleton height={40} width='85%' />
        <Skeleton height={40} width='75%' />
        <Skeleton height={40} width='90%' />
      </ContentPaper>
    </Stack>
  </Stack>
);
