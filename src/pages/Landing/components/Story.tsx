import { Link } from '@tanstack/react-router';
import AspectRatioImg from '~/components/miscellaneous/AspectRatioImg';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import { Skeleton } from '~/components/ui/skeleton';
import type { EventList, JobPost, News } from '~/types';
import URLS from '~/URLS';
import { urlEncode } from '~/utils';
import { useMemo } from 'react';

export type StoryItem = {
  link: string;
  title: string;
  image?: string;
  typeText: string;
};

export type StoryProps = {
  items: Array<EventList | News | JobPost>;
};

const Story = ({ items }: StoryProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instanceOfEvent = (object: any): object is EventList => 'start_date' in object;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instanceOfNews = (object: any): object is News => 'header' in object;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instanceOfJobPost = (object: any): object is JobPost => 'company' in object;

  const storyItems = useMemo(() => {
    const newItems: Array<StoryItem> = [];
    items.forEach((item) => {
      const newItem = {
        title: item.title,
        image: item.image,
      };
      if (instanceOfEvent(item)) {
        newItems.push({
          ...newItem,
          link: `${URLS.events}/${item.id}/${urlEncode(item.title)}/`,
          typeText: 'Arr.',
        });
      } else if (instanceOfJobPost(item)) {
        newItems.push({
          ...newItem,
          link: `${URLS.jobposts}/${item.id}/${urlEncode(item.title)}/`,
          typeText: 'Ann.',
        });
      } else if (instanceOfNews(item)) {
        newItems.push({
          ...newItem,
          link: `${URLS.news}/${item.id}/${urlEncode(item.title)}/`,
          typeText: 'Nyh.',
        });
      }
    });
    return newItems;
  }, [items]);

  type StoryItemProps = {
    item: StoryItem;
  };

  const StoryItem = ({ item }: StoryItemProps) => {
    return (
      <div className='space-y-2 max-w-[110px] w-full'>
        <Link className='relative block' to={item.link}>
          <AspectRatioImg alt={item.title} src={item.image} />
          <div className='absolute bottom-0.5 left-0.5 p-1 rounded-sm bg-card bg-opacity-70'>
            <p className='text-[8px]'>{item.typeText}</p>
          </div>
        </Link>

        <p className='text-sm text-center w-full whitespace-nowrap overflow-hidden text-ellipsis'>{item.title}</p>
      </div>
    );
  };

  return (
    <ScrollArea className='w-full py-2'>
      <div className='flex w-max space-x-2'>
        {storyItems.map((item, index) => (
          <StoryItem item={item} key={index} />
        ))}
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
};
export default Story;

export const StoryLoading = () => {
  return (
    <ScrollArea className='w-full'>
      <div className='flex w-max space-x-2'>
        {Array.from({ length: 10 }).map((_, index) => (
          <div className='space-y-2 w-[110px]' key={index}>
            <Skeleton className='h-12' />
            <Skeleton className='h-4 w-3/4 mx-auto' />
          </div>
        ))}
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
};
