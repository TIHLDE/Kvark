import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Container, Popover, PopoverVirtualElement, Stack, styled, Typography } from '@mui/material';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { MouseEvent, useRef, useState } from 'react';

import { News, Reaction } from 'types';

import { useCreateReaction, useDeleteReaction, useUpdateReaction } from 'hooks/EmojiReaction';
import { useSnackbar } from 'hooks/Snackbar';
import { useUser } from 'hooks/User';

import Paper from 'components/layout/Paper';

const EmojiPaper = styled(Paper)(({ theme }) => ({
  padding: '8px',
  borderRadius: '8px',
  backgroundColor: theme.palette.background.paper,
}));

export type ReactionHandlerProps = {
  data: News;
};

export const EmojiShowcase = ({ data }: ReactionHandlerProps) => {
  const user = useUser();
  const showSnackbar = useSnackbar();

  const deleteReaction = useDeleteReaction(data.id);
  const createReaction = useCreateReaction();

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
    createReaction.mutate(
      { emoji: emoji, content_type: 'news', object_id: data.id },
      {
        onSuccess: () => {
          showSnackbar('Reaksjon lagt til', 'success');
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      },
    );
  };

  const emojiCollections: Record<string, number> = {};

  data?.reactions?.forEach((r) => {
    emojiCollections[r.emoji] = (emojiCollections[r.emoji] || 0) + 1;
  });

  const topEmojiCollections = Object.entries(emojiCollections)
    .sort((a, b) => b[1] - a[1])
    .filter((entry, _index, arr) => entry[1] === arr[0][1])
    .map((entry) => ({
      emoji: entry[0],
      count: entry[1],
    }));

  const hasReaction = user.data?.user_id ? data?.reactions?.find((r) => r.user === user.data?.user_id) : null;

  return (
    <Stack direction='row' spacing={1}>
      {topEmojiCollections.map((emoji, index) => {
        const userReaction = user.data?.user_id ? data?.reactions?.find((r) => r.user === user.data?.user_id && r.emoji === emoji.emoji) : null;

        if (!hasReaction) {
          return (
            <Button key={index} onClick={() => handleCreate(emoji.emoji)} variant='text'>
              <Stack direction='row' key={index} spacing={0.5}>
                <Typography>{emoji.emoji}</Typography>
                <Typography fontSize={12}>{emoji.count}</Typography>
              </Stack>
            </Button>
          );
        }
        if (userReaction) {
          return (
            <Button key={index} onClick={() => handleDelete(userReaction.reaction_id)} variant='outlined'>
              <Stack direction='row' key={index} spacing={0.5}>
                <Typography>{emoji.emoji}</Typography>
                <Typography fontSize={12}>{emoji.count}</Typography>
              </Stack>
            </Button>
          );
        }

        return (
          <Stack direction='row' key={index} padding={1} spacing={0.5}>
            <Typography>{emoji.emoji}</Typography>
            <Typography fontSize={12}>{emoji.count}</Typography>
          </Stack>
        );
      })}
    </Stack>
  );
};

export const EmojiPickerHandler = ({ data }: ReactionHandlerProps) => {
  const user = useUser();
  const showSnackbar = useSnackbar();

  const createReaction = useCreateReaction();
  const updateReaction = useUpdateReaction();

  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const openPopover = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchor(event.currentTarget);
  };

  const closePopover = () => setAnchor(null);

  const handleEmojiPick = (emoji: EmojiClickData) => {
    const userReaction = user.data?.user_id ? data?.reactions?.find((r) => r.user === user.data?.user_id) : null;

    if (userReaction) {
      updateReaction.mutate(
        { reaction_id: userReaction.reaction_id, emoji: emoji.emoji, content_type: 'news', object_id: data.id },
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
        { emoji: emoji.emoji, content_type: 'news', object_id: data.id },
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
        <AddIcon />
      </Button>

      <Popover
        anchorEl={anchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        onClose={closePopover}
        open={Boolean(anchor)}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <EmojiPicker onEmojiClick={handleEmojiPick} />
      </Popover>
    </Container>
  );
};

export const ReactionHandler = ({ data }: ReactionHandlerProps) => {
  return (
    <Stack alignItems='center' direction='row' spacing={1}>
      {data.reactions?.length ? (
        <EmojiPaper>
          <EmojiShowcase data={data} />
        </EmojiPaper>
      ) : null}
      <EmojiPickerHandler data={data} />
    </Stack>
  );
};
