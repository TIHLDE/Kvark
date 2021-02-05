import { useMemo } from 'react';
import { EventCompact, News } from 'types/Types';
import { useJobPosts } from 'api/hooks/JobPost';

// Material-UI
import { useTheme } from '@material-ui/core/styles';

// Project componets/services
import Story, { StoryLoading } from 'components/story/Story';

export type IProps = {
  events: Array<EventCompact>;
  news: Array<News>;
  isLoading: boolean;
};

const STORIES_TO_DISPLAY = 10;

const StoriesView = ({ events, news, isLoading }: IProps) => {
  const theme = useTheme();
  const { data: jobposts, isLoading: isJobPostsLoading } = useJobPosts();
  // The (string || '') is added to stop errors when updated_at is non-existant
  const items = useMemo(
    () =>
      [...events, ...(jobposts?.pages[0]?.results || []), ...news]
        .sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''))
        .slice(0, STORIES_TO_DISPLAY),
    [events, jobposts, news],
  );

  if (isLoading || isJobPostsLoading) {
    return <StoryLoading fadeColor={theme.palette.background.smoke} />;
  } else {
    return <Story fadeColor={theme.palette.background.smoke} items={items} />;
  }
};

export default StoriesView;
