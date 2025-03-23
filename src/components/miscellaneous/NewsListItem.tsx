import { parseISO } from 'date-fns';
import { href, useNavigate } from 'react-router';
import AspectRatioImg from '~/components/miscellaneous/AspectRatioImg';
import { Skeleton } from '~/components/ui/skeleton';
import type { News } from '~/types';
import { formatDate, urlEncode } from '~/utils';
import { Button } from '../ui/button';

export type NewsListItemProps = {
  news: News;
};

const NewsListItem = ({ news }: NewsListItemProps) => {
  const naviate = useNavigate();

  return (
    <Button
      variant={'ghost'}
      className='rounded-md p-2 border bg-card space-y-4 cursor-pointer'
      onClick={() => naviate(href('/nyheter/:id/:urtlTitle?', { id: news.id.toString(), urtlTitle: urlEncode(news.title) }))}
    >
      <AspectRatioImg alt={news.image_alt || news.title} src={news.image} />

      <div>
        <h1 className='text-2xl font-bold'>{news.title}</h1>
        <p>{news.header}</p>
        <p className='text-muted-foreground'>{formatDate(parseISO(news.created_at), { time: false })}</p>
      </div>
    </Button>
  );
};

export default NewsListItem;

export const NewsListItemLoading = () => (
  <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
    {[...Array(6)].map((_, index) => (
      <Skeleton className='h-60' key={index} />
    ))}
  </div>
);
