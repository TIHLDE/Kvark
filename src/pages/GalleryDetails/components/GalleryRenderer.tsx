import { useState } from 'react';
import { Gallery } from 'types';
import ImageGrid from './ImageGrid';

type GalleryRendererProps = {
  data: Gallery;
};

const GalleryRenderer = ({ data }: GalleryRendererProps) => {
  // const [openPicture, setOpenPicture] = useState(null);

  return (
    <div>
      <ImageGrid slug={data.slug} />
      {/* {openPicture && <Modal openPicture={openPicture} setOpenPicture={setOpenPicture} />} */}
    </div>
  );
};

export default GalleryRenderer;
