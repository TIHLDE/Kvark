import { useMemo } from 'react';

import { PermissionApp } from 'types/Enums';

import { useGalleries } from 'hooks/Gallery';
import { HavePermission } from 'hooks/User';

import GalleryListItem, { GalleryListItemLoading } from 'components/miscellaneous/GalleryListItem';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import Page from 'components/navigation/Page';
import { PaginateButton } from 'components/ui/button';

import CreateGallery from './components/CreateGallery';

const Galleries = () => {
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useGalleries();
  const galleries = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <Page className='space-y-12'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl lg:text-5xl font-bold'>Galleri</h1>

        <HavePermission apps={[PermissionApp.GALLERY]}>
          <CreateGallery />
        </HavePermission>
      </div>

      <div>
        {isLoading && <GalleryListItemLoading />}
        {!isLoading && !galleries.length && <NotFoundIndicator header='Fant ingen galleri' />}
        {error && <h1 className='text-center mt-4'>{error.detail}</h1>}
        {data !== undefined && (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {galleries.map((galleryItem) => (
              <GalleryListItem gallery={galleryItem} key={galleryItem.id} />
            ))}
          </div>
        )}
        {hasNextPage && <PaginateButton className='w-full mt-4' isLoading={isFetching} nextPage={fetchNextPage} />}
      </div>
    </Page>
  );
};

export default Galleries;
