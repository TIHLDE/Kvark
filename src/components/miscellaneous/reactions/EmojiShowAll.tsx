import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { Button, Container, Grid } from '@mui/material';
import { useState } from 'react';

import Dialog from 'components/layout/Dialog';

import { EmojiItem } from './EmojiItem';
import { ReactionHandlerProps } from './ReactionHandler';

export const EmojiShowAll = ({ data }: ReactionHandlerProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  const emojiCollections: Record<string, number> = {};

  data?.reactions?.forEach((r) => {
    emojiCollections[r.emoji] = (emojiCollections[r.emoji] || 0) + 1;
  });

  const topEmojiCollections = Object.entries(emojiCollections)
    .sort((a, b) => b[1] - a[1])
    .map((entry) => ({
      emoji: entry[0],
      count: entry[1],
    }));

  return (
    <Container>
      <Button onClick={openDialog} variant='outlined'>
        <ArrowOutwardIcon />
      </Button>

      <Dialog onClose={closeDialog} open={open} titleText={`Alle reaksjoner (${data.reactions?.length})`}>
        <Grid columns={2} container gap={2}>
          {topEmojiCollections.map((emoji, index) => (
            <EmojiItem data={data} emoji={emoji} key={index} />
          ))}
        </Grid>
      </Dialog>
    </Container>
  );
};
