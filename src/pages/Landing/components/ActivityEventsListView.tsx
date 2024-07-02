import { useCallback, useState } from 'react';

import { useEvents } from 'hooks/Event';
import useMediaQuery, { MEDIUM_SCREEN } from 'hooks/MediaQuery';

import EventListItem, { EventListItemLoading } from 'components/miscellaneous/EventListItem';

const NO_OF_EVENTS_TO_SHOW = 6;
const NO_OF_EVENTS_TO_SHOW_MD_DOWN = 4;

type Filters = {
  activity: boolean;
};

const ActivityEventsListView = () => {
  const isDesktop = useMediaQuery(MEDIUM_SCREEN);

  const getInitialFilters = useCallback((): Filters => {
    const activity = true;
    return { activity };
  }, []);
  const [filters] = useState<Filters>(getInitialFilters());

  const { data, isLoading } = useEvents(filters);

  if (isLoading) {
    return (
      <div className='space-y-2'>
        <EventListItemLoading length={3} />
      </div>
    );
  } else if (!data?.pages[0]?.results.length) {
    return <h1 className='text-center'>Ingen kommende arrangementer</h1>;
  } else if (!isDesktop) {
    return (
      <div className='space-y-2'>
        {data?.pages[0]?.results.slice(0, NO_OF_EVENTS_TO_SHOW_MD_DOWN).map((event) => (
          <EventListItem event={event} key={event.id} size='small' />
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 gap-2'>
      {data?.pages[0].results.length ? (
        data?.pages[0]?.results.slice(0, NO_OF_EVENTS_TO_SHOW).map((event) => <EventListItem event={event} key={event.id} size='small' />)
      ) : (
        <div className='space-y-2'>
          <h1 className='text-center'>Ingen kommende aktiviteter</h1>
        </div>
      )}
    </div>
  );
};

export default ActivityEventsListView;
