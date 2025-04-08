import { parseISO } from 'date-fns';
import { Link } from 'react-router';
import URLS from '~/URLS';
import { useEventById } from '~/hooks/Event';
import { formatDate, urlEncode } from '~/utils';

import { Skeleton } from '../../../components/ui/skeleton';

export type EventsCalendarPopoverProps = {
  id: number;
};

const EventsCalendarPopover = ({ id }: EventsCalendarPopoverProps) => {
  const { data } = useEventById(Number(id));

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
        <span className='font-bold'>Fra:</span> {formatDate(parseISO(data.start_date))}
      </p>
      <p className='text-sm'>
        <span className='font-bold'>Til:</span> {formatDate(parseISO(data.end_date))}
      </p>
      <p className='text-sm'>
        <span className='font-bold'>Sted:</span> {data.location}
      </p>
      {data.sign_up && (
        <>
          <p className='text-sm'>
            <span className='font-bold'>Påmeldte:</span> {data.list_count}
            {data.limit > 0 && `/${data.limit}`}
          </p>
          {data.waiting_list_count > 0 && (
            <p className='text-sm'>
              <span className='font-bold'>Venteliste:</span> {data.waiting_list_count}
            </p>
          )}
        </>
      )}
      <Link className='underline text-blue-500 dark:text-indigo-300' to={`${URLS.events}${data.id}/${urlEncode(data.title)}/`}>
        Til arrangement
      </Link>
    </div>
  );
};

export default EventsCalendarPopover;
