// Material UI Components
import { Dialog as MuiDialog, DialogProps as MuiDialogProps, DialogTitle } from '@mui/material';

// Enums
import { PermissionApp } from 'types/Enums';

// Hooks
import { HavePermission } from 'hooks/User';

// Components
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
          <>
            <img src={data[2]} width='100%' />
            <HavePermission apps={[PermissionApp.PICTURE]}>
              <PictureEditorDialog id={data[1]} slug={data[0]} />
            </HavePermission>
          </>
        )}
      </div>
    </MuiDialog>
  );
};

export default ImageDialog;
