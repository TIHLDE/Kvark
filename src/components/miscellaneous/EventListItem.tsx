import AspectRatioImg from '~/components/miscellaneous/AspectRatioImg';
import { Skeleton } from '~/components/ui/skeleton';
import useMediaQuery, { LARGE_SCREEN } from '~/hooks/MediaQuery';
import { cn } from '~/lib/utils';
import type { EventList } from '~/types';
import { Category, Groups } from '~/types/Enums';
import { formatDate, urlEncode } from '~/utils';
import { parseISO } from 'date-fns';
import { Calendar, Shapes } from 'lucide-react';
import { useMemo } from 'react';

import NavLink from '../ui/navlink';

export type EventListItemProps = {
  event: EventList;
  size: 'small' | 'medium' | 'large';
};

const EventListItem = ({ event, size }: EventListItemProps) => {
  const isDesktop = useMediaQuery(LARGE_SCREEN);

  const [width, titleFontSize, contentFontSize] = useMemo(() => {
    if (size === 'small') {
      return ['w-[100px] lg:w-[150px]', 'text-sm md:text-base', 'text-xs md:text-sm'];
    }

    if (size === 'medium') {
      return ['w-[150px] lg:w-[200px]', 'text-base md:text-lg', 'text-sm md:text-base'];
    }

    return ['w-[150px] md:w-[200px] lg:w-[250px]', 'text-sm md:text-lg', 'text-xs md:text-base'];
  }, [size]);

  const categoryLabel = `${event.organizer ? `${event.organizer.name} | ` : ''}${event.category?.text || 'Laster...'}`;

  const getBorderColor = (): string => {
    if (event.category?.text.toLowerCase() === Category.ACTIVITY) {
      return 'border-[#9778ce] dark:border-[#7e57c2] hover:border-[#9778ce]/30 dark:hover:border-[#7e57c2]/30';
    }

    if (
      event.organizer?.slug.toLowerCase() === Groups.NOK.toLowerCase() ||
      event.category?.text.toLowerCase() === Category.COMPRES ||
      event.category?.text.toLowerCase() === Category.COURSE
    ) {
      return 'border-[#83C4F8] dark:border-[#83C4F8] hover:border-[#83C4F8]/30 dark:hover:border-[#83C4F8]/30';
    }

    return 'border-[#FFA675] dark:border-[#FFA675] hover:border-[#FFA675]/30 dark:hover:border-[#FFA675]/30';
  };

  return (
    <NavLink
      className={`w-full p-1 rounded-md border bg-card flex space-x-2 md:space-x-6 transition-all duration-150 ${getBorderColor()}`}
      params={{ id: event.id.toString(), urlTitle: urlEncode(event.title) }}
      to='/arrangementer/:id/:urlTitle?'>
      <AspectRatioImg alt={event.image_alt || event.title} className={cn('rounded-l-sm', width)} src={event.image} />

      <div className='space-y-1 py-2 w-full contain-inline-size'>
        <h1 className={cn(titleFontSize, 'font-bold text-black dark:text-white truncate block w-full')}>{event.title}</h1>
        <div className='flex items-center space-x-1'>
          <Calendar className='w-5 h-5 stroke-[1.5px] text-muted-foreground' />
          <p className={cn('text-muted-foreground', contentFontSize)}>{formatDate(parseISO(event.start_date))}</p>
        </div>
        {isDesktop && (
          <div className='flex items-center space-x-1'>
            <Shapes className='w-5 h-5 stroke-[1.5px] text-muted-foreground' />
            <p className={cn('text-muted-foreground', contentFontSize)}>{categoryLabel}</p>
          </div>
        )}
      </div>
    </NavLink>
  );
};

export default EventListItem;

export const EventListItemLoading = ({ length = 6 }: { length?: number }) => {
  return (
    <div className='space-y-2'>
      {Array.from({ length: length }).map((_, index) => (
        <div className='bg-card rounded-md border w-full p-2 flex items-center space-x-4' key={index}>
          <Skeleton className='w-1/3 h-20' />
          <div className='space-y-2 w-full'>
            <Skeleton className='h-5 w-2/3' />
            <Skeleton className='h-5 w-2/5' />
          </div>
        </div>
      ))}
    </div>
  );
};
