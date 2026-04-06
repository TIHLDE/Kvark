import { Link } from '@tanstack/react-router';
import AspectRatioImg from '~/components/miscellaneous/AspectRatioImg';
import { Skeleton } from '~/components/ui/skeleton';
import type { NewsListItem as NewsListItemType } from '@tihlde/sdk';
import { formatDate, urlEncode } from '~/utils';
import { parseISO } from 'date-fns';

export type NewsListItemProps = {
  news: NewsListItemType;
};

const NewsListItem = ({ news }: NewsListItemProps) => {
  return (
    <Link
      to='/nyheter/$id/{-$urlTitle}'
      params={{ id: news.id.toString(), urlTitle: urlEncode(news.title) }}
      className='rounded-md p-2 border bg-card space-y-4 cursor-pointer'>
      <AspectRatioImg alt={news.imageAlt || news.title} src={news.imageUrl ?? undefined} />

      <div>
        <h1 className='text-2xl font-bold'>{news.title}</h1>
        <p>{news.header}</p>
        <p className='text-muted-foreground'>{formatDate(parseISO(news.createdAt), { time: false })}</p>
      </div>
    </Link>
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
