import { useInfiniteQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Button, PaginateButton } from '~/components/ui/button';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { jobPostsQuery } from '~/hooks/JobPost';
import type { JobPost } from '~/types';
import { ChevronRight, List } from 'lucide-react';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';

const JobPostList = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { data, hasNextPage, fetchNextPage, isLoading } = useInfiniteQuery(jobPostsQuery());
  const items = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <ResponsiveDialog
      description='Her kan du se en oversikt over alle jobbannonser som er lagt til i systemet.'
      onOpenChange={setOpen}
      open={open}
      title='Jobbannonser'
      trigger={
        <Button size='icon' variant='outline'>
          <List className='w-6 h-6' />
        </Button>
      }>
      <ScrollArea className='h-[60vh] pr-4'>
        {items.length === 0 && isLoading && (
          <div className='flex justify-center w-full'>
            <p className='text-lg'>Laster inn jobbannonser...</p>
          </div>
        )}

        {items.length === 0 && !isLoading && (
          <div className='flex justify-center w-full'>
            <p className='text-lg'>Ingen jobbannonser er lagt til.</p>
          </div>
        )}

        <div className='space-y-2 pb-6'>
          {items.map((jobPost) => (
            <ListItem item={jobPost} key={jobPost.id} setOpen={setOpen} />
          ))}
          {hasNextPage && <PaginateButton className='w-full' isLoading={isLoading} nextPage={fetchNextPage} />}
        </div>
      </ScrollArea>
    </ResponsiveDialog>
  );
};

type ListItemProps = {
  item: JobPost;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const ListItem = ({ item, setOpen }: ListItemProps) => {
  return (
    <Button asChild className='block w-full rounded-md border h-auto' variant='outline'>
      <Link
        className='flex items-center justify-between'
        onClick={() => setOpen(false)}
        to='/admin/stillingsannonser/{-$jobPostId}'
        params={{ jobPostId: item.id.toString() }}>
        <div>
          <h1 className='text-lg'>{item.title}</h1>
          <p>{item.company}</p>
        </div>

        <ChevronRight className='w-5 h-5 stroke-[1.5px]' />
      </Link>
    </Button>
  );
};

export default JobPostList;
