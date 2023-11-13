import DeleteIcon from '@mui/icons-material/Delete';
import ChatIcon from '@mui/icons-material/KeyboardReturnOutlined';
import SendIcon from '@mui/icons-material/Send';
import { Card, Collapse, IconButton, Typography, useMediaQuery } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useUserPermissions } from '../../../hooks/User';
import { Comment } from '../../../types';
import { getTimeSince } from '../../../utils';
import TextField from '../../inputs/TextField';
import Avatar from '../Avatar';
import AdminButton from './AdminButton';
import CommentDialog from './CommentDialog';
import useStyles, { INDENTATION_SPACING } from './styles';
import { LocalThreadLine, ThreadLine } from './ThreadLine';
import { FormValues } from './types';

export interface CommentCardProps {
  /** The comment object to display */
  comment: Comment;
  /** Level of indentation for the comment */
  indentation: number;
}

/**
 * Card displaying a comment and all its replies
 */
export default function CommentCard({ comment, indentation }: CommentCardProps) {
  const { classes, theme } = useStyles();
  const [isExpanded, setIsExpanded] = useState(false);
  const { handleSubmit, register, formState, setValue } = useForm<FormValues>();
  const sendButton = useRef<HTMLButtonElement>(null);
  const firstUpdate = useRef(true);
  const [formSpacing, setFormSpacing] = useState('0px');
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [entryAnimation, setentryAnimation] = useState(false);
  const mobileMode = useMediaQuery(theme.breakpoints.down('md'));
  const { data: permissions } = useUserPermissions();

  const hasWritePermission = permissions?.permissions?.comment || true;

  // Play entry animation (expand vertical) on first render
  useEffect(() => {
    setTimeout(() => {
      setentryAnimation(true);
    }, indentation * 300);
  }, []);

  // **Okay so this is a bit of a hack**
  // Calculate spacing for comment form when expanded
  // Since the send button is absolute, we need to calculate the spacing
  // We only want to calculate the spacing when the card is expanded,
  // HOWEVER, we also need to calculate it on first render, using the firstUpdate ref
  // WARNING - I've spent a lot of time on this, so don't touch it unless you know what you're doing
  // and have a solution
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else if (!isExpanded) {
      return;
    }
    const spacingPx = Number.parseInt(theme.spacing(2).replace('px', ''));
    const spacing = (sendButton.current?.offsetWidth ?? 0) + spacingPx + 'px';

    setFormSpacing(spacing);
  }, [sendButton, isExpanded /* formShortMode */]);

  // Listen for escape key to close comment form
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    window.addEventListener('keydown', handler, false);

    () => window.removeEventListener('keydown', handler);
  }, []);

  const handleReply = () => {
    if (mobileMode && !isExpanded) {
      setIsCommentDialogOpen(true);
      setIsExpanded(false);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const submit: SubmitHandler<FormValues> = async (values) => {
    /* dispatch({
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
    }); */
    setValue('body', '');
    setIsExpanded(false);
    setIsCommentDialogOpen(false);
  };
  return (
    <Collapse
      in={entryAnimation}
      timeout={{
        appear: 0,
        enter: 300,
        exit: 200,
      }}>
      <div className={classes.thread} style={{ paddingLeft: theme.spacing(indentation ? INDENTATION_SPACING : 0) }}>
        <Card className={classes.card} variant='outlined'>
          <div className={classes.header}>
            <Avatar sx={{ width: 32, height: 32, fontSize: 14 }} user={comment.author} />
            <Typography variant='body1'>{`${comment.author.first_name} ${comment.author.last_name}`}</Typography>
            <Typography variant='caption'>{getTimeSince(new Date(comment.created_at))}</Typography>
          </div>
          <div className={classes.body} style={{ marginRight: formSpacing }}>
            <Typography variant={'body1'}>{comment.body}</Typography>
          </div>
          <Collapse
            className={classes.collapser}
            in={isExpanded}
            sx={{ width: '100%' }}
            timeout={{
              appear: 0,
              enter: 200,
              exit: 200,
            }}
            unmountOnExit>
            <form className={classes.form} onSubmit={handleSubmit(submit)} style={{ marginRight: formSpacing, paddingLeft: theme.spacing(1) }}>
              <TextField
                autoFocus={isExpanded}
                formState={formState}
                inputProps={{ style: { height: 27 } }}
                margin='none'
                placeholder='Svar på kommentar'
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
          </Collapse>
          {hasWritePermission && (
            <IconButton
              color={isExpanded ? 'error' : 'primary'}
              onClick={handleReply}
              ref={sendButton}
              sx={(theme) => ({ position: 'absolute', bottom: theme.spacing(1), right: theme.spacing(1) })}>
              {isExpanded ? <DeleteIcon /> : <ChatIcon />}
            </IconButton>
          )}

          {hasWritePermission && <AdminButton comment={comment} />}
          {indentation !== 0 && <LocalThreadLine />}
        </Card>
        {comment.children.map((reply) => (
          <CommentCard comment={reply} indentation={indentation + 1} key={reply.id} />
        ))}
        <ThreadLine indentation={indentation} />
        <CommentDialog comment={comment} indentation={indentation} onClose={() => setIsCommentDialogOpen(false)} open={isCommentDialogOpen} />
      </div>
    </Collapse>
  );
}
