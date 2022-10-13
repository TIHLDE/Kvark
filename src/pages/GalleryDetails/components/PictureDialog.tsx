import { Box, Dialog, DialogProps, Stack, Typography } from '@mui/material';

import { Picture } from 'types';
import { PermissionApp } from 'types/Enums';

import { useHavePermission } from 'hooks/User';

import PictureEditorDialog from 'pages/GalleryDetails/components/PictureEditor';

import Paper from 'components/layout/Paper';

export type PictureDialogProps = Omit<DialogProps, 'open'> & {
  onClose: () => void;
  picture: Picture;
  galleryId: string;
};

const PictureDialog = ({ galleryId, picture, onClose, ...props }: PictureDialogProps) => {
  const { allowAccess } = useHavePermission([PermissionApp.PICTURE]);
  return (
    <Dialog aria-describedby='picture-description' aria-labelledby='picture-title' maxWidth='lg' {...props} onClose={onClose} open>
      <Box alt={picture.description} component='img' src={picture.image} sx={{ display: 'block', maxWidth: '100%', maxHeight: '80vh', margin: 'auto' }} />
      {(allowAccess || picture.title || picture.description) && (
        <Stack
          component={Paper}
          direction='row'
          gap={1}
          sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, p: 2, alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            {Boolean(picture.title) && (
              <Typography id='picture-title' variant='h3'>
                {picture.title}
              </Typography>
            )}
            {Boolean(picture.description) && (
              <Typography id='picture-description' variant='body1'>
                {picture.description}
              </Typography>
            )}
          </div>
          {allowAccess && <PictureEditorDialog galleryId={galleryId} onClose={onClose} pictureId={picture.id} />}
        </Stack>
      )}
    </Dialog>
  );
};

export default PictureDialog;
