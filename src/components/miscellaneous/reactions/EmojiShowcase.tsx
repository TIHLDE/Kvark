import { useUser } from '~/hooks/User';

import { EmojiItem } from './EmojiItem';
import { ReactionHandlerProps } from './ReactionHandler';

export const EmojiShowcase = ({ data, content_type }: ReactionHandlerProps) => {
  const user = useUser();
  const emojiCollections: Record<string, number> = {};

  data?.reactions?.forEach((r) => {
    emojiCollections[r.emoji] = (emojiCollections[r.emoji] || 0) + 1;
  });

  const topEmojiCollections = Object.entries(emojiCollections)
    .map(([emoji, count]) => ({ emoji, count }))
    .sort((a, b) => b.count - a.count);

  const userEmoji = data?.reactions?.find((r) => r.user?.user_id === user.data?.user_id)?.emoji;

  if (userEmoji) {
    return (
      <div className='flex items-center space-x-1'>
        <EmojiItem
          content_type={content_type}
          data={data}
          emoji={topEmojiCollections.find((emoji) => emoji.emoji === userEmoji) || { emoji: userEmoji, count: 0 }}
        />
        {topEmojiCollections
          .filter((emoji) => emoji.emoji !== userEmoji)
          .slice(0, 3)
          .map((emoji, index) => (
            <EmojiItem content_type={content_type} data={data} emoji={emoji} key={index} />
          ))}
      </div>
    );
  }
  return (
    <div className='flex items-center space-x-1'>
      {topEmojiCollections.slice(0, 4).map((emoji, index) => (
        <EmojiItem content_type={content_type} data={data} emoji={emoji} key={index} />
      ))}
    </div>
  );
};
