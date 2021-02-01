import { useMemo } from 'react';
import { Event, News, JobPost } from 'types/Types';

// Material-UI
import { useTheme } from '@material-ui/core/styles';

// Project componets/services
import Story, { StoryLoading } from 'components/story/Story';

export type IProps = {
  events: Array<Event>;
  jobposts: Array<JobPost>;
  news: Array<News>;
  isLoading: boolean;
};

const STORIES_TO_DISPLAY = 15;

const StoriesView = ({ events, jobposts, news, isLoading }: IProps) => {
  const theme = useTheme();
  // The (string || '') is added to stop errors when updated_at is non-existant
  const items = useMemo(
    () => [...events, ...jobposts, ...news].sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || '')).slice(0, STORIES_TO_DISPLAY),
    [events, jobposts, news],
  );

  if (isLoading) {
    return <StoryLoading fadeColor={theme.palette.background.smoke} />;
  } else {
    return <Story fadeColor={theme.palette.background.smoke} items={items} />;
  }
};

export default StoriesView;
