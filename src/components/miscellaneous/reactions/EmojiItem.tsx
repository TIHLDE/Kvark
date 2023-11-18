import { Button, Stack, Typography } from '@mui/material';

import { Emoji, Event, News } from 'types';

import { useCreateReaction, useDeleteReaction, useUpdateReaction } from 'hooks/EmojiReaction';
import { useSnackbar } from 'hooks/Snackbar';
import { useUser } from 'hooks/User';

export type EmojiItemProps = {
  data: News | Event;
  emoji: Emoji;
  content_type: 'news' | 'event';
};

export const EmojiItem = ({ data, emoji, content_type }: EmojiItemProps) => {
  const user = useUser();
  const showSnackbar = useSnackbar();

  const deleteReaction = useDeleteReaction();
  const createReaction = useCreateReaction();
  const updateReaction = useUpdateReaction();

  const handleDelete = (reaction_id: string) => {
    deleteReaction.mutate(reaction_id, {
      onSuccess: () => {
        showSnackbar('Reaksjon fjernet', 'success');
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  const handleCreate = (emoji: string) => {
    const reaction = user.data?.user_id ? data?.reactions?.find((r) => r.user === user.data?.user_id) : null;

    if (reaction) {
      updateReaction.mutate(
        { reaction_id: reaction.reaction_id, emoji: emoji, content_type: content_type, object_id: data.id },
        {
          onSuccess: () => {
            showSnackbar('Reaksjon oppdatert', 'success');
          },
          onError: (e) => {
            showSnackbar(e.detail, 'error');
          },
        },
      );
    } else {
      createReaction.mutate(
        { emoji: emoji, content_type: content_type, object_id: data.id },
        {
          onSuccess: () => {
            showSnackbar('Reaksjon lagt til', 'success');
          },
          onError: (e) => {
            showSnackbar(e.detail, 'error');
          },
        },
      );
    }
  };

  const userReaction = user.data?.user_id ? data?.reactions?.find((r) => r.user === user.data?.user_id && r.emoji === emoji.emoji) : null;

  if (userReaction) {
    return (
      <Button onClick={() => handleDelete(userReaction.reaction_id)} variant='outlined'>
        <Stack direction='row' spacing={0.5}>
          <Typography sx={{ fontSize: { xs: 14, md: 16 } }}>{emoji.emoji}</Typography>
          <Typography sx={{ fontSize: { xs: 10, md: 12 } }}>{emoji.count}</Typography>
        </Stack>
      </Button>
    );
  }
  return (
    <Button onClick={() => handleCreate(emoji.emoji)} variant='text'>
      <Stack direction='row' spacing={0.5}>
        <Typography>{emoji.emoji}</Typography>
        <Typography fontSize={12}>{emoji.count}</Typography>
      </Stack>
    </Button>
  );
};
