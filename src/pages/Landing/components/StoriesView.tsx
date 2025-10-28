import { useInfiniteQuery } from '@tanstack/react-query';
import { useEvents } from '~/hooks/Event';
import { jobPostsQuery } from '~/hooks/JobPost';
import { useNews } from '~/hooks/News';
import Story, { StoryLoading } from '~/pages/Landing/components/Story';
import { useMemo } from 'react';

const STORIES_TO_DISPLAY = 10;

const StoriesView = () => {
  const { data: news, isLoading: isNewsLoading } = useNews();
  const { data: jobposts, isLoading: isJobPostsLoading } = useInfiniteQuery(jobPostsQuery());
  const { data: events, isLoading: isEventsLoading } = useEvents();
  const items = useMemo(
    () =>
      [...(events?.pages[0]?.results || []), ...(jobposts?.pages[0]?.results || []), ...(news?.pages[0]?.results || [])]
        .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
        .slice(0, STORIES_TO_DISPLAY),
    [events, jobposts, news],
  );

  if (isNewsLoading || isJobPostsLoading || isEventsLoading) {
    return <StoryLoading />;
  } else {
    return <Story items={items} />;
  }
};

export default StoriesView;
