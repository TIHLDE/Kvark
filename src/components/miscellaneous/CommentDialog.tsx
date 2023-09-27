import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';

interface CommentDialogProps {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  content: string;
}

export default function CommentDialog({ open, onClose }: CommentDialogProps) {
  const { handleSubmit } = useForm<FormValues>();

  const submit: SubmitHandler<FormValues> = async () => {};

  return (
    <Dialog onClose={onClose} open={open}>
      <form onSubmit={handleSubmit(submit)}>
        <DialogTitle>Legg til kommentar</DialogTitle>
        <DialogActions>
          <Button color={'primary'} type={'submit'} variant={'outlined'}>
            Send
          </Button>
          <Button color={'warning'} onClick={onClose} variant={'text'}>
            Avbryt
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
