import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import { Button, Container, Dialog as MuiDialog } from '@mui/material';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useState } from 'react';

import { useCreateReaction, useUpdateReaction } from 'hooks/EmojiReaction';
import { useSnackbar } from 'hooks/Snackbar';
import { useUser } from 'hooks/User';

import { ReactionHandlerProps } from './ReactionHandler';

export const EmojiPickerHandler = ({ data, content_type }: ReactionHandlerProps) => {
  const user = useUser();
  const showSnackbar = useSnackbar();

  const createReaction = useCreateReaction();
  const updateReaction = useUpdateReaction();

  const [open, setOpen] = useState<boolean>(false);

  const openPopover = () => setOpen(true);
  const closePopover = () => setOpen(false);

  const handleEmojiPick = (emoji: EmojiClickData) => {
    const userReaction = user.data?.user_id ? data?.reactions?.find((r) => r.user?.user_id === user.data?.user_id) : null;

    if (userReaction) {
      updateReaction.mutate(
        { reaction_id: userReaction.reaction_id, emoji: emoji.emoji, content_type: content_type, object_id: data.id },
        {
          onSuccess: () => {
            showSnackbar('Reaksjon oppdatert', 'success');
            closePopover();
          },
          onError: (e) => {
            showSnackbar(e.detail, 'error');
            closePopover();
          },
        },
      );
    } else {
      createReaction.mutate(
        { emoji: emoji.emoji, content_type: content_type, object_id: data.id },
        {
          onSuccess: () => {
            showSnackbar('Reaksjon lagt til', 'success');
            closePopover();
          },
          onError: (e) => {
            showSnackbar(e.detail, 'error');
            closePopover();
          },
        },
      );
    }
  };

  return (
    <Container>
      <Button onClick={openPopover} variant='outlined'>
        <AddReactionOutlinedIcon fontSize='small' />
      </Button>

      <MuiDialog onClose={closePopover} open={open}>
        <EmojiPicker onEmojiClick={handleEmojiPick} />
      </MuiDialog>
    </Container>
  );
};
