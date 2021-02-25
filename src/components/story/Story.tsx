import React, { useMemo, useState } from 'react';
import { EventCompact, News, JobPost } from 'types/Types';
import { parseISO } from 'date-fns';
import { urlEncode, formatDate } from 'utils';
import URLS from 'URLS';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';

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
    '&:before': {
      content: '""',
      position: 'absolute',
      zIndex: 1,
      top: 0,
      left: 0,
      bottom: 0,
      background: (props) => `linear-gradient(to left, transparent, ${props.fadeColor || theme.palette.background.default} 65%)`,
      width: theme.spacing(2),
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      zIndex: 1,
      top: 0,
      right: 0,
      bottom: 0,
      background: (props) => `linear-gradient(to right, transparent, ${props.fadeColor || theme.palette.background.default} 65%)`,
      width: theme.spacing(2),
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

function Story({ items, fadeColor }: StoryProps) {
  const classes = useStyles({ fadeColor });
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);

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
    newItems.splice(8, 0, {
      link: '',
      title: 'James Halliday',
      description:
        // eslint-disable-next-line no-useless-escape
        String.raw`$=~[];$={___:++$,$$$$:(![]+"")[$],__$:++$,$_$_:(![]+"")[$],_$_:++$,$_$$:({}+"")[$],$$_$:($[$]+"")[$],_$$:++$,$$$_:(!""+"")[$],$__:++$,$_$:++$,$$__:({}+"")[$],$$_:++$,$$$:++$,$___:++$,$__$:++$};$.$_=($.$_=$+"")[$.$_$]+($._$=$.$_[$.__$])+($.$$=($.$+"")[$.__$])+((!$)+"")[$._$$]+($.__=$.$_[$.$$_])+($.$=(!""+"")[$.__$])+($._=(!""+"")[$._$_])+$.$_[$.$_$]+$.__+$._$+$.$;$.$$=$.$+(!""+"")[$._$$]+$.__+$._+$.$+$.$$;$.$=($.___)[$.$_][$.$_];$.$($.$($.$$+"\""+$.$$__+$._$+"\\"+$.__$+$.$_$+$.$$_+"\\"+$.__$+$.$$_+$._$$+$._$+(![]+"")[$._$_]+$.$$$_+"."+(![]+"")[$._$_]+$._$+"\\"+$.__$+$.$__+$.$$$+"(\\\""+$.$$$$+(![]+"")[$._$_]+$.$_$_+"\\"+$.__$+$.$__+$.$$$+"{"+$.$_$_+$.___+$.$$$+$.$__$+$.___+$.$_$$+$.$$_$+$.$___+"-"+$.$$__+$.__$+$.$_$_+$.$__+"-"+$.$__+$.$$_+$.$__$+$.$_$$+"-"+$.$__$+$.$$_+$.$$_+$.___+"-"+$.$__+$.$$$+$.$$_$+$.$$_+$.$$$_+$.$__+$._$_+$._$$+$.$$_+$.$___+$._$$+$.$___+"}\\\")"+"\"")())();`,
      image: 'https://portswigger.net/cms/images/0c/8f/4cb294050d45-article-191125-trend-micro-ctf-body-text.jpg',
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

export const StoryLoading = ({ fadeColor }: Pick<StoryProps, 'fadeColor'>) => {
  const classes = useStyles({ fadeColor });
  return (
    <div className={classes.root}>
      <div className={classes.stories}>
        {Array.from({ length: 7 }).map((i, index) => (
          <div className={classes.story} key={index}>
            <Skeleton className={classes.imgButton} variant='rect' />
            <Skeleton className={classes.skeleton} width='80%' />
          </div>
        ))}
      </div>
    </div>
  );
};
