import { ButtonProps, IconButton, Button as MuiButton } from '@mui/material';
import { ReactNode, useState } from 'react';

import Dialog, { DialogProps } from 'components/layout/Dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'components/ui/alert-dialog';
import { Button } from 'components/ui/button';

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
        <MuiButton fullWidth variant='outlined' {...props} onClick={() => setOpen(true)}>
          {children}
        </MuiButton>
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

type ShadVerifyDialogProps = {
  onConfirm: () => void;
  buttonText: string;
  variant: 'outline' | 'link' | 'secondary' | 'default' | 'destructive' | 'ghost' | null | undefined;
  titleText: string;
  descriptionText: string;
  icon?: ReactNode;
};

export const ShadVerifyDialog = ({ onConfirm, buttonText, variant, titleText, descriptionText, icon }: ShadVerifyDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className='w-full' variant={variant}>
          {icon && icon} {buttonText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{titleText}</AlertDialogTitle>
          <AlertDialogDescription>{descriptionText}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Lukk</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={onConfirm}>Jeg er sikker</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VerifyDialog;
