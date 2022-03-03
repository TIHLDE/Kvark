import { useTheme } from '@mui/material';
import { useMemo } from 'react';

import { useEvents } from 'hooks/Event';
import { useJobPosts } from 'hooks/JobPost';
import { useNews } from 'hooks/News';

import Story, { StoryLoading } from 'components/story/Story';

const STORIES_TO_DISPLAY = 10;

const StoriesView = () => {
  const theme = useTheme();
  const { data: news, isLoading: isNewsLoading } = useNews();
  const { data: jobposts, isLoading: isJobPostsLoading } = useJobPosts();
  const { data: events, isLoading: isEventsLoading } = useEvents();
  const items = useMemo(
    () =>
      [...(events?.pages[0]?.results || []), ...(jobposts?.pages[0]?.results || []), ...(news?.pages[0]?.results || [])]
        .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
        .slice(0, STORIES_TO_DISPLAY),
    [events, jobposts, news],
  );

  if (isNewsLoading || isJobPostsLoading || isEventsLoading) {
    return <StoryLoading fadeColor={theme.palette.background.smoke} />;
  } else {
    return <Story fadeColor={theme.palette.background.smoke} items={items} />;
  }
};

export default StoriesView;
