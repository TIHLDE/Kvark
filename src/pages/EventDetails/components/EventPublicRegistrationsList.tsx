import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button, PaginateButton } from '~/components/ui/button';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { usePublicEventRegistrations } from '~/hooks/Event';
import { useUser } from '~/hooks/User';
import type { Event } from '~/types';
import URLS from '~/URLS';
import { Users } from 'lucide-react';
import { Fragment, useMemo, useState } from 'react';
import { Link } from 'react-router';

export type EventPublicRegistrationsListProps = {
  eventId: Event['id'];
};

const EventPublicRegistrationsList = ({ eventId }: EventPublicRegistrationsListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, isError, error, hasNextPage, fetchNextPage, isFetching } = usePublicEventRegistrations(eventId, { enabled: isOpen });
  const { data: user } = useUser();
  const registrations = useMemo(() => (data ? data.pages.flatMap((page) => page.results) : []), [data]);

  const OpenButton = (
    <Button size='icon' variant='ghost'>
      <Users className='w-5 h-5' />
    </Button>
  );

  return (
    <ResponsiveDialog
      description='Oversikt over påmeldte til dette arrangementet. Du kan selv bestemme om du ønsker å stå oppført her med fullt navn eller som anonym gjennom innstillingene i din profil.'
      onOpenChange={setIsOpen}
      open={isOpen}
      title='Deltagerliste'
      trigger={OpenButton}
    >
      <ScrollArea className='h-[60vh] px-2'>
        {user?.public_event_registrations ? (
          <div>
            {isError && <h1>Noe gikk galt: {error?.detail}</h1>}
            {!isLoading && !registrations.length && !isError && <NotFoundIndicator header='Ingen brukere er påmeldt dette arrangementet' />}
            <div className='space-y-2'>
              {registrations.map((registration, index) => (
                <Fragment key={index}>
                  {registration.user_info ? (
                    <Link
                      className='w-full p-2 rounded-md border flex items-center space-x-2 text-black dark:text-white hover:bg-secondary'
                      to={`${URLS.profile}${registration.user_info.user_id}/`}
                    >
                      <Avatar className='mr-4'>
                        <AvatarImage alt={registration.user_info.first_name} src={registration.user_info.image} />
                        <AvatarFallback>{registration.user_info.first_name[0] + registration.user_info.last_name[0]}</AvatarFallback>
                      </Avatar>
                      <h1>{`${registration.user_info.first_name} ${registration.user_info.last_name}`}</h1>
                    </Link>
                  ) : (
                    <div className='w-full p-2 rounded-md border flex items-center space-x-2'>
                      <Avatar className='mr-4'>
                        <AvatarImage alt='?' src={''} />
                        <AvatarFallback>?</AvatarFallback>
                      </Avatar>
                      <h1>Anonym</h1>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>

            {hasNextPage && <PaginateButton className='w-full mt-4' isLoading={isFetching} nextPage={fetchNextPage} />}
          </div>
        ) : (
          <NotFoundIndicator header='Du må skru på offentlige påmeldinger for å se denne listen' />
        )}
      </ScrollArea>
    </ResponsiveDialog>
  );
};

export default EventPublicRegistrationsList;
