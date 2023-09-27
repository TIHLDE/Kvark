import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import { Card, CardContent, Divider, IconButton, Paper, Typography } from '@mui/material';
import { makeStyles } from 'makeStyles';

import { User } from '../../../types';
import { getTimeSince } from '../../../utils';
import Avatar from '../Avatar';

const isAdmin = true;

const useStyles = makeStyles()((theme) => ({
  parent: {
    display: 'flex',
    gap: theme.spacing(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'start',
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    padding: theme.spacing(1),
    flexBasis: 50,
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'end',
  },
  horizontal: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

interface Comment {
  content: string;
  id: string;
  author: Pick<User, 'first_name' | 'last_name' | 'user_id' | 'image'>;
  replies: Comment[];
  createdAt: Date;
}
const sampleComments: Comment[] = [
  {
    author: {
      first_name: 'Mori',
      last_name: 'Morisen',
      image: '',
      user_id: 'fjdksljf',
    },
    id: '4839',
    content: 'Wow! Det var sykt kult!',
    createdAt: new Date(2, 3, 2),
    replies: [
      {
        author: {
          first_name: 'Mori',
          last_name: 'Morisen',
          image: '',
          user_id: 'fjdksljf',
        },
        id: '4839',
        content: 'Veldig fin kommentar!',
        createdAt: new Date(2, 3, 2),
        replies: [],
      },
    ],
  },
  {
    author: {
      first_name: 'Adrian',
      last_name: 'Lollern',
      image: '',
      user_id: 'fds',
    },
    id: '4839',
    content: 'Veldig kult ass',
    createdAt: new Date(2, 3, 2),
    replies: [],
  },
];

export default function CommentSection() {
  return (
    <Paper sx={(theme) => ({ padding: theme.spacing(2) })} variant='outlined'>
      <Typography variant='h3'>Kommentarer</Typography>
      {sampleComments.map((comment) => (
        <>
          <CommentCard comment={comment} key={comment.id} />
          <Divider role='presentation' />
        </>
      ))}
    </Paper>
  );
}

interface CommentCardProps {
  comment: Comment;
}

function CommentCard({ comment }: CommentCardProps) {
  const { classes } = useStyles();

  return (
    <Card className={classes.parent}>
      <div className={classes.left}>
        <Avatar sx={{ width: 32, height: 32, fontSize: 14 }} user={comment.author} />
      </div>
      <div className={classes.center}>
        <span className={classes.horizontal}>
          <Typography variant='body1'>{`${comment.author.first_name} ${comment.author.last_name}`}</Typography>
          <Typography variant='caption'>{getTimeSince(comment.createdAt)}</Typography>
        </span>
        <CardContent>{comment.content}</CardContent>
      </div>
      <div className={classes.right}>
        <IconButton>
          <ReplyIcon />
        </IconButton>
        {isAdmin && (
          <IconButton color='error'>
            <DeleteIcon />
          </IconButton>
        )}
      </div>
    </Card>
  );
}
