import { createFileRoute, Link } from '@tanstack/react-router';
import EventListItem, { EventListItemLoading } from '~/components/miscellaneous/EventListItem';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import { Button } from '~/components/ui/button';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getGroupBySlugQuery } from '~/api/queries/groups';

// TODO: Re-add events query — previously used useEvents({ organizer: slug }) from ~/hooks/Event.
// The new query layer (~/api/queries/events) may have an equivalent, but organizer filtering needs to be verified.

// TODO: Re-add auth protection — previously used useUserPermissions() from ~/hooks/User

export const Route = createFileRoute('/_MainLayout/grupper/$slug/arrangementer')({
  component: GroupEvents,
});

function GroupEvents() {
  const { slug } = Route.useParams();
  const { data: group } = useSuspenseQuery(getGroupBySlugQuery(slug));

  // TODO: Replace with events query filtered by organizer when available
  const events: never[] = [];
  const isLoading = false;
  const error = null as { detail: string } | null;

  return (
    <div>
      {/* TODO: Re-add permission check — previously checked permissions?.permissions.event.write */}
      <Button asChild className='w-full mb-4 text-black dark:text-white' variant='outline'>
        <Link to='/admin/arrangementer/{-$eventId}'>Nytt arrangement</Link>
      </Button>
      {isLoading && <EventListItemLoading />}
      {!isLoading && !events.length && <NotFoundIndicator header={`${group?.name} har ingen kommende arrangementer`} />}
      {error && <h1 className='text-center mt-4 text-muted-foreground'>{error.detail}</h1>}
      {events.length > 0 && (
        <div className='space-y-2'>
          {events.map((event: { id: string }) => (
            <EventListItem event={event as never} key={event.id} size='large' />
          ))}
        </div>
      )}
    </div>
  );
}
