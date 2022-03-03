import { DialogTitle, Dialog as MuiDialog, DialogProps as MuiDialogProps, Paper, Typography } from '@mui/material';

import { PermissionApp } from 'types/Enums';

import { HavePermission } from 'hooks/User';

import PictureEditorDialog from './PictureEditor';

export type DialogProps = MuiDialogProps & {
  onClose: () => void;
  titleText?: string;
  contentText?: string;
  closeText?: string;
  data?: string[];
};

const ImageDialog = ({ data, open, onClose, titleText, maxWidth = 'md', fullWidth = false, ...props }: DialogProps) => {
  return (
    <MuiDialog aria-labelledby='dialog-title' fullWidth={fullWidth} maxWidth={maxWidth} onClose={onClose} open={open} {...props}>
      <div style={{ overflow: 'hidden', display: 'grid', alignContent: 'center', alignItems: 'center' }}>
        {titleText && <DialogTitle id='dialog-title'>{titleText}</DialogTitle>}
        {data !== undefined && (
          <div style={{ maxWidth: '100%' }}>
            <Paper>
              <img src={data[2]} style={{ display: 'block', maxHeight: 'calc(100vh - 100px)', width: '100%', margin: 'auto' }} />
            </Paper>
            <Paper>
              {/* <Typography>{data[3]}</Typography>
              <Typography>{data[4]}</Typography> */}
              <div style={{ marginRight: 0, marginLeft: 'auto' }}>
                <HavePermission apps={[PermissionApp.PICTURE]}>
                  <PictureEditorDialog id={data[1]} slug={data[0]} />
                </HavePermission>
              </div>
            </Paper>
          </div>
        )}
      </div>
    </MuiDialog>
  );
};

export default ImageDialog;
