import { useUser } from 'hooks/User';
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
  const { data: loggedInUser } = useUser();

  return (
    <>
      {loggedInUser?.permissions.pictures.write && <PictureUpload />}
      <ImageGrid setOpenPicture={setOpenPicture} setSelectedImg={setSelectedImg} slug={data.slug} />
      {selectedImg && <ImageDialog image={selectedImg} onClose={() => setOpenPicture(false)} open={openPicture} />}
    </>
  );
};

export default GalleryRenderer;
