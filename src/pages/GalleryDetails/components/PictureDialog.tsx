import { Box, Dialog, DialogProps, Stack, Typography } from '@mui/material';

import { Picture } from 'types';
import { PermissionApp } from 'types/Enums';

import { useHavePermission } from 'hooks/User';

import PictureEditorDialog from 'pages/GalleryDetails/components/PictureEditor';

import Paper from 'components/layout/Paper';

export type PictureDialogProps = Omit<DialogProps, 'open'> & {
  onClose: () => void;
  picture: Picture;
  gallerySlug: string;
};

const PictureDialog = ({ gallerySlug, picture, onClose, ...props }: PictureDialogProps) => {
  const { allowAccess } = useHavePermission([PermissionApp.PICTURE]);
  return (
    <Dialog aria-labelledby={picture.title} maxWidth='lg' {...props} onClose={onClose} open>
      <Box sx={{ overflow: 'hidden', display: 'grid', alignContent: 'center', alignItems: 'center' }}>
        <Box component='img' src={picture.image} sx={{ display: 'block', maxHeight: 'calc(100vh - 100px)', width: '100%', margin: 'auto' }} />
        {(allowAccess || picture.title || picture.description) && (
          <Stack
            component={Paper}
            direction='row'
            gap={1}
            sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, py: 1, px: 2, alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              {Boolean(picture.title) && <Typography variant='h3'>{picture.title}</Typography>}
              {Boolean(picture.description) && <Typography variant='body1'>{picture.description}</Typography>}
            </div>
            {allowAccess && <PictureEditorDialog gallerySlug={gallerySlug} onClose={onClose} pictureId={picture.id} />}
          </Stack>
        )}
      </Box>
    </Dialog>
  );
};

export default PictureDialog;
