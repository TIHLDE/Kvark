import EventListItem, { EventListItemLoading } from '~/components/miscellaneous/EventListItem';
import useMediaQuery, { MEDIUM_SCREEN } from '~/hooks/MediaQuery';
import type { EventList } from '~/types';
import { Category, Groups } from '~/types/Enums';

export type EventsListViewProps = {
  events: Array<EventList>;
  isLoading?: boolean;
};

const NO_OF_EVENTS_TO_SHOW = 3;
const NO_OF_EVENTS_TO_SHOW_MD_DOWN = 4;

const EventsListView = ({ events, isLoading = false }: EventsListViewProps) => {
  const isDesktop = useMediaQuery(MEDIUM_SCREEN);

  if (isLoading && !isDesktop) {
    return (
      <div className='space-y-2'>
        <EventListItemLoading length={3} />
      </div>
    );
  } else if (isLoading) {
    return (
      <div className='grid grid-cols-2 gap-2'>
        <div className='space-y-2'>
          <EventListItemLoading length={3} />
        </div>
        <div className='space-y-2'>
          <EventListItemLoading length={3} />
        </div>
      </div>
    );
  } else if (!events.length) {
    return <h1 className='text-center'>Ingen kommende arrangementer</h1>;
  } else if (!isDesktop) {
    return (
      <div className='space-y-2'>
        {events.slice(0, NO_OF_EVENTS_TO_SHOW_MD_DOWN).map((event) => (
          <EventListItem event={event} key={event.id} size='small' />
        ))}
      </div>
    );
  }

  const getNokEvents = () =>
    events
      .filter(
        (event) =>
          event.organizer?.slug.toLowerCase() === Groups.NOK.toLowerCase() ||
          event.category?.text.toLowerCase() === 'bedpres' ||
          event.category?.text.toLowerCase() === 'kurs',
      )
      .slice(0, NO_OF_EVENTS_TO_SHOW);
  const getOtherEvents = () =>
    events
      .filter(
        (event) =>
          event.organizer?.slug.toLowerCase() !== Groups.NOK.toLowerCase() &&
          event.category?.text.toLowerCase() !== Category.COMPRES &&
          event.category?.text.toLowerCase() !== Category.COURSE,
      )
      .slice(0, NO_OF_EVENTS_TO_SHOW);

  return (
    <div className='grid grid-cols-2 gap-2'>
      <div className='space-y-2'>
        {getNokEvents().length ? (
          getNokEvents().map((event) => <EventListItem event={event} key={event.id} size='small' />)
        ) : (
          <h1 className='text-center'>Ingen kommende bedpres eller kurs</h1>
        )}
      </div>
      <div className='space-y-2'>
        {getOtherEvents().length ? (
          getOtherEvents().map((event) => <EventListItem event={event} key={event.id} size='small' />)
        ) : (
          <h1 className='text-center'>Ingen kommende sosiale eller andre arrangementer</h1>
        )}
      </div>
    </div>
  );
};

export default EventsListView;
