import { Dialog as MuiDialog, DialogProps as MuiDialogProps, Paper, Typography } from '@mui/material';
import { makeStyles } from 'makeStyles';

import { Picture } from 'types';
import { PermissionApp } from 'types/Enums';

import { HavePermission } from 'hooks/User';

import PictureEditorDialog from 'pages/GalleryDetails/components/PictureEditor';

const useStyles = makeStyles()((theme) => ({
  test: {
    position: 'absolute',
    bottom: 1,
    background: 'rgba(255, 255, 255, 0.5)',
    color: theme.palette.colors.tihlde,
    width: '100%',
    inlineSize: '100%',
    overflowWrap: 'break-word',
    hyphens: 'auto',
    padding: theme.spacing(1),
  },
}));

export type DialogProps = MuiDialogProps & {
  onClose: () => void;
  contentText?: string;
  closeText?: string;
  picture?: Picture;
  slug: string;
};

const ImageDialog = ({ slug, picture, open, onClose, maxWidth = 'md', fullWidth = false, ...props }: DialogProps) => {
  const { classes } = useStyles();
  return (
    <MuiDialog aria-labelledby='dialog-title' fullWidth={fullWidth} maxWidth={maxWidth} onClose={onClose} open={open} {...props}>
      <div style={{ overflow: 'hidden', display: 'grid', alignContent: 'center', alignItems: 'center' }}>
        {picture !== undefined && (
          <div style={{ maxWidth: '100%' }}>
            <Paper>
              <img src={picture.image} style={{ display: 'block', maxHeight: 'calc(100vh - 100px)', width: '100%', margin: 'auto' }} />
              <HavePermission apps={[PermissionApp.PICTURE]}>
                <PictureEditorDialog id={picture.id} slug={slug} />
              </HavePermission>
              {picture.title !== '' && (
                <div className={classes.test}>
                  <Typography variant='h3'>{picture.title}</Typography>
                  <Typography variant='body1'>{picture.description}</Typography>
                </div>
              )}
            </Paper>
          </div>
        )}
      </div>
    </MuiDialog>
  );
};

export default ImageDialog;
