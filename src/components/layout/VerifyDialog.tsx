import { useState, ReactNode } from 'react';

// Material UI Components
import { Button, ButtonProps, IconButton } from '@material-ui/core';

// Project components
import Dialog, { DialogProps } from 'components/layout/Dialog';

export type VerifyDialogProps = ButtonProps &
  Pick<DialogProps, 'onConfirm' | 'titleText' | 'contentText' | 'closeText' | 'confirmText'> & {
    dialogChildren?: ReactNode;
    iconButton?: boolean;
  };

const VerifyDialog = ({
  iconButton = false,
  onConfirm,
  titleText,
  children,
  dialogChildren,
  contentText,
  closeText,
  confirmText,
  ...props
}: VerifyDialogProps) => {
  const [open, setOpen] = useState(false);

  const confirm = onConfirm
    ? async () => {
        await onConfirm();
        setOpen(false);
      }
    : undefined;

  return (
    <>
      {iconButton ? (
        <IconButton className={props.className} onClick={() => setOpen(true)}>
          {children}
        </IconButton>
      ) : (
        <Button fullWidth variant='outlined' {...props} onClick={() => setOpen(true)}>
          {children}
        </Button>
      )}
      <Dialog
        closeText={closeText}
        confirmText={confirmText || 'Jeg er sikker'}
        contentText={contentText || 'Denne handlingen kan ikke angres.'}
        onClose={() => setOpen(false)}
        onConfirm={confirm}
        open={open}
        titleText={titleText || 'Er du sikker?'}>
        {dialogChildren}
      </Dialog>
    </>
  );
};

export default VerifyDialog;
