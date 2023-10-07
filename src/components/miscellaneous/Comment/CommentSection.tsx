import { Paper, Typography } from '@mui/material';
import { useReducer } from 'react';

import AddCommentForm from './AddCommentForm';
import CommentCard from './CommentCard';
import { CommentDispatchContext, tasksReducer } from './temp/reducer';
import { sampleComments } from './temp/sampleData';

/**
 * A reusable comment section for displaying comments
 * Used in news page and event page
 */
export default function CommentSection() {
  const isAdmin = true;
  const [comments, dispatch] = useReducer(tasksReducer, sampleComments);

  return (
    <CommentDispatchContext.Provider value={dispatch}>
      <Paper sx={(theme) => ({ padding: theme.spacing(2) })} variant='outlined'>
        <Typography marginBottom={(theme) => theme.spacing(2)} variant='h3'>
          Kommentarer
        </Typography>
        <AddCommentForm />
        {comments.map((comment) => (
          <CommentCard comment={comment} indentation={0} isAdmin={isAdmin} key={comment.id} />
        ))}
      </Paper>
    </CommentDispatchContext.Provider>
  );
}
