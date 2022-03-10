import { ImageList, ImageListItem, Theme, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';

import { Picture } from 'types';

import { useGalleryPictures } from 'hooks/Gallery';

export type ImageGridProps = {
  slug: string;
  setSelectedImg: (picture?: Picture) => void;
  setPictureDialogOpen: (open: boolean) => void;
};

export const ImageGridLoading = () => {
  return (
    <ImageList cols={3} gap={8} variant='masonry'>
      <ImageListItem>
        <img loading='lazy' />
      </ImageListItem>
    </ImageList>
  );
};

const ImageGrid = ({ slug, setSelectedImg, setPictureDialogOpen }: ImageGridProps) => {
  const { data } = useGalleryPictures(slug);
  const pictures = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  const openModalWithImg = (picture: Picture) => {
    setSelectedImg(picture);
    setPictureDialogOpen(true);
  };
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  return (
    <>
      <ImageList cols={mdDown ? 1 : lgUp ? 3 : 2} gap={8} variant='masonry'>
        {data !== undefined &&
          pictures.map((image) => (
            <ImageListItem component='button' key={image.id} onClick={() => openModalWithImg(image)} sx={{ cursor: 'pointer', border: 'none' }}>
              <img
                alt='uploaded pic'
                loading='lazy'
                src={`${image.image}?w=248&fit=crop&auto=format`}
                srcSet={`${image.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
              />
            </ImageListItem>
          ))}
      </ImageList>
    </>
  );
};

export default ImageGrid;
