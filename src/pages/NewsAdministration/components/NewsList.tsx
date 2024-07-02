import { ChevronRight, List } from 'lucide-react';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';

import { News } from 'types';

import { useNews } from 'hooks/News';

import { Button, PaginateButton } from 'components/ui/button';
import ResponsiveDialog from 'components/ui/responsive-dialog';
import { ScrollArea } from 'components/ui/scroll-area';

const NewsList = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { data, hasNextPage, fetchNextPage, isLoading } = useNews();
  const items = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <ResponsiveDialog
      description='Her kan du se en oversikt over alle nyhetene som er lagt til i systemet.'
      onOpenChange={setOpen}
      open={open}
      title='Nyheter'
      trigger={
        <Button size='icon' variant='outline'>
          <List className='w-6 h-6' />
        </Button>
      }>
      <ScrollArea className='h-[60vh] pr-4'>
        {items.length === 0 && isLoading && (
          <div className='flex justify-center w-full'>
            <p className='text-lg'>Laster inn nyheter...</p>
          </div>
        )}

        {items.length === 0 && !isLoading && (
          <div className='flex justify-center w-full'>
            <p className='text-lg'>Ingen nyheter er lagt til.</p>
          </div>
        )}

        <div className='space-y-2 pb-6'>
          {items.map((news) => (
            <ListItem item={news} key={news.id} setOpen={setOpen} />
          ))}
          {hasNextPage && <PaginateButton className='w-full' isLoading={isLoading} nextPage={fetchNextPage} />}
        </div>
      </ScrollArea>
    </ResponsiveDialog>
  );
};

type ListItemProps = {
  item: News;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const ListItem = ({ item, setOpen }: ListItemProps) => {
  return (
    <Button asChild className='block w-full rounded-md border h-auto text-black dark:text-white' variant='outline'>
      <Link className='flex items-center justify-between' onClick={() => setOpen(false)} to={`${URLS.newsAdmin}${item.id}/`}>
        <div>
          <h1 className='text-lg'>{item.title}</h1>
          <p>{item.header}</p>
        </div>

        <ChevronRight className='w-5 h-5 stroke-[1.5px]' />
      </Link>
    </Button>
  );
};

export default NewsList;
