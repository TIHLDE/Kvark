import EventListItem, { EventListItemLoading } from '~/components/miscellaneous/EventListItem';
import type { EventList } from '~/types';
import { Category, Groups } from '~/types/Enums';

export type EventsListViewProps = {
  events: Array<EventList>;
  isLoading?: boolean;
};

const NO_OF_EVENTS_TO_SHOW = 3;
const NO_OF_EVENTS_TO_SHOW_MD_DOWN = 4;

const EventsListView = ({ events, isLoading = false }: EventsListViewProps) => {
  if (isLoading) {
    return (
      <>
        {/* Mobile: simple list */}
        <div className='space-y-2 md:hidden'>
          <EventListItemLoading length={3} />
        </div>
        {/* Desktop: two-column grid */}
        <div className='hidden md:grid grid-cols-2 gap-2'>
          <div className='space-y-2'>
            <EventListItemLoading length={3} />
          </div>
          <div className='space-y-2'>
            <EventListItemLoading length={3} />
          </div>
        </div>
      </>
    );
  }

  if (!events.length) {
    return <h1 className='text-center'>Ingen kommende arrangementer</h1>;
  }

  const nokEvents = events
    .filter(
      (event) =>
        event.organizer?.slug.toLowerCase() === Groups.NOK.toLowerCase() ||
        event.category?.text.toLowerCase() === 'bedpres' ||
        event.category?.text.toLowerCase() === 'kurs',
    )
    .slice(0, NO_OF_EVENTS_TO_SHOW);

  const otherEvents = events
    .filter(
      (event) =>
        event.organizer?.slug.toLowerCase() !== Groups.NOK.toLowerCase() &&
        event.category?.text.toLowerCase() !== Category.COMPRES &&
        event.category?.text.toLowerCase() !== Category.COURSE,
    )
    .slice(0, NO_OF_EVENTS_TO_SHOW);

  return (
    <>
      {/* Mobile: single list of all events */}
      <div className='space-y-2 md:hidden'>
        {events.slice(0, NO_OF_EVENTS_TO_SHOW_MD_DOWN).map((event) => (
          <EventListItem event={event} key={event.id} size='small' />
        ))}
      </div>
      {/* Desktop: two-column split by event type */}
      <div className='hidden md:grid grid-cols-2 gap-2'>
        <div className='space-y-2'>
          {nokEvents.length ? (
            nokEvents.map((event) => <EventListItem event={event} key={event.id} size='small' />)
          ) : (
            <h1 className='text-center'>Ingen kommende bedpres eller kurs</h1>
          )}
        </div>
        <div className='space-y-2'>
          {otherEvents.length ? (
            otherEvents.map((event) => <EventListItem event={event} key={event.id} size='small' />)
          ) : (
            <h1 className='text-center'>Ingen kommende sosiale eller andre arrangementer</h1>
          )}
        </div>
      </div>
    </>
  );
};

export default EventsListView;
