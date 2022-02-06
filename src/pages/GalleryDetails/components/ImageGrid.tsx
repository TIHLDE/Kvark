import { ImageList, ImageListItem, Theme, useMediaQuery } from '@mui/material';
import { useAlbumPictures } from 'hooks/Gallery';
import { useMemo } from 'react';

type ImageGridProps = {
  slug: string;
  setSelectedImg: React.Dispatch<React.SetStateAction<string>>;
  setOpenPicture: (open: boolean) => void;
};

export const ImageGridLoading = () => {
  return (
    <ImageList cols={3} gap={8} variant='masonry'>
      <ImageListItem key={''}>
        <img loading='lazy' />
      </ImageListItem>
    </ImageList>
  );
};

const ImageGrid = ({ slug, setSelectedImg, setOpenPicture }: ImageGridProps) => {
  const { data } = useAlbumPictures(slug);
  const pictures = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  const openModalWithImg = (image: string) => {
    setSelectedImg(image);
    setOpenPicture(true);
  };
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  return (
    <>
      <ImageList cols={mdDown ? 1 : lgUp ? 3 : 2} gap={8} variant='masonry'>
        {data !== undefined &&
          pictures.map((image) => (
            <ImageListItem key={image.id}>
              <img
                alt='uploaded pic'
                loading='lazy'
                onClick={() => openModalWithImg(image.image)}
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
