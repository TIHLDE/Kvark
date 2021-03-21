import { ReactNode } from 'react';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MaterialDialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

const useStyles = makeStyles((theme: Theme) => ({
  contentText: {
    color: theme.palette.text.secondary,
  },
}));

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  titleText?: string;
  children?: ReactNode;
  contentText?: string;
  closeText?: string;
  confirmText?: string;
  disabled?: boolean;
};

function Dialog({ open, onClose, onCancel, onConfirm, titleText, children, contentText, closeText, confirmText, disabled = false }: DialogProps) {
  const classes = useStyles();
  return (
    <MaterialDialog aria-labelledby='form-dialog-title' fullWidth maxWidth='md' onClose={onClose} open={open}>
      {titleText && <DialogTitle id='form-dialog-title'>{titleText}</DialogTitle>}
      {(contentText || children) && (
        <DialogContent>
          {contentText && <DialogContentText className={classes.contentText}>{contentText}</DialogContentText>}
          {children}
        </DialogContent>
      )}
      <DialogActions>
        <Button color='primary' onClick={onCancel || onClose}>
          {closeText || 'Lukk'}
        </Button>
        {onConfirm && (
          <Button color='primary' disabled={disabled} onClick={onConfirm || onCancel} variant='contained'>
            {confirmText || 'OK'}
          </Button>
        )}
      </DialogActions>
    </MaterialDialog>
  );
}

export default Dialog;
