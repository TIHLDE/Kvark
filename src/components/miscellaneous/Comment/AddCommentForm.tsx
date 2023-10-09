import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';
import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import TextField from '../../inputs/TextField';
import useStyles from './styles';
import { CommentDispatchContext } from './temp/reducer';
import { FormValues } from './types';

/**
 * Form for adding a comment
 * Is placed at the top of the comment section
 */
export default function AddCommentForm() {
  const { classes, theme } = useStyles();
  const { handleSubmit, register, formState, setValue } = useForm<FormValues>();
  const dispatch = useContext(CommentDispatchContext);

  const submit: SubmitHandler<FormValues> = async (values) => {
    if (values.body.length) {
      dispatch({
        type: 'add',
        payload: {
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
            indentation_level: 0,
            parent_id: null,
            updated_at: new Date(),
          },
        },
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
