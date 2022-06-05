import { Button, Skeleton, Typography } from '@mui/material';
import { makeStyles } from 'makeStyles';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { urlEncode } from 'utils';

import { EventList, JobPost, News } from 'types';

import TIHLDELOGO from 'assets/img/TihldeBackground.jpg';

const useStyles = makeStyles<Pick<StoryProps, 'fadeColor'>>()((theme, props) => ({
  root: {
    overflow: 'hidden',
    position: 'relative',
  },
  stories: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'scroll',
    padding: theme.spacing(0, 1),
    WebkitOverflowScrolling: 'touch',
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
      background: `linear-gradient(to left, ${props.fadeColor || theme.palette.background.default}00, ${
        props.fadeColor || theme.palette.background.default
      } 65%)`,
    },
    '&:after': {
      right: 0,
      background: `linear-gradient(to right, ${props.fadeColor || theme.palette.background.default}00, ${
        props.fadeColor || theme.palette.background.default
      } 65%)`,
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
    height: 60,
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
}));

export type StoryItem = {
  link: string;
  title: string;
  image?: string;
  typeText: string;
};

export type StoryProps = {
  items: Array<EventList | News | JobPost>;
  fadeColor?: string;
};

const Story = ({ items, fadeColor }: StoryProps) => {
  const { classes } = useStyles({ fadeColor });

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
          link: `${URLS.events}${item.id}/${urlEncode(item.title)}/`,
          typeText: 'Arr.',
        });
      } else if (instanceOfJobPost(item)) {
        newItems.push({
          ...newItem,
          link: `${URLS.jobposts}${item.id}/${urlEncode(item.title)}/`,
          typeText: 'Ann.',
        });
      } else if (instanceOfNews(item)) {
        newItems.push({
          ...newItem,
          link: `${URLS.news}${item.id}/${urlEncode(item.title)}/`,
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
    const { classes } = useStyles({});
    const [imgUrl, setImgUrl] = useState(item.image || TIHLDELOGO);
    return (
      <div className={classes.story}>
        <Button className={classes.imgButton} component={Link} sx={{ position: 'relative' }} to={item.link} variant='outlined'>
          <img alt={item.title} className={classes.image} loading='lazy' onError={() => setImgUrl(TIHLDELOGO)} src={imgUrl} />
          <Typography
            sx={{
              position: 'absolute',
              bottom: ({ spacing }) => spacing(0.5),
              left: ({ spacing }) => spacing(0.5),
              color: ({ palette }) => palette.text.primary,
              lineHeight: 1,
              p: 0.25,
              borderRadius: '4px',
              fontSize: '0.65rem',
              background: ({ palette }) => palette.background.paper,
            }}
            variant='caption'>
            {item.typeText}
          </Typography>
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
          <StoryItem item={item} key={index} />
        ))}
        <div className={classes.filler} />
      </div>
    </div>
  );
};
export default Story;

export const StoryLoading = ({ fadeColor }: Pick<StoryProps, 'fadeColor'>) => {
  const { classes } = useStyles({ fadeColor });
  return (
    <div className={classes.root}>
      <div className={classes.stories}>
        {Array.from({ length: 7 }).map((i, index) => (
          <div className={classes.story} key={index}>
            <Skeleton className={classes.imgButton} variant='rectangular' />
            <Skeleton sx={{ m: 'auto' }} width='80%' />
          </div>
        ))}
      </div>
    </div>
  );
};
