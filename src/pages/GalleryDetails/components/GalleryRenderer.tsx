import { PaginateButton } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { useGalleryPictures } from '~/hooks/Gallery';
import useMediaQuery from '~/hooks/MediaQuery';
import PictureDialog from '~/pages/GalleryDetails/components/PictureDialog';
import type { Gallery } from '~/types';
import { useMemo } from 'react';

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

  const isThree = useMediaQuery('(min-width: 1024px)');
  const isTwo = useMediaQuery('(min-width: 768px)');
  const colCount = isThree ? 3 : isTwo ? 2 : 1;

  // Enkel round-robin fordeling
  const columns = useMemo(() => {
    const cols = Array.from({ length: colCount }, () => [] as typeof pictures);
    pictures.forEach((pic, i) => {
      cols[i % colCount].push(pic);
    });
    return cols;
  }, [pictures, colCount]);

  return (
    <div>
      <div className='mx-auto max-w-screen-2xl flex gap-4'>
        {columns.map((col, idx) => (
          <div key={idx} className='flex-1 space-y-4'>
            {col.map((image) => (
              <PictureDialog key={image.id} galleryId={id} picture={image} />
            ))}
          </div>
        ))}
      </div>

      {hasNextPage && <PaginateButton className='w-full mt-4' isLoading={isFetching} nextPage={fetchNextPage} />}
    </div>
  );
};

export default GalleryRenderer;
