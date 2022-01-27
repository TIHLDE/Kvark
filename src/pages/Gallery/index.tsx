import { useMemo } from 'react';
import { useNews } from 'hooks/News';
import { useAlbums } from 'hooks/Gallery';
import { styled } from '@mui/material';

// Project Components
import Page from 'components/navigation/Page';
import Banner from 'components/layout/Banner';
import Pagination from 'components/layout/Pagination';
import GalleryListItem, { GalleryListItemLoading } from 'components/miscellaneous/GalleryListItem';
import Paper from 'components/layout/Paper';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

const NewsGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gridGap: theme.spacing(1),
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: '1fr 1fr',
  },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

const Albums = () => {
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useAlbums();
  const albums = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <Page banner={<Banner title='Album' />} options={{ title: 'Album' }}>
      <NewsGrid>
        {isLoading && <GalleryListItemLoading />}
        {!isLoading && !albums.length && <NotFoundIndicator header='Fant ingen album' />}
        {error && <Paper>{error.detail}</Paper>}
        {data !== undefined && (
          <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
            {albums.map((albumItem) => (
              <GalleryListItem album={albumItem} key={albumItem.slug} />
            ))}
          </Pagination>
        )}
        {isFetching && <GalleryListItemLoading />}
      </NewsGrid>
    </Page>
  );
};

export default Albums;
