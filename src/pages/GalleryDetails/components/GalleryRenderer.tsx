import { useMemo } from 'react';

import { Gallery } from 'types';
import { Picture } from 'types';

import { useGalleryPictures } from 'hooks/Gallery';

import PictureDialog from 'pages/GalleryDetails/components/PictureDialog';

import { PaginateButton } from 'components/ui/button';
import { Skeleton } from 'components/ui/skeleton';

export const GalleryRendererLoading = () => {
  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton className='h-60' key={index} />
      ))}
    </div>
  );
};

export type GalleryRendererProps = {
  id: Gallery['id'];
};

const GalleryRenderer = ({ id }: GalleryRendererProps) => {
  const { data, hasNextPage, fetchNextPage, isFetching } = useGalleryPictures(id);
  const pictures = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {pictures.map((image) => (
          <PictureDialog galleryId={id} key={image.id} picture={image} />
        ))}
      </div>
      {hasNextPage && <PaginateButton className='mt-4' isLoading={isFetching} nextPage={fetchNextPage} />}
    </div>
  );
};

export default GalleryRenderer;
