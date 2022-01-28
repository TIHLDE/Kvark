import { useState } from 'react';
import ImageGrid from './ImageGrid';
import { Gallery } from 'types/Gallery';

type GalleryRendererProps = {
  slug: string;
};

const GalleryRenderer = ({ slug }: GalleryRendererProps) => {
  const [openPicture, setOpenPicture] = useState(null);

  return (
    <div>
      <ImageGrid slug={slug} />
      {/* {openPicture && <Modal openPicture={openPicture} setOpenPicture={setOpenPicture} />} */}
    </div>
  );
};

export default GalleryRenderer;
