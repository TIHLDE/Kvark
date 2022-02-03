// Material UI Components
import { Dialog as MuiDialog, DialogProps as MuiDialogProps, DialogTitle } from '@mui/material';

export type DialogProps = MuiDialogProps & {
  onClose: () => void;
  titleText?: string;
  contentText?: string;
  closeText?: string;
  image?: string;
};

const ImageDialog = ({ open, onClose, image, titleText, maxWidth = 'md', fullWidth = false, ...props }: DialogProps) => {
  return (
    <MuiDialog aria-labelledby='dialog-title' fullWidth={fullWidth} maxWidth={maxWidth} onClose={onClose} open={open} {...props}>
      <div style={{ overflow: 'hidden', display: 'grid', alignContent: 'center', alignItems: 'center' }}>
        {titleText && <DialogTitle id='dialog-title'>{titleText}</DialogTitle>}
        {image && <img src={image} width='100%' />}
      </div>
    </MuiDialog>
  );
};

export default ImageDialog;
