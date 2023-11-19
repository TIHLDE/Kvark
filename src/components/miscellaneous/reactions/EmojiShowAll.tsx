import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { Button, Collapse, Container } from '@mui/material';
import { useState } from 'react';

import { Event, News } from 'types';

import Dialog from 'components/layout/Dialog';
import Tabs from 'components/layout/Tabs';

import { ReactionListItem } from './ReactionListItem';

export const EmojiShowAll = (data: News | Event) => {
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

  const tabs = [
    {
      value: 'all',
      label: `Alle (${data.reactions?.length})`,
    },
  ];

  topEmojiCollections.map((emoji) =>
    tabs.push({
      value: emoji.emoji,
      label: `${emoji.emoji} (${emoji.count})`,
    }),
  );

  const [tab, setTab] = useState<string>('all');

  return (
    <Container>
      <Button onClick={openDialog} variant='outlined'>
        <ArrowOutwardIcon fontSize='small' />
      </Button>

      <Dialog onClose={closeDialog} open={open}>
        <Tabs selected={tab} setSelected={setTab} tabs={tabs} />
        <Collapse in={tab === 'all'} mountOnEnter>
          {data?.reactions?.map((reaction, index) => (
            <ReactionListItem key={index} {...reaction} />
          ))}
        </Collapse>
        {tabs.slice(1).map((reactionTab, index) => (
          <Collapse in={tab === reactionTab.value} key={index} mountOnEnter>
            {data?.reactions
              ?.filter((reaction) => reaction.emoji === reactionTab.value)
              .map((reaction, index) => (
                <ReactionListItem key={index} {...reaction} />
              ))}
          </Collapse>
        ))}
      </Dialog>
    </Container>
  );
};
