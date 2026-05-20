import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { urlEncode } from '~/utils';
import { Calendar, MapPin } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { nb } from 'date-fns/locale';

type EventItem = {
  id: string;
  title: string;
  image: string | null;
  startTime: string;
  endTime: string;
  location?: string | null;
  category: { slug: string; label: string };
  organizer: { name: string; slug: string; type: string } | null;
};

export type EventListCardProps = {
  event: EventItem;
};

const EventListCard = ({ event }: EventListCardProps) => {
  const startDate = parseISO(event.startTime);

  return (
    <Link to='/arrangementer/$id/{-$urlTitle}' params={{ id: event.id, urlTitle: urlEncode(event.title) }}>
      <Card className='overflow-hidden hover:bg-accent/50 transition-colors'>
        <CardContent className='flex gap-4 p-0'>
          {event.image && (
            <img
              alt={event.title}
              className='w-[150px] md:w-[200px] lg:w-[250px] object-cover aspect-[4/3]'
              src={event.image}
            />
          )}
          <div className='flex flex-col justify-center gap-1.5 py-3 pr-4 min-w-0'>
            <h3 className='font-semibold text-sm md:text-lg truncate'>{event.title}</h3>
            <div className='flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground'>
              <Calendar className='w-3.5 h-3.5 shrink-0' />
              <span>{format(startDate, 'dd. MMM yyyy, HH:mm', { locale: nb })}</span>
            </div>
            {event.location && (
              <div className='flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground'>
                <MapPin className='w-3.5 h-3.5 shrink-0' />
                <span className='truncate'>{event.location}</span>
              </div>
            )}
            <span className='text-xs text-muted-foreground'>{event.category.label}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EventListCard;

export const EventListCardLoading = () => (
  <div className='space-y-4'>
    {Array.from({ length: 4 }).map((_, i) => (
      <Skeleton key={i} className='w-full h-24 rounded-lg' />
    ))}
  </div>
);
