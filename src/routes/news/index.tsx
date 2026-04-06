import { createFileRoute } from '@tanstack/react-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import NewsListItem, { NewsListItemLoading } from '~/components/miscellaneous/NewsListItem';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import Page from '~/components/navigation/Page';
import { PaginateButton } from '~/components/ui/button';
import { getNewsInfiniteQuery } from '~/api/queries/news';

export const Route = createFileRoute('/_MainLayout/nyheter/')({
  component: News,
});

function News() {
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useInfiniteQuery(getNewsInfiniteQuery());
  const news = data ? data.pages.flatMap((page) => page.items) : [];

  return (
    <Page className='space-y-8 max-w-(--breakpoint-2xl) mx-auto'>
      <div>
        <h1 className='text-3xl md:text-5xl font-bold'>Nyheter</h1>
      </div>
      <div>
        {isLoading && <NewsListItemLoading />}
        {!isLoading && !news.length && <NotFoundIndicator header='Fant ingen nyheter' />}
        {error && <h1 className='text-center mt-8'>{error.message}</h1>}
        {data !== undefined && (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {news.map((newsItem) => (
              <NewsListItem key={newsItem.id} news={newsItem} />
            ))}
          </div>
        )}
        {hasNextPage && <PaginateButton className='w-full mt-4' isLoading={isFetching} nextPage={fetchNextPage} />}
      </div>
    </Page>
  );
}
