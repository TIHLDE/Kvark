import { useMemo } from 'react';
import NewsListItem, { NewsListItemLoading } from '~/components/miscellaneous/NewsListItem';
import { useNews } from '~/hooks/News';

const NO_OF_NEWS_TO_SHOW = 2;

const NewsListView = () => {
  const { data, isLoading } = useNews();
  const news = useMemo(() => (data ? data.pages.flatMap((page) => page.results) : []), [data]);

  if (isLoading) {
    return <NewsListItemLoading />;
  }
  if (news.length) {
    return (
      <div className='grid md:grid-cols-2 gap-4'>
        {news.map((newsItem, index) => index < NO_OF_NEWS_TO_SHOW && <NewsListItem key={index} news={newsItem} />)}
      </div>
    );
  }
    return <h1 className='text-center '>Fant ingen nyheter</h1>;
};

export default NewsListView;
