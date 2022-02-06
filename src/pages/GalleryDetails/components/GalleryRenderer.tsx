import { useState } from 'react';
import { Gallery } from 'types';
import ImageDialog from './ImageDialog';
import ImageGrid from './ImageGrid';

type GalleryRendererProps = {
  data: Gallery;
};

const GalleryRenderer = ({ data }: GalleryRendererProps) => {
  const [selectedImg, setSelectedImg] = useState('');
  const [openPicture, setOpenPicture] = useState(false);

  return (
    <>
      <ImageGrid setOpenPicture={setOpenPicture} setSelectedImg={setSelectedImg} slug={data.slug} />
      {selectedImg && <ImageDialog image={selectedImg} onClose={() => setOpenPicture(false)} open={openPicture} />}
    </>
  );
};

export default GalleryRenderer;
