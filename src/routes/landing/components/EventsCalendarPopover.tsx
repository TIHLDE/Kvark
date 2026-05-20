import { Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getEventByIdQuery } from '~/api/queries/events';
import { formatDate, urlEncode } from '~/utils';
import { parseISO } from 'date-fns';

import { Skeleton } from '~/components/ui/skeleton';

export type EventsCalendarPopoverProps = {
  id: number;
};

const EventsCalendarPopover = ({ id }: EventsCalendarPopoverProps) => {
  const { data } = useQuery(getEventByIdQuery(String(id)));

  // show skeleton if no data yet
  if (!data) {
    return (
      <div className='space-y-2'>
        <h1 className='font-bold text-lg'>
          <Skeleton className='w-[200px] h-6' />
        </h1>
        <p className='text-sm'>
          <Skeleton className='w-[150px] h-4' />
        </p>
        <p className='text-sm'>
          <Skeleton className='w-[120px] h-4' />
        </p>
        <p className='text-sm'>
          <Skeleton className='w-[220px] h-4' />
        </p>
        <p>
          <Skeleton className='w-[210px] h-4' />
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      <h1 className='font-bold text-lg'>{data.title}</h1>
      <p className='text-sm'>
        <span className='font-bold'>Fra:</span> {formatDate(parseISO(data.startTime))}
      </p>
      <p className='text-sm'>
        <span className='font-bold'>Til:</span> {formatDate(parseISO(data.endTime))}
      </p>
      {data.location && (
        <p className='text-sm'>
          <span className='font-bold'>Sted:</span> {data.location}
        </p>
      )}
      <Link
        className='underline text-blue-500 dark:text-indigo-300'
        to='/arrangementer/$id/{-$urlTitle}'
        params={{ id: data.id.toString(), urlTitle: urlEncode(data.title) }}>
        Til arrangement
      </Link>
    </div>
  );
};

export default EventsCalendarPopover;
