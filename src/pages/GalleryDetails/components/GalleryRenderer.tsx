import { HavePermission } from 'hooks/User';
import { useState } from 'react';
import { Gallery } from 'types';
import ImageDialog from './ImageDialog';
import ImageGrid from './ImageGrid';
import PictureUpload from './PictureUpload';
import { PermissionApp } from 'types/Enums';

type GalleryRendererProps = {
  data: Gallery;
};

const GalleryRenderer = ({ data }: GalleryRendererProps) => {
  const [selectedImg, setSelectedImg] = useState('');
  const [openPicture, setOpenPicture] = useState(false);

  return (
    <>
      <HavePermission apps={[PermissionApp.PICTURE]}>
        <PictureUpload />
      </HavePermission>
      <ImageGrid setOpenPicture={setOpenPicture} setSelectedImg={setSelectedImg} slug={data.slug} />
      {selectedImg && <ImageDialog image={selectedImg} onClose={() => setOpenPicture(false)} open={openPicture} />}
    </>
  );
};

export default GalleryRenderer;
