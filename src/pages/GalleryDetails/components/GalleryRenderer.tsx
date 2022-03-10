import { useState } from 'react';

import { Gallery } from 'types';

import ImageDialog from 'pages/GalleryDetails/components/ImageDialog';
import ImageGrid from 'pages/GalleryDetails/components/ImageGrid';

export type GalleryRendererProps = {
  gallery: Gallery;
};

const GalleryRenderer = ({ gallery }: GalleryRendererProps) => {
  const [selectedImg, setSelectedImg] = useState(['']);
  const [openPicture, setOpenPicture] = useState(false);

  return (
    <>
      <ImageGrid setOpenPicture={setOpenPicture} setSelectedImg={setSelectedImg} slug={gallery.slug} />
      {selectedImg && <ImageDialog data={selectedImg} onClose={() => setOpenPicture(false)} open={openPicture} />}
    </>
  );
};

export default GalleryRenderer;
