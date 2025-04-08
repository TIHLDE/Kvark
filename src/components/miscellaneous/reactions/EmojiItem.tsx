import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { useCreateReaction, useDeleteReaction, useUpdateReaction } from '~/hooks/EmojiReaction';
import { useUser } from '~/hooks/User';
import type { Emoji, Event, News } from '~/types';

export type EmojiItemProps = {
  data: News | Event;
  emoji: Emoji;
  content_type: 'news' | 'event';
};

export const EmojiItem = ({ data, emoji, content_type }: EmojiItemProps) => {
  const user = useUser();

  const deleteReaction = useDeleteReaction();
  const createReaction = useCreateReaction();
  const updateReaction = useUpdateReaction();

  const handleDelete = (reaction_id: string) => {
    deleteReaction.mutate(reaction_id, {
      onSuccess: () => {
        toast.success('Reaksjon fjernet');
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });
  };

  const handleCreate = (emoji: string) => {
    const reaction = user.data?.user_id ? data?.reactions?.find((r) => r.user?.user_id === user.data?.user_id) : null;

    if (reaction) {
      updateReaction.mutate(
        { reaction_id: reaction.reaction_id, emoji: emoji, content_type: content_type, object_id: data.id },
        {
          onSuccess: () => {
            toast.success('Reaksjon oppdatert');
          },
          onError: (e) => {
            toast.error(e.detail);
          },
        },
      );
    } else {
      createReaction.mutate(
        { emoji: emoji, content_type: content_type, object_id: data.id },
        {
          onSuccess: () => {
            toast.success('Reaksjon lagt til');
          },
          onError: (e) => {
            toast.error(e.detail);
          },
        },
      );
    }
  };

  const userReaction = user.data?.user_id ? data?.reactions?.find((r) => r.user?.user_id === user.data?.user_id && r.emoji === emoji.emoji) : null;

  if (userReaction) {
    return (
      <Button className='px-2' onClick={() => handleDelete(userReaction.reaction_id)} variant='secondary'>
        <div className='flex items-center space-x-1'>
          <p className='text-lg'>{emoji.emoji}</p>
          <p>{emoji.count}</p>
        </div>
      </Button>
    );
  }
  return (
    <Button className='px-2' onClick={() => handleCreate(emoji.emoji)} variant='ghost'>
      <div className='flex items-center space-x-1'>
        <p className='text-lg'>{emoji.emoji}</p>
        <p>{emoji.count}</p>
      </div>
    </Button>
  );
};
