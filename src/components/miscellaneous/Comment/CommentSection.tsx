import { Paper, Typography } from '@mui/material';
import { useMemo, useReducer } from 'react';

import { useUserPermissions } from '../../../hooks/User';
import AddCommentForm from './AddCommentForm';
import CommentCard from './CommentCard';
import { CommentDispatchContext, tasksReducer } from './temp/reducer';
import { sampleComments } from './temp/sampleData';
import { useParams } from 'react-router-dom';

interface CommentSectionProps {
  
}

/**
 * A reusable comment section for displaying comments
 * Used in news page and event page
 */
export default function CommentSection() {
  const [comments, dispatch] = useReducer(tasksReducer, sampleComments);
  const { data: permissions } = useUserPermissions();

  const hasWritePermission = permissions?.permissions?.comment?.write || true;

  return (
    <CommentDispatchContext.Provider value={dispatch}>
      <Paper sx={(theme) => ({ padding: theme.spacing(2) })} variant='outlined'>
        <Typography marginBottom={(theme) => theme.spacing(2)} variant='h3'>
          Kommentarer
        </Typography>
        {hasWritePermission && <AddCommentForm content_id={id} content_type={}/>}
        {comments.map((comment) => (
          <CommentCard comment={comment} indentation={0} key={comment.id} />
        ))}
      </Paper>
    </CommentDispatchContext.Provider>
  );
}