import { Dialog as MuiDialog, DialogProps as MuiDialogProps, Paper, Typography } from '@mui/material';
import { makeStyles } from 'makeStyles';

import { Picture } from 'types';
import { PermissionApp } from 'types/Enums';

import { HavePermission } from 'hooks/User';

import PictureEditorDialog from 'pages/GalleryDetails/components/PictureEditor';

export type ImageTextProps = {
  title: string;
  description: string;
};

const useStyles = makeStyles()((theme) => ({
  background: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    zIndex: 1000,
    background: 'rgba(255, 255, 255, 0.5)',
    p: '5px',
    color: 'white',
    maxWidth: '100%',
    width: '100%',
    maxHeight: '20%',
    height: '100%',
  },
  text: {
    float: 'left',
    position: 'absolute',
    left: theme.spacing(1),
    top: theme.spacing(1),
    zIndex: 1000,
    color: 'black',
  },
}));

const ImageText = ({ title, description }: ImageTextProps) => {
  const { classes } = useStyles();
  return (
    <div className={classes.background}>
      <div className={classes.text}>
        <Typography variant='h3'>{title}</Typography>
        <Typography variant='body1'>{description}</Typography>
      </div>
    </div>
  );
};

export type DialogProps = MuiDialogProps & {
  onClose: () => void;
  contentText?: string;
  closeText?: string;
  picture?: Picture;
  slug: string;
};

const ImageDialog = ({ slug, picture, open, onClose, maxWidth = 'md', fullWidth = false, ...props }: DialogProps) => {
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
              {picture.title !== '' && <ImageText description={picture.description} title={picture.title} />}
            </Paper>
          </div>
        )}
      </div>
    </MuiDialog>
  );
};

export default ImageDialog;
