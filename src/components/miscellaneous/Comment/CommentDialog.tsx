import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';

import TextField from '../../inputs/TextField';

interface CommentDialogProps {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  content: string;
}

export default function CommentDialog({ open, onClose }: CommentDialogProps) {
  const { handleSubmit, register, formState } = useForm<FormValues>();

  const submit: SubmitHandler<FormValues> = async () => {};

  return (
    <Dialog fullWidth onClose={onClose} open={open}>
      <form onSubmit={handleSubmit(submit)}>
        <DialogTitle sx={(theme) => ({ paddingBottom: 0, paddingLeft: theme.spacing(2) })}>Legg til kommentar</DialogTitle>
        <TextField
          formState={formState}
          minRows={2}
          multiline
          sx={(theme) => ({
            paddingX: theme.spacing(1),
          })}
          variant='outlined'
          {...register('content', { required: 'Feltet er påkrevd' })}
          required
        />
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
