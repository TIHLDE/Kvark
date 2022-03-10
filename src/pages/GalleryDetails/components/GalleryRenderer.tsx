import { useState } from 'react';

import { Gallery, Picture } from 'types';

import ImageDialog from 'pages/GalleryDetails/components/ImageDialog';
import ImageGrid from 'pages/GalleryDetails/components/ImageGrid';

export type GalleryRendererProps = {
  gallery: Gallery;
};

const GalleryRenderer = ({ gallery }: GalleryRendererProps) => {
  const [selectedImg, setSelectedImg] = useState<Picture>();
  const [pictureDialogOpen, setPictureDialogOpen] = useState(false);

  return (
    <>
      <ImageGrid setPictureDialogOpen={setPictureDialogOpen} setSelectedImg={setSelectedImg} slug={gallery.slug} />
      {selectedImg && <ImageDialog onClose={() => setPictureDialogOpen(false)} open={pictureDialogOpen} picture={selectedImg} slug={gallery.slug} />}
    </>
  );
};

export default GalleryRenderer;
