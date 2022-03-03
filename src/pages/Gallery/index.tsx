// React
import { styled } from '@mui/material';
import { useMemo } from 'react';

// Hooks
import { PermissionApp } from 'types/Enums';

import { useAlbums } from 'hooks/Gallery';
import { HavePermission } from 'hooks/User';

// Material UI

// Project Components
import Banner from 'components/layout/Banner';
import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import GalleryListItem, { GalleryListItemLoading } from 'components/miscellaneous/GalleryListItem';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import Page from 'components/navigation/Page';

import CreateAlbumDialog from './components/CreateGallery';

// Types

const AlbumGrid = styled('div')(({ theme }) => ({
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
    <Page
      banner={
        <Banner title='Album'>
          <HavePermission apps={[PermissionApp.GALLERY]}>
            <CreateAlbumDialog />
          </HavePermission>
        </Banner>
      }
      options={{ title: 'Album' }}>
      <AlbumGrid>
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
      </AlbumGrid>
    </Page>
  );
};

export default Albums;
