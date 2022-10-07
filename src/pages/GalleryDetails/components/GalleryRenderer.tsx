import { ImageListItem, ImageListItemBar, Skeleton, styled } from '@mui/material';
import { useMemo, useState } from 'react';

import { Gallery, Picture } from 'types';

import { useGalleryPictures } from 'hooks/Gallery';

import PictureDialog from 'pages/GalleryDetails/components/PictureDialog';

import Pagination from 'components/layout/Pagination';

const ImageGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gridAutoRows: 'minmax(200px, max-content)',
  gridGap: theme.spacing(1),
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: '1fr 1fr',
  },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

export const GalleryRendererLoading = () => {
  return (
    <ImageGrid>
      {Array.from(Array(6)).map((_, i) => (
        <ImageListItem key={i} sx={{ border: 'none', width: '100%' }}>
          <Skeleton height={150} sx={{ borderRadius: (theme) => `${theme.shape.borderRadius}px` }} variant='rectangular' width='100%' />
        </ImageListItem>
      ))}
    </ImageGrid>
  );
};

export type GalleryRendererProps = {
  id: Gallery['id'];
};

const GalleryRenderer = ({ id }: GalleryRendererProps) => {
  const { data, hasNextPage, fetchNextPage, isFetching } = useGalleryPictures(id);
  const pictures = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  const [selectedImgId, setSelectedImgId] = useState<Picture['id'] | null>(null);
  const selectedImg = useMemo(() => pictures.find((picture) => picture.id === selectedImgId), [selectedImgId, pictures]);

  return (
    <>
      <ImageGrid>
        <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
          {pictures.map((image) => (
            <ImageListItem component='button' key={image.id} onClick={() => setSelectedImgId(image.id)} sx={{ cursor: 'pointer', border: 'none' }}>
              <img alt={image.image_alt} loading='lazy' src={image.image} />
              {image.title && <ImageListItemBar subtitle={image.description} title={image.title} />}
            </ImageListItem>
          ))}
        </Pagination>
      </ImageGrid>
      {selectedImg && <PictureDialog galleryId={id} onClose={() => setSelectedImgId(null)} picture={selectedImg} />}
    </>
  );
};

export default GalleryRenderer;
