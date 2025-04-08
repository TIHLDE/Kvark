import { useMemo } from 'react';
import NewsListItem, { NewsListItemLoading } from '~/components/miscellaneous/NewsListItem';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import Page from '~/components/navigation/Page';
import { PaginateButton } from '~/components/ui/button';
import { useNews } from '~/hooks/News';

const News = () => {
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useNews();
  const news = useMemo(() => (data ? data.pages.flatMap((page) => page.results) : []), [data]);

  return (
    <Page className='space-y-8 max-w-screen-2xl mx-auto'>
      <div>
        <h1 className='text-3xl md:text-5xl font-bold'>Nyheter</h1>
      </div>
      <div>
        {isLoading && <NewsListItemLoading />}
        {!isLoading && !news.length && <NotFoundIndicator header='Fant ingen nyheter' />}
        {error && <h1 className='text-center mt-8'>{error.detail}</h1>}
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
};

export default News;
