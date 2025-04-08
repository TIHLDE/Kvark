import type { ContentType } from '~/types/ContentType';

import { EmojiPickerHandler } from './EmojiPickHandler';
import { EmojiShowAll } from './EmojiShowAll';
import { EmojiShowcase } from './EmojiShowcase';

export type ReactionHandlerProps = {
  data: ContentType;
  content_type: 'news' | 'event';
};

export const ReactionHandler = ({ data, content_type }: ReactionHandlerProps) => {
  return (
    <div className='flex items-center space-x-2 justify-end'>
      {data.reactions?.length ? <EmojiShowcase content_type={content_type} data={data} /> : null}
      <EmojiPickerHandler content_type={content_type} data={data} />
      <EmojiShowAll {...data} />
    </div>
  );
};
