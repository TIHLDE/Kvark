import { ImageList, ImageListItem } from '@mui/material';
import { useAlbumPictures } from 'hooks/Gallery';
import { useMemo } from 'react';

type ImageGridProps = {
  slug: string;
};

export const ImageGridLoading = () => {
  return (
    <ImageList cols={3} gap={8} variant='masonry'>
      <ImageListItem key={''}>
        <img loading='lazy' src={''} srcSet={''} />
      </ImageListItem>
    </ImageList>
  );
};

const ImageGrid = ({ slug }: ImageGridProps) => {
  const { data, isLoading, isError } = useAlbumPictures(slug);
  const pictures = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  return (
    <>
      Error?
      {/* {isLoading && <ImageGridLoading />}
      {isError && <Http404 />}
      <ImageList cols={3} gap={8} variant='masonry'>
        {data !== undefined &&
          pictures.map((image) => (
            <ImageListItem key={image.id}>
              <img
                alt='uploaded pic'
                loading='lazy'
                //   onClick={() => goToPicture(image.image)}
                src={`${image.image}?w=248&fit=crop&auto=format`}
                srcSet={`${image.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
              />
            </ImageListItem>
          ))}
      </ImageList> */}
    </>
  );
};

export default ImageGrid;
