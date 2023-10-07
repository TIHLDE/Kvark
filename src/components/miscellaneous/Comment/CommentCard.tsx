import DeleteIcon from '@mui/icons-material/Delete';
import ChatIcon from '@mui/icons-material/KeyboardReturnOutlined';
import SendIcon from '@mui/icons-material/Send';
import { Button, Card, Collapse, IconButton, Typography } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { getTimeSince } from '../../../utils';
import TextField from '../../inputs/TextField';
import Avatar from '../Avatar';
import AdminButton from './AdminButton';
import CommentDialog from './CommentDialog';
import useStyles, { INDENTATION_SPACING } from './styles';
import { CommentDispatchContext } from './temp/reducer';
import { LocalThreadLine, ThreadLine } from './ThreadLine';
import { Comment, FormValues } from './types';

export interface CommentCardProps {
  /**
   * The comment object to display
   */
  comment: Comment;
  /**
   * Wether admin controls should be displayed
   */
  isAdmin: boolean; // TODO: add member type, non-logged in users should not be able to comment
  indentation: number;
}

/**
 * Card displaying a comment and all its replies
 */
export default function CommentCard({ comment, isAdmin, indentation }: CommentCardProps) {
  const { classes, theme } = useStyles();
  const [isExpanded, setIsExpanded] = useState(false);
  const { handleSubmit, register, formState, setValue, getValues, watch } = useForm<FormValues>();
  const sendButton = useRef<HTMLButtonElement>(null);
  const firstUpdate = useRef(true);
  const [formSpacing, setFormSpacing] = useState('0px');
  const formShortMode = true;
  const [mobileMode, setIsMobileMode] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [entryAnimation, setentryAnimation] = useState(false);
  const dispatch = useContext(CommentDispatchContext);

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

  const handleReply = () => {
    if (mobileMode && !isExpanded) {
      setIsCommentDialogOpen(true);
      setIsExpanded(false);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  // Listen for escape key to close comment form
  useEffect(() => {
    window.addEventListener(
      'keydown',
      (e) => {
        if (e.key === 'Escape') {
          setIsExpanded(false);
        }
      },
      false,
    );
  }, []);

  // TODO cleanup this mess of mobile useEffect shit
  useEffect(() => {
    if (mobileMode) {
      if (isExpanded && getValues().body.length) {
        setIsExpanded(false);
        setIsCommentDialogOpen(true);
      }
    } else if (isCommentDialogOpen) {
      setIsCommentDialogOpen(false);
      setIsExpanded(true);
    }
  }, [mobileMode]);

  // For dynamic buttons (icon or text based on how much space)
  useEffect(() => {
    window.addEventListener('resize', () => {
      setIsMobileMode(window.screen.width < 480);
    });
  }, []);

  const submit: SubmitHandler<FormValues> = async (values) => {
    dispatch({
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
    });
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
            <Typography variant='body1'>
              {comment.flagged ? '[flagged as child predator]' : `${comment.author.first_name} ${comment.author.last_name}`}
            </Typography>
            <Typography variant='caption'>{getTimeSince(comment.created_at)}</Typography>
          </div>
          <div className={classes.body} style={{ marginRight: formSpacing }}>
            <Typography variant={'body1'}>{comment.flagged ? '[flagged as child predator]' : comment.body}</Typography>
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
              {formShortMode ? (
                <IconButton color='primary' type='submit'>
                  <SendIcon />
                </IconButton>
              ) : (
                <Button color={'primary'} endIcon={<SendIcon />} type={'submit'} variant={'outlined'}>
                  Send
                </Button>
              )}
            </form>
          </Collapse>
          {formShortMode ? (
            <IconButton
              color={isExpanded ? 'error' : 'primary'}
              onClick={handleReply}
              ref={sendButton}
              sx={(theme) => ({ position: 'absolute', bottom: theme.spacing(1), right: theme.spacing(1) })}>
              {isExpanded ? <DeleteIcon /> : <ChatIcon />}
            </IconButton>
          ) : (
            <Button
              color={isExpanded ? 'error' : 'primary'}
              endIcon={isExpanded ? <DeleteIcon /> : <ChatIcon />}
              onClick={handleReply}
              ref={sendButton}
              sx={(theme) => ({ position: 'absolute', bottom: theme.spacing(1), right: theme.spacing(1) })}
              variant='outlined'>
              {isExpanded ? 'Avbryt' : 'Svar'}
            </Button>
          )}

          {isAdmin && <AdminButton comment={comment} />}
          {indentation !== 0 && <LocalThreadLine />}
        </Card>
        {comment.children.map((reply) => (
          <CommentCard comment={reply} indentation={indentation + 1} isAdmin={isAdmin} key={reply.id} />
        ))}
        <ThreadLine indentation={indentation} />
        <CommentDialog
          comment={comment}
          indentation={indentation}
          initialBody={watch('body')}
          onChange={(newBody) => setValue('body', newBody)}
          onClose={() => setIsCommentDialogOpen(false)}
          open={isCommentDialogOpen}
        />
      </div>
    </Collapse>
  );
}
