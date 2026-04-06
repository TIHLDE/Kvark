import { useQuery } from '@tanstack/react-query';
import { getEventsQuery } from '~/api/queries/events';
import { getJobsQuery } from '~/api/queries/jobs';
import { getNewsQuery } from '~/api/queries/news';
import Story, { StoryLoading } from '~/routes/landing/components/Story';
import { useMemo } from 'react';

const STORIES_TO_DISPLAY = 10;

const StoriesView = () => {
  const { data: news, isLoading: isNewsLoading } = useQuery(getNewsQuery(0));
  const { data: jobposts, isLoading: isJobPostsLoading } = useQuery(getJobsQuery(0));
  const { data: events, isLoading: isEventsLoading } = useQuery(getEventsQuery(0));
  const items = useMemo(
    () =>
      [...(events?.items || []), ...(jobposts?.items || []), ...(news?.items || [])]
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
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
