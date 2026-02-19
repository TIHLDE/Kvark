import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { listNewsInfiniteQuery, type NewsListEntry } from '~/api/queries/news';
import AspectRatioImg from '~/components/miscellaneous/AspectRatioImg';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import { PaginateButton } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { formatDate, urlEncode } from '~/utils';
import { Suspense } from 'react';

export function NewsListView() {
  return (
    <div className='space-y-4'>
      <Suspense fallback={<NewsListLoading />}>
        <NewsList />
      </Suspense>
    </div>
  );
}

function NewsList() {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery({
    ...listNewsInfiniteQuery(),
    select: (data) => data.pages.flatMap((page) => page.items),
  });

  if (!data.length) {
    return <NotFoundIndicator header='Fant ingen nyheter' />;
  }

  return (
    <>
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {data.map((item) => (
          <NewsListItem key={item.id} news={item} />
        ))}
      </div>
      {hasNextPage && <PaginateButton className='w-full mt-4' isLoading={isFetchingNextPage} nextPage={fetchNextPage} />}
    </>
  );
}

function NewsListItem({ news }: { news: NewsListEntry }) {
  return (
    <Link
      className='rounded-md p-2 border bg-card space-y-4 cursor-pointer'
      params={{ id: news.id, urlTitle: urlEncode(news.title) }}
      to='/nyheter/$id/{-$urlTitle}'>
      <AspectRatioImg alt={news.imageAlt ?? news.title} src={news.imageUrl ?? undefined} />
      <div>
        <h1 className='text-2xl font-bold'>{news.title}</h1>
        <p>{news.header}</p>
        <p className='text-muted-foreground'>{formatDate(news.createdAt, { time: false })}</p>
      </div>
    </Link>
  );
}

function NewsListLoading() {
  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton className='h-60' key={i} />
      ))}
    </div>
  );
}
