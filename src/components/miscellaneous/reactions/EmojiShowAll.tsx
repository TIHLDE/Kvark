import { ListIcon } from 'lucide-react';

import { ContentType } from 'types/ContentType';

import { Button } from 'components/ui/button';
import ResponsiveDialog from 'components/ui/responsive-dialog';
import { ScrollArea, ScrollBar } from 'components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';

import { ReactionListItem } from './ReactionListItem';

export const EmojiShowAll = (data: ContentType) => {
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

  const OpenButton = (
    <Button size='icon' variant='outline'>
      <ListIcon />
    </Button>
  );

  return (
    <ResponsiveDialog className='max-w-xl' title='Reaksjoner' trigger={OpenButton}>
      <Tabs className='space-y-8' defaultValue='all'>
        <ScrollArea className='w-full whitespace-nowrap p-0'>
          <TabsList>
            {tabs.map((tab, index) => (
              <TabsTrigger key={index} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
        <TabsContent value='all'>
          <ScrollArea className='w-full h-[60vh] pr-4'>
            <div className='space-y-2'>
              {data?.reactions?.map((reaction, index) => (
                <ReactionListItem key={index} {...reaction} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        {tabs.slice(1).map((reactionTab, index) => (
          <TabsContent className='space-y-2' key={index} value={reactionTab.value}>
            <ScrollArea className='w-full h-[60vh] pr-4'>
              <div className='space-y-2'>
                {data?.reactions
                  ?.filter((reaction) => reaction.emoji === reactionTab.value)
                  .map((reaction, index) => (
                    <ReactionListItem key={index} {...reaction} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </ResponsiveDialog>
  );
};
