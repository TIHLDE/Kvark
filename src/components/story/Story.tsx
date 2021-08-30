import { useMemo, useState } from 'react';
import { EventCompact, News, JobPost } from 'types/Types';
import { parseISO } from 'date-fns';
import { urlEncode, formatDate } from 'utils';
import URLS from 'URLS';

// Material UI Components
import { makeStyles } from '@material-ui/styles';
import { Theme, Skeleton, Typography, Button } from '@material-ui/core';

// Project components
import StoryPopup from 'components/story/StoryPopup';

// Icons
import TIHLDELOGO from 'assets/img/TihldeBackground.jpg';
import { useGoogleAnalytics } from 'api/hooks/Utils';

const useStyles = makeStyles<Theme, Pick<StoryProps, 'fadeColor'>>((theme) => ({
  root: {
    overflow: 'hidden',
    position: 'relative',
  },
  stories: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'scroll',
    padding: theme.spacing(0, 1),
    '-webkit-overflow-scrolling': 'touch',
    '@media (any-pointer: coarse)': {
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    '&::-webkit-scrollbar': {
      height: 12,
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: theme.shape.borderRadius,
      background: 'transparent',
    },
    ':hover&::-webkit-scrollbar-thumb': {
      background: `${theme.palette.divider}88`,
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: `${theme.palette.divider}`,
    },
    '&:before,&:after': {
      content: '""',
      position: 'absolute',
      zIndex: 1,
      top: 0,
      bottom: 0,
      width: theme.spacing(2),
    },
    '&:before': {
      left: 0,
      background: (props) =>
        `linear-gradient(to left, ${props.fadeColor || theme.palette.background.default}00, ${props.fadeColor || theme.palette.background.default} 65%)`,
    },
    '&:after': {
      right: 0,
      background: (props) =>
        `linear-gradient(to right, ${props.fadeColor || theme.palette.background.default}00, ${props.fadeColor || theme.palette.background.default} 65%)`,
    },
  },
  story: {
    flex: '0 0 auto',
    width: 110,
    marginLeft: theme.spacing(1),
  },
  text: {
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    marginTop: theme.spacing(0.5),
  },
  imgButton: {
    display: 'block',
    margin: 'auto',
    height: 75,
    width: '100%',
    borderRadius: 16,
    padding: 2,
    borderWidth: 2,
    '&:hover': {
      borderWidth: 2,
    },
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    objectFit: 'cover',
    objectPosition: 'center',
    margin: 'auto',
    display: 'block',
    background: theme.palette.common.white,
  },
  filler: {
    width: theme.spacing(2),
    height: 1,
    flex: '0 0 auto',
  },
  skeleton: {
    margin: 'auto',
  },
}));

export type StoryItem = {
  link: string;
  title: string;
  description?: string;
  image?: string;
  topText?: string;
};

export type StoryProps = {
  items: Array<EventCompact | News | JobPost>;
  fadeColor?: string;
};

const Story = ({ items, fadeColor }: StoryProps) => {
  const classes = useStyles({ fadeColor });
  const storyId = new URLSearchParams(location.search).get('story');
  const [popupOpen, setPopupOpen] = useState(Boolean(storyId));
  const [selectedItem, setSelectedItem] = useState(Number(storyId));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instanceOfEvent = (object: any): object is EventCompact => 'start_date' in object;
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
          link: `${URLS.events}${item.id}/${urlEncode(item.title)}/`,
          description: `Sted: ${item.location} \n Når: ${formatDate(parseISO(item.start_date))}`,
          topText: 'Arrangement',
        });
      } else if (instanceOfJobPost(item)) {
        newItems.push({
          ...newItem,
          link: `${URLS.jobposts}${item.id}/${urlEncode(item.title)}/`,
          description: `Bedrift: ${item.company} \n Når: ${formatDate(parseISO(item.deadline))}`,
          topText: 'Annonse',
        });
      } else if (instanceOfNews(item)) {
        newItems.push({
          ...newItem,
          link: `${URLS.news}${item.id}/${urlEncode(item.title)}/`,
          description: `${item.header}`,
          topText: 'Nyhet',
        });
      }
    });
    return newItems;
  }, [items]);

  type StoryItemProps = {
    item: StoryItem;
    index: number;
  };

  const StoryItem = ({ item, index }: StoryItemProps) => {
    const classes = useStyles({});
    const [imgUrl, setImgUrl] = useState(item.image || TIHLDELOGO);
    const { event } = useGoogleAnalytics();
    const openStory = () => {
      event('open', 'stories', `Open "${item.title}" story`);
      setSelectedItem(index);
      setPopupOpen(true);
    };
    return (
      <div className={classes.story}>
        <Button className={classes.imgButton} onClick={openStory} variant='outlined'>
          <img alt={item.title} className={classes.image} onError={() => setImgUrl(TIHLDELOGO)} src={imgUrl} />
        </Button>
        <Typography className={classes.text} variant='body2'>
          {item.title}
        </Typography>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.stories}>
        {storyItems.map((item, index) => (
          <StoryItem index={index} item={item} key={index} />
        ))}
        <div className={classes.filler} />
      </div>
      <StoryPopup items={storyItems} onClose={() => setPopupOpen(false)} open={popupOpen} selectedItem={selectedItem} />
    </div>
  );
};
export default Story;

export const StoryLoading = ({ fadeColor }: Pick<StoryProps, 'fadeColor'>) => {
  const classes = useStyles({ fadeColor });
  return (
    <div className={classes.root}>
      <div className={classes.stories}>
        {Array.from({ length: 7 }).map((i, index) => (
          <div className={classes.story} key={index}>
            <Skeleton className={classes.imgButton} variant='rectangular' />
            <Skeleton className={classes.skeleton} width='80%' />
          </div>
        ))}
      </div>
    </div>
  );
};
