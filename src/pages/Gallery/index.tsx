import { styled } from '@mui/material';
import { useMemo } from 'react';

import { useGalleries } from 'hooks/Gallery';

import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import GalleryListItem, { GalleryListItemLoading } from 'components/miscellaneous/GalleryListItem';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

const GalleryGrid = styled('div')(({ theme }) => ({
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

const Galleries = () => {
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useGalleries();
  const galleries = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    // TODO: Add 'add new' button when migration is done
    // <Page
    //   banner={
    //     <Banner title='Galleri'>
    //       <HavePermission apps={[PermissionApp.GALLERY]}>
    //         <CreateGalleryDialog />
    //       </HavePermission>
    //     </Banner>
    //   }
    //   options={{ title: 'Galleri' }}>
    <div className='w-full px-2 md:px-12 mt-40'>
      <GalleryGrid>
        {isLoading && <GalleryListItemLoading />}
        {!isLoading && !galleries.length && <NotFoundIndicator header='Fant ingen galleri' />}
        {error && <Paper>{error.detail}</Paper>}
        {data !== undefined && (
          <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
            {galleries.map((galleryItem) => (
              <GalleryListItem gallery={galleryItem} key={galleryItem.id} />
            ))}
          </Pagination>
        )}
        {isFetching && <GalleryListItemLoading />}
      </GalleryGrid>
    </div>
  );
};

export default Galleries;
