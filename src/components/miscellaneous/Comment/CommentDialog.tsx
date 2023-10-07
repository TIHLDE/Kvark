import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useContext, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import TextField from "../../inputs/TextField";
import { CommentDispatchContext } from "./temp/reducer";
import { Comment, FormValues } from "./types";

interface CommentDialogProps {
  open: boolean;
  onClose: () => void;
  initialBody?: string;
  onChange: (newBody: string) => void;
  comment: Comment;
  indentation: number;
}

/**
 * Simple dialog for commenting on a comment
 * Used in mobile view for better space
 */
export default function CommentDialog({ open, onClose, initialBody, comment, indentation, onChange }: CommentDialogProps) {
  const { handleSubmit, register, formState, watch, getValues } = useForm<FormValues>({
    defaultValues: {
      body: initialBody
    }
  });
  const dispatch = useContext(CommentDispatchContext);

  useEffect(() => {
    onChange(getValues().body);
  }, [watch('body')]);

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
    <Dialog fullWidth onClose={onClose} open={open}>
      <form onSubmit={handleSubmit(submit)}>
        <DialogTitle sx={(theme) => ({ paddingLeft: theme.spacing(2) })}>Legg til kommentar</DialogTitle>
        <DialogContent>
          <TextField
            formState={formState}
            fullWidth
            minRows={2}
            multiline
            sx={(theme) => ({
              paddingX: theme.spacin(1),
            })}
            vari"nt='outl"ned'
            {...regis"body"ody', { requir"Feltet er påkrevd"evd' })}
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
