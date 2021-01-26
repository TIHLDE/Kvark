import React, { useMemo, useState } from 'react';
import { Event, News, JobPost } from 'types/Types';
import { parseISO } from 'date-fns';
import { urlEncode, formatDate } from 'utils';
import URLS from 'URLS';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Project components
import StoryPopup from 'components/story/StoryPopup';

// Icons
import TIHLDELOGO from 'assets/img/TihldeBackground.jpg';

const useStyles = makeStyles<Theme, Pick<StoryProps, 'fadeColor'>>((theme: Theme) => ({
  root: {
    overflow: 'hidden',
    position: 'relative',
  },
  stories: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'scroll',
    padding: theme.spacing(1),
    '-webkit-overflow-scrolling': 'touch',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      zIndex: 1,
      top: 0,
      left: 0,
      bottom: 0,
      background: (props) => `linear-gradient(to left, transparent, ${props.fadeColor || theme.palette.background.default} 65%)`,
      width: 25,
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      zIndex: 1,
      top: 0,
      right: 0,
      bottom: 0,
      background: (props) => `linear-gradient(to right, transparent, ${props.fadeColor || theme.palette.background.default} 65%)`,
      width: 25,
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
    borderRadius: 16,
    padding: 2,
    borderWidth: 2,
    '&:hover': {
      borderWidth: 2,
    },
  },
  imgButtonLabel: {
    width: '100%',
    height: '100%',
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
    width: 25,
    height: 105,
    flex: '0 0 auto',
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
  items: Array<Event | News | JobPost>;
  fadeColor?: string;
};

function Story({ items, fadeColor }: StoryProps) {
  const classes = useStyles({ fadeColor });
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instanceOfEvent = (object: any): object is Event => 'start_date' in object;
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
    const openStory = () => {
      window.gtag('event', 'stories', {
        event_category: 'Stories',
        event_label: 'Open story',
      });
      setSelectedItem(index);
      setPopupOpen(true);
    };
    return (
      <div className={classes.story}>
        <Button classes={{ label: classes.imgButtonLabel }} className={classes.imgButton} color='primary' onClick={openStory} variant='outlined'>
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
}
export default Story;
