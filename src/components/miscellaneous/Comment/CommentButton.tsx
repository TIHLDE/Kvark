import AddCommentIcon from '@mui/icons-material/AddComment';
import { Button, ButtonProps } from '@mui/material';
import { useState } from 'react';

import CommentDialog from './CommentDialog';

export type CommentProps = ButtonProps & {
  title: string;
  commentType: 'event' | 'news';
};

const ShareButton = (props: CommentProps) => {
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const onClick = () => setIsCommentDialogOpen(true);
  const onClose = () => setIsCommentDialogOpen(false);
  return (
    <>
      <Button endIcon={<AddCommentIcon />} onClick={onClick} variant='outlined' {...props}>
        Kommenter
      </Button>
      <CommentDialog onClose={onClose} open={isCommentDialogOpen} />
    </>
  );
};

export default ShareButton;
