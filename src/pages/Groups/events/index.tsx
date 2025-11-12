import { createFileRoute, Link, useParams } from '@tanstack/react-router';
import EventListItem, { EventListItemLoading } from '~/components/miscellaneous/EventListItem';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import { Button, PaginateButton } from '~/components/ui/button';
import { useEvents } from '~/hooks/Event';
import { useGroup } from '~/hooks/Group';
import { useUserPermissions } from '~/hooks/User';
import { useMemo } from 'react';

export const Route = createFileRoute('/_MainLayout/grupper/$slug/arrangementer')({
  ssr: false,
  component: GroupEvents,
});

function GroupEvents() {
  const { slug } = useParams({ strict: false });
  const { data: permissions } = useUserPermissions();
  const { data: group } = useGroup(slug || '-');
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useEvents({ organizer: slug });
  const events = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <div>
      {permissions?.permissions.event.write && (
        <Button asChild className='w-full mb-4 text-black dark:text-white' variant='outline'>
          <Link to='/admin/arrangementer/{-$eventId}'>Nytt arrangement</Link>
        </Button>
      )}
      {isLoading && <EventListItemLoading />}
      {!isLoading && !events.length && <NotFoundIndicator header={`${group?.name} har ingen kommende arrangementer`} />}
      {error && <h1 className='text-center mt-4 text-muted-foreground'>{error.detail}</h1>}
      {data !== undefined && (
        <div className='space-y-2'>
          {events.map((event) => (
            <EventListItem event={event} key={event.id} size='large' />
          ))}
        </div>
      )}
      {hasNextPage && <PaginateButton className='w-full mt-4' isLoading={isFetching} nextPage={fetchNextPage} />}
    </div>
  );
}
