import { Paper, Typography } from '@mui/material';
import { useReducer } from 'react';

import { useUserPermissions } from '../../../hooks/User';
import AddCommentForm from './AddCommentForm';
import CommentCard from './CommentCard';
import { CommentDispatchContext, tasksReducer } from './temp/reducer';
import { sampleComments } from './temp/sampleData';

/**
 * A reusable comment section for displaying comments
 * Used in news page and event page
 */
export default function CommentSection() {
  const [comments, dispatch] = useReducer(tasksReducer, sampleComments);
  const { data: permissions } = useUserPermissions();

  const hasWritePermission = permissions?.permissions?.comment?.write;

  return (
    <CommentDispatchContext.Provider value={dispatch}>
      <Paper sx={(theme) => ({ padding: theme.spacing(2) })} variant='outlined'>
        <Typography marginBottom={(theme) => theme.spacing(2)} variant='h3'>
          Kommentarer
        </Typography>
        {hasWritePermission && <AddCommentForm />}
        {comments.map((comment) => (
          <CommentCard comment={comment} indentation={0} key={comment.id} />
        ))}
      </Paper>
    </CommentDispatchContext.Provider>
  );
}
