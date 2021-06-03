import { useEffect, useCallback, useRef } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { usePalette } from 'react-palette';

// Material UI Components
import { makeStyles } from '@material-ui/styles';
import { Theme, useTheme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import IconButton from '@material-ui/core/IconButton';

// Project components
import { StoryItem } from 'components/story/Story';
import AspectRatioImg from 'components/miscellaneous/AspectRatioImg';

// Icons
import CloseIcon from '@material-ui/icons/CloseRounded';
import UpIcon from '@material-ui/icons/ExpandLessRounded';
import DownIcon from '@material-ui/icons/ExpandMoreRounded';
import OpenIcon from '@material-ui/icons/KeyboardArrowRightRounded';

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    borderRadius: 0,
    marginTop: 0,
    marginBottom: 0,
    maxHeight: '100%',
  },
  items: {
    scrollSnapType: 'y mandatory',
    overflowY: 'scroll',
    border: '2px solid var(--gs0)',
    borderRadius: 0,
    height: '100vh',
    position: 'relative',
    '@media (any-pointer: coarse)': {
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    '&::-webkit-scrollbar': {
      width: 12,
      background: '#111',
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: theme.shape.borderRadius,
      background: '#ccc',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#bbb',
    },
  },
  popup: {
    scrollSnapAlign: 'start',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    background: theme.palette.colors.tihlde,
    transition: 'background 1s',
  },
  fgImage: {
    width: '100%',
    maxHeight: '-webkit-fill-available',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  white: {
    color: 'white',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '1.7rem',
  },
  description: {
    marginBottom: theme.spacing(1),
    whiteSpace: 'pre-line',
  },
  linkButton: {
    color: 'white',
    borderColor: 'white',
    '&:hover': {
      borderColor: '#ffffffaa',
    },
    height: 50,
  },
  topText: {
    margin: 'auto 0',
  },
  top: {
    padding: theme.spacing(2),
    zIndex: 1,
    display: 'flex',
    justifyContent: 'space-between',
  },
  middle: {
    display: 'flex',
    alignItems: 'center',
  },
  bottom: {
    padding: theme.spacing(2),
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gridGap: theme.spacing(2),
    zIndex: 1,
  },
}));

export type StoryPopupProps = {
  items: Array<StoryItem>;
  open: boolean;
  onClose: () => void;
  selectedItem?: number;
};

function StoryPopup({ items, open, onClose, selectedItem = 0 }: StoryPopupProps) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const container = useRef<HTMLDivElement>(null);

  const getStoryPositions = useCallback(() => {
    if (!container?.current) {
      return [];
    }
    const positions = [];
    for (let i = 0; i < items.length; i++) {
      const offset = container.current.offsetHeight;
      positions.push([i * offset, i * offset + offset] as const);
    }
    return positions;
  }, [items]);

  const scrollToIndex = useCallback(
    (index: number, smooth = true) => {
      const storyPositions = getStoryPositions();
      if (!container?.current || !storyPositions.length) {
        // If the container isn't initialized yet, try again after 100ms
        setTimeout(() => scrollToIndex(index, smooth), 100);
        return;
      }
      if (storyPositions[index]) {
        container.current.scrollTo({
          top: storyPositions[index][0],
          behavior: smooth ? 'smooth' : 'auto',
        });
      }
    },
    [getStoryPositions],
  );

  useEffect(() => {
    if (open) {
      scrollToIndex(selectedItem, false);
    }
  }, [open, selectedItem, scrollToIndex]);

  type PopupItemProps = {
    item: StoryItem;
    index: number;
  };

  const PopupItem = ({ index, item }: PopupItemProps) => {
    const classes = useStyles();
    const { data: palette } = usePalette(
      `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=${encodeURIComponent(item.image || '')}`,
    );
    return (
      <div className={classes.popup} style={{ background: palette ? `linear-gradient(to bottom, ${palette.muted}, ${palette.darkMuted})` : '' }}>
        <div className={classes.top}>
          <Typography className={classnames(classes.topText, classes.white)} variant='h3'>
            {item.topText}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon className={classes.white} />
          </IconButton>
        </div>
        <div className={classes.middle}>
          <AspectRatioImg alt={item.title} className={classes.fgImage} src={item.image} />
        </div>
        <div className={classes.bottom}>
          <div>
            <Typography className={classnames(classes.title, classes.white)} variant='h2'>
              {item.title}
            </Typography>
            <Typography className={classnames(classes.description, classes.white)} variant='subtitle1'>
              {item.description}
            </Typography>
            <Button className={classes.linkButton} color='primary' component={Link} endIcon={<OpenIcon />} fullWidth to={item.link} variant='outlined'>
              Mer
            </Button>
          </div>
          <div className={classes.nav}>
            {index !== 0 && (
              <IconButton onClick={() => scrollToIndex(index - 1)}>
                <UpIcon className={classes.white} />
              </IconButton>
            )}
            {index + 1 !== items.length && (
              <IconButton onClick={() => scrollToIndex(index + 1)}>
                <DownIcon className={classes.white} />
              </IconButton>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog classes={{ paper: classes.paper }} fullScreen={fullScreen} fullWidth maxWidth='md' onClose={onClose} open={open}>
      <div className={classes.items} ref={container}>
        {items?.map((item, index) => (
          <PopupItem index={index} item={item} key={index} />
        ))}
      </div>
    </Dialog>
  );
}
export default StoryPopup;
