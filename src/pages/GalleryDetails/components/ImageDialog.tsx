import { Dialog as MuiDialog, DialogProps as MuiDialogProps, Paper, Typography } from '@mui/material';
import { makeStyles } from 'makeStyles';

import { PermissionApp } from 'types/Enums';

import { HavePermission } from 'hooks/User';

import PictureEditorDialog from './PictureEditor';

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
    left: theme.spacing(2),
    bottom: theme.spacing(2),
    zIndex: 1000,
    p: '5px',
    color: 'black',
  },
}));

const ImageText = ({ title, description }: ImageTextProps) => {
  const { classes } = useStyles();
  return (
    <div className={classes.background}>
      <div className={classes.text}>
        <Typography fontSize={'150%'} variant='h2'>
          {title}
        </Typography>
        <Typography fontSize={'100%'} variant='h4'>
          {description}
        </Typography>
      </div>
    </div>
  );
};

export type DialogProps = MuiDialogProps & {
  onClose: () => void;
  contentText?: string;
  closeText?: string;
  data?: string[];
};

const ImageDialog = ({ data, open, onClose, maxWidth = 'md', fullWidth = false, ...props }: DialogProps) => {
  return (
    <MuiDialog aria-labelledby='dialog-title' fullWidth={fullWidth} maxWidth={maxWidth} onClose={onClose} open={open} {...props}>
      <div style={{ overflow: 'hidden', display: 'grid', alignContent: 'center', alignItems: 'center' }}>
        {data !== undefined && (
          <div style={{ maxWidth: '100%' }}>
            <Paper>
              <img src={data[2]} style={{ display: 'block', maxHeight: 'calc(100vh - 100px)', width: '100%', margin: 'auto' }} />
              <HavePermission apps={[PermissionApp.PICTURE]}>
                <PictureEditorDialog id={data[1]} slug={data[0]} />
              </HavePermission>
              {data[3] !== '' && <ImageText description={data[4]} title={data[3]} />}
            </Paper>
          </div>
        )}
      </div>
    </MuiDialog>
  );
};

export default ImageDialog;
