import { ReactNode } from 'react';

// Material UI Components
import { makeStyles } from '@material-ui/styles';
import { Button, Dialog as MaterialDialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
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
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
};

function Dialog({
  open,
  onClose,
  onCancel,
  onConfirm,
  titleText,
  children,
  contentText,
  closeText,
  confirmText,
  disabled = false,
  maxWidth = 'md',
  fullWidth = true,
}: DialogProps) {
  const classes = useStyles();
  return (
    <MaterialDialog aria-labelledby='form-dialog-title' fullWidth={fullWidth} maxWidth={maxWidth} onClose={onClose} open={open}>
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
