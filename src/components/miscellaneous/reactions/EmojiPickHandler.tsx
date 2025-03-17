import { Button } from '~/components/ui/button';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useCreateReaction, useUpdateReaction } from '~/hooks/EmojiReaction';
import { useTheme } from '~/hooks/Theme';
import { useUser } from '~/hooks/User';
import EmojiPicker, { type EmojiClickData, Theme } from 'emoji-picker-react';
import { SmilePlusIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import type { ReactionHandlerProps } from './ReactionHandler';

export const EmojiPickerHandler = ({ data, content_type }: ReactionHandlerProps) => {
  const user = useUser();
  const createReaction = useCreateReaction();
  const updateReaction = useUpdateReaction();

  const { theme } = useTheme();

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
            toast.success('Reaksjon oppdatert');
            closePopover();
          },
          onError: (e) => {
            toast.error(e.detail);
            closePopover();
          },
        },
      );
    } else {
      createReaction.mutate(
        { emoji: emoji.emoji, content_type: content_type, object_id: data.id },
        {
          onSuccess: () => {
            toast.success('Reaksjon lagt til');
            closePopover();
          },
          onError: (e) => {
            toast.error(e.detail);
            closePopover();
          },
        },
      );
    }
  };

  const OpenButton = (
    <Button onClick={openPopover} size='icon' variant='outline'>
      <SmilePlusIcon />
    </Button>
  );

  return (
    <ResponsiveDialog className='w-auto p-2' onOpenChange={setOpen} open={open} title='Reager' trigger={OpenButton}>
      <div className='w-full flex justify-center'>
        <EmojiPicker onEmojiClick={handleEmojiPick} theme={theme === 'dark' ? Theme.DARK : Theme.LIGHT} />
      </div>
    </ResponsiveDialog>
  );
};
