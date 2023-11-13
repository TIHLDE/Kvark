import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useCreateComment } from '../../../hooks/Comments';
import { Comment } from '../../../types';
import TextField from '../../inputs/TextField';
import { FormValues } from './types';

interface CommentDialogProps {
  open: boolean;
  onClose: () => void;
  comment: Comment;
  indentation: number;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return (
    <Slide direction='up' ref={ref} {...props}>
      {props.children}
    </Slide>
  );
});

/**
 * Simple dialog for commenting on a comment
 * Used in mobile view for better space
 */
export default function CommentDialog({ open, onClose, comment }: CommentDialogProps) {
  const { handleSubmit, register, formState } = useForm<FormValues>();
  const { mutateAsync } = useCreateComment();

  const submit: SubmitHandler<FormValues> = async (values) => {
    await mutateAsync({
      body: values.body,
      parent: comment.id,
      content_id: comment.content_id,
      content_type: comment.content_type,
    });
    onClose();
  };

  return (
    <Dialog fullWidth onClose={onClose} open={open} TransitionComponent={Transition}>
      <form onSubmit={handleSubmit(submit)}>
        <DialogTitle sx={(theme) => ({ paddingLeft: theme.spacing(2) })}>Legg til kommentar</DialogTitle>
        <DialogContent>
          <TextField
            formState={formState}
            fullWidth
            minRows={2}
            multiline
            sx={(theme) => ({
              paddingX: theme.spacing(1),
            })}
            variant={'outlined'}
            {...register('body', { required: true })}
            required
          />
        </DialogContent>
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
