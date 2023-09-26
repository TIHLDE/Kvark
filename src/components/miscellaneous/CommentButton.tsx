import AddCommentIcon from '@mui/icons-material/AddComment';
import { Button, ButtonProps } from '@mui/material';

export type CommentProps = ButtonProps & {
  title: string;
  commentType: 'event' | 'news';
};

const ShareButton = (props: CommentProps) => {
  const onClick = () => {};

  return (
    <Button endIcon={<AddCommentIcon />} onClick={onClick} variant='outlined' {...props}>
      Kommenter
    </Button>
  );
};

export default ShareButton;
