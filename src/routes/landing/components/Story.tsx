import { Link } from '@tanstack/react-router';
import AspectRatioImg from '~/components/miscellaneous/AspectRatioImg';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import { Skeleton } from '~/components/ui/skeleton';
import URLS from '~/URLS';
import { urlEncode } from '~/utils';
import { useMemo } from 'react';

export type StoryItem = {
  link: string;
  title: string;
  image?: string | null;
  typeText: string;
};

type EventItem = { id: string; title: string; image: string | null; startTime: string; updatedAt: string };
type NewsItem = { id: string; title: string; imageUrl: string | null; header: string; updatedAt: string };
type JobItem = { id: string; title: string; imageUrl: string | null; company: string; updatedAt: string };

type AnyItem = EventItem | NewsItem | JobItem;

const isEvent = (item: AnyItem): item is EventItem => 'startTime' in item;
const isNews = (item: AnyItem): item is NewsItem => 'header' in item;
const isJob = (item: AnyItem): item is JobItem => 'company' in item;

export type StoryProps = {
  items: Array<AnyItem>;
};

const Story = ({ items }: StoryProps) => {
  const storyItems = useMemo(() => {
    const newItems: Array<StoryItem> = [];
    items.forEach((item) => {
      if (isEvent(item)) {
        newItems.push({
          title: item.title,
          image: item.image,
          link: `${URLS.events}/${item.id}/${urlEncode(item.title)}/`,
          typeText: 'Arr.',
        });
      } else if (isJob(item)) {
        newItems.push({
          title: item.title,
          image: item.imageUrl,
          link: `${URLS.jobposts}/${item.id}/${urlEncode(item.title)}/`,
          typeText: 'Ann.',
        });
      } else if (isNews(item)) {
        newItems.push({
          title: item.title,
          image: item.imageUrl,
          link: `${URLS.news}/${item.id}/${urlEncode(item.title)}/`,
          typeText: 'Nyh.',
        });
      }
    });
    return newItems;
  }, [items]);

  type StoryItemViewProps = {
    item: StoryItem;
  };

  const StoryItemView = ({ item }: StoryItemViewProps) => {
    return (
      <div className='space-y-2 max-w-[110px] w-full'>
        <Link className='relative block' to={item.link}>
          <AspectRatioImg alt={item.title} src={item.image ?? undefined} />
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
          <StoryItemView item={item} key={index} />
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
