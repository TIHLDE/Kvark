import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React, { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import TextField from '../../inputs/TextField';
import { CommentDispatchContext } from './temp/reducer';
import { Comment, FormValues } from './types';

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
  return <Slide direction='up' ref={ref} {...props} />;
});

/**
 * Simple dialog for commenting on a comment
 * Used in mobile view for better space
 */
export default function CommentDialog({ open, onClose, comment, indentation }: CommentDialogProps) {
  const { handleSubmit, register, formState } = useForm<FormValues>();
  const dispatch = useContext(CommentDispatchContext);

  const submit: SubmitHandler<FormValues> = async (values) => {
    onClose();
    dispatch({
      type: 'reply',
      payload: {
        parentId: comment.id,
        comment: {
          author: {
            first_name: 'Mori',
            image: '',
            last_name: 'Morille',
            user_id: '123',
          },
          body: values.body,
          children: [],
          created_at: new Date(),
          id: Math.random() * 1000,
          indentation_level: indentation + 1,
          parent_id: comment.id,
          updated_at: new Date(),
        },
      },
    });
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
            name='body'
            sx={(theme) => ({
              paddingX: theme.spacing(1),
            })}
            variant='outlined'
            {...(register('body'), { required: true })}
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
