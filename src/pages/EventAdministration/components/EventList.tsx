import { Button, PaginateButton } from '~/components/ui/button';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useEvents } from '~/hooks/Event';
import type { EventList as Event } from '~/types';
import URLS from '~/URLS';
import { formatDate } from '~/utils';
import { parseISO } from 'date-fns';
import { ChevronRight, List } from 'lucide-react';
import { type Dispatch, type SetStateAction, useMemo, useState } from 'react';
import { Link } from 'react-router';

const EventList = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { data, hasNextPage, fetchNextPage, isLoading } = useEvents();
  const items = useMemo(() => (data ? data.pages.flatMap((page) => page.results) : []), [data]);

  return (
    <ResponsiveDialog
      description='Her kan du se en oversikt over alle arrangementer som er lagt til i systemet.'
      onOpenChange={setOpen}
      open={open}
      title='Arrangementer'
      trigger={
        <Button size='icon' variant='outline'>
          <List className='w-6 h-6' />
        </Button>
      }
    >
      <ScrollArea className='h-[60vh] pr-4'>
        {items.length === 0 && isLoading && (
          <div className='flex justify-center w-full'>
            <p className='text-lg'>Laster inn arrangementer...</p>
          </div>
        )}

        {items.length === 0 && !isLoading && (
          <div className='flex justify-center w-full'>
            <p className='text-lg'>Ingen arrangementer er lagt til.</p>
          </div>
        )}

        <div className='space-y-2 pb-6'>
          {items.map((event) => (
            <ListItem item={event} key={event.id} setOpen={setOpen} />
          ))}
          {hasNextPage && <PaginateButton className='w-full' isLoading={isLoading} nextPage={fetchNextPage} />}
        </div>
      </ScrollArea>
    </ResponsiveDialog>
  );
};

type ListItemProps = {
  item: Event;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const ListItem = ({ item, setOpen }: ListItemProps) => {
  return (
    <Button asChild className='block w-full rounded-md border h-auto text-black dark:text-white' variant='outline'>
      <Link className='flex items-center justify-between' onClick={() => setOpen(false)} to={`${URLS.eventAdmin}${item.id}/`}>
        <div>
          <h1 className='text-lg'>{item.title}</h1>
          <p className='text-muted-foreground'>{formatDate(parseISO(item.start_date))}</p>
        </div>

        <ChevronRight className='w-5 h-5 stroke-[1.5px]' />
      </Link>
    </Button>
  );
};

export default EventList;
