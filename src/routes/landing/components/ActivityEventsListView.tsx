import EventListItem, { EventListItemLoading } from '~/components/miscellaneous/EventListItem';
import { useQuery } from '@tanstack/react-query';
import { getEventsQuery } from '~/api/queries/events';
import { toOldEventListType } from '~/routes/landing/components/event-adapter';
import { useMemo } from 'react';

const NO_OF_EVENTS_TO_SHOW = 6;
const NO_OF_EVENTS_TO_SHOW_MD_DOWN = 4;

const ActivityEventsListView = () => {
  // TODO: Add activity filter once the new API supports it
  const { data, isLoading } = useQuery(getEventsQuery(0));
  const events = useMemo(() => (data?.items ?? []).map(toOldEventListType), [data]);

  if (isLoading) {
    return (
      <div className='space-y-2'>
        <EventListItemLoading length={3} />
      </div>
    );
  }

  if (!events.length) {
    return <h1 className='text-center'>Ingen kommende arrangementer</h1>;
  }

  return (
    <>
      {/* Mobile: limited list */}
      <div className='space-y-2 md:hidden'>
        {events.slice(0, NO_OF_EVENTS_TO_SHOW_MD_DOWN).map((event) => (
          <EventListItem event={event} key={event.id} size='small' />
        ))}
      </div>
      {/* Desktop: full list in grid */}
      <div className='hidden md:grid grid-cols-2 gap-2'>
        {events.slice(0, NO_OF_EVENTS_TO_SHOW).map((event) => (
          <EventListItem event={event} key={event.id} size='small' />
        ))}
      </div>
    </>
  );
};

export default ActivityEventsListView;
