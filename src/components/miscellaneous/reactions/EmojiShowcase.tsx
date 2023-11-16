import { Stack } from '@mui/material';

import { EmojiItem } from './EmojiItem';
import { ReactionHandlerProps } from './ReactionHandler';

export const EmojiShowcase = ({ data }: ReactionHandlerProps) => {
  const emojiCollections: Record<string, number> = {};

  data?.reactions?.forEach((r) => {
    emojiCollections[r.emoji] = (emojiCollections[r.emoji] || 0) + 1;
  });

  const topEmojiCollections = Object.entries(emojiCollections)
    .map(([emoji, count]) => ({ emoji, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return (
    <Stack direction='row' spacing={1}>
      {topEmojiCollections.map((emoji, index) => (
        <EmojiItem data={data} emoji={emoji} key={index} />
      ))}
    </Stack>
  );
};
