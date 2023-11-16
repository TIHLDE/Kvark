import { styled } from '@mui/material';
import { useMemo } from 'react';

import { useNews } from 'hooks/News';

import Banner from 'components/layout/Banner';
import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import NewsListItem, { NewsListItemLoading } from 'components/miscellaneous/NewsListItem';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import Page from 'components/navigation/Page';

const NewsGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  marginBottom: theme.spacing(2),
  gridTemplateColumns: '1fr 1fr 1fr',
  gridGap: theme.spacing(1),
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: '1fr 1fr',
  },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

const News = () => {
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useNews();
  const news = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <Page banner={<Banner title='Nyheter' />} options={{ title: 'Nyheter' }}>
      <NewsGrid>
        {isLoading && <NewsListItemLoading />}
        {!isLoading && !news.length && <NotFoundIndicator header='Fant ingen nyheter' />}
        {error && <Paper>{error.detail}</Paper>}
        {data !== undefined && (
          <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
            {news.map((newsItem) => (
              <NewsListItem key={newsItem.id} news={newsItem} />
            ))}
          </Pagination>
        )}
        {isFetching && <NewsListItemLoading />}
      </NewsGrid>
    </Page>
  );
};

export default News;
