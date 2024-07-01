import { parseISO } from 'date-fns';
import { cn } from 'lib/utils';
import { Calendar, Shapes } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate, urlEncode } from 'utils';

import { EventList } from 'types';
import { Category, Groups } from 'types/Enums';

import useMediaQuery, { LARGE_SCREEN } from 'hooks/MediaQuery';

import AspectRatioImg from 'components/miscellaneous/AspectRatioImg';
import { Skeleton } from 'components/ui/skeleton';

export type EventListItemProps = {
  event: EventList;
  size: 'small' | 'medium' | 'large';
};

const EventListItem = ({ event, size }: EventListItemProps) => {
  const isDesktop = useMediaQuery(LARGE_SCREEN);

  const [width, titleFontSize, contentFontSize] = useMemo(() => {
    if (size === 'small') {
      return ['w-[150px]', 'text-sm md:text-base', 'text-xs md:text-sm'];
    }

    if (size === 'medium') {
      return ['w-[200px]', 'text-base md:text-lg', 'text-sm md:text-base'];
    }

    return ['w-[200px] lg:w-[250px]', 'text-sm md:text-lg', 'text-xs md:text-base'];
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
    <Link
      className={`w-full p-1 rounded-md border flex space-x-2 md:space-x-6 bg-inherit transition-all duration-150 ${getBorderColor()}`}
      to={`${URLS.events}${event.id}/${urlEncode(event.title)}/`}>
      <AspectRatioImg alt={event.image_alt || event.title} className={`rounded-l-sm ${width}`} src={event.image} />

      <div className='py-2 space-y-1'>
        <h1 className={cn(titleFontSize, 'font-bold text-black dark:text-white')}>{event.title}</h1>
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
    </Link>
  );
};

export default EventListItem;

export const EventListItemLoading = () => {
  return (
    <div className='space-y-2'>
      {Array.from({ length: 6 }).map((_, index) => (
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
