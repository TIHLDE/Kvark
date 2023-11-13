import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useCreateComment } from '../../../hooks/Comments';
import { CommentContentType } from '../../../types';
import TextField from '../../inputs/TextField';
import useStyles from './styles';
import { FormValues } from './types';

interface AddCommentFormProps {
  content_type: CommentContentType;
  content_id: string;
}

/**
 * Form for adding a comment
 * Is placed at the top of the comment section
 */
export default function AddCommentForm({ content_type, content_id }: AddCommentFormProps) {
  const { classes, theme } = useStyles();
  const { handleSubmit, register, formState, setValue } = useForm<FormValues>();
  const { mutateAsync } = useCreateComment();

  const submit: SubmitHandler<FormValues> = async (values) => {
    if (values.body.length) {
      // Add the comment
      await mutateAsync({
        body: values.body,
        parent: null,
        content_id,
        content_type,
      });
      setValue('body', '');
    }
  };

  return (
    <form className={classes.topForm} onSubmit={handleSubmit(submit)} style={{ marginRight: theme.spacing(2), marginLeft: theme.spacing(0) }}>
      <TextField
        formState={formState}
        inputProps={{ style: { height: 27 } }}
        margin='none'
        placeholder='Kommenter'
        size='small'
        sx={() => ({
          height: 44,
          margin: 0,
          padding: 0,
        })}
        {...register('body')}
      />
      <IconButton color='primary' type='submit'>
        <SendIcon />
      </IconButton>
    </form>
  );
}
