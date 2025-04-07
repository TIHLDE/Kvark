import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useHavePermission } from '~/hooks/User';
import PictureEditorDialog from '~/pages/GalleryDetails/components/PictureEditor';
import type { Picture } from '~/types';
import { PermissionApp } from '~/types/Enums';
import { useState } from 'react';

export type PictureDialogProps = {
  picture: Picture;
  galleryId: string;
};

const PictureDialog = ({ galleryId, picture }: PictureDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { allowAccess } = useHavePermission([PermissionApp.PICTURE]);

  const Image = <img alt={picture.image_alt} className='w-full object-cover rounded-md cursor-pointer' key={picture.id} loading='lazy' src={picture.image} />;

  return (
    <ResponsiveDialog description={picture.description} onOpenChange={setOpen} open={open} title={picture.title} trigger={Image}>
      <div className='space-y-4'>
        <img alt={picture.image_alt} className='w-full object-cover rounded-md' loading='lazy' src={picture.image} />

        {allowAccess && <PictureEditorDialog galleryId={galleryId} onClose={() => setOpen(false)} pictureId={picture.id} />}
      </div>
    </ResponsiveDialog>
  );
};

export default PictureDialog;
