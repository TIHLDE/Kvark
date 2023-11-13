import { Paper, Typography } from '@mui/material';

import { useUserPermissions } from '../../../hooks/User';
import { CommentContentType } from '../../../types';
import { Comment } from '../../../types';
import AddCommentForm from './AddCommentForm';
import CommentCard from './CommentCard';

interface CommentSectionProps {
  type: CommentContentType;
  contentId: string;
  comments: Comment[];
}

/**
 * A reusable comment section for displaying comments
 * Used in news page and event page
 */
export default function CommentSection(props: CommentSectionProps) {
  const { data: permissions } = useUserPermissions();
  const hasWritePermission = permissions?.permissions?.comment?.write || true;

  return (
    <Paper sx={(theme) => ({ padding: theme.spacing(2) })} variant='outlined'>
      <Typography marginBottom={(theme) => theme.spacing(2)} variant='h3'>
        Kommentarer
      </Typography>
      {hasWritePermission && <AddCommentForm content_id={props.contentId} content_type={props.type} />}
      {props.comments.map((comment) => (
        <CommentCard comment={comment} indentation={0} key={comment.id} />
      ))}
    </Paper>
  );
}
