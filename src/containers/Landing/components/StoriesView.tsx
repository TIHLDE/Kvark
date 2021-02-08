import { useMemo } from 'react';
import { News } from 'types/Types';
import { useEvents } from 'api/hooks/Event';
import { useJobPosts } from 'api/hooks/JobPost';

// Material-UI
import { useTheme } from '@material-ui/core/styles';

// Project componets/services
import Story, { StoryLoading } from 'components/story/Story';

export type IProps = {
  news: Array<News>;
  isLoading: boolean;
};

const STORIES_TO_DISPLAY = 10;

const StoriesView = ({ news, isLoading }: IProps) => {
  const theme = useTheme();
  const { data: jobposts, isLoading: isJobPostsLoading } = useJobPosts();
  const { data: events, isLoading: isEventsLoading } = useEvents();
  // The (a.updated_at || '') is added to stop errors when updated_at is non-existant
  const items = useMemo(
    () =>
      [...(events?.pages[0]?.results || []), ...(jobposts?.pages[0]?.results || []), ...news]
        .sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''))
        .slice(0, STORIES_TO_DISPLAY),
    [events, jobposts, news],
  );

  if (isLoading || isJobPostsLoading || isEventsLoading) {
    return <StoryLoading fadeColor={theme.palette.background.smoke} />;
  } else {
    return <Story fadeColor={theme.palette.background.smoke} items={items} />;
  }
};

export default StoriesView;
