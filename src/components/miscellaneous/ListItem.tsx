import { useMemo } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { urlEncode, formatDate } from 'utils';
import { parseISO } from 'date-fns';
import URLS from 'URLS';
import { Event, News, JobPost } from 'types/Types';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MaterialListItem from '@material-ui/core/ListItem';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core';

// Icons
import DateIcon from '@material-ui/icons/DateRange';
import LocationIcon from '@material-ui/icons/LocationOn';
import BusinessIcon from '@material-ui/icons/Business';

// Project components
import AspectRatioImg from 'components/miscellaneous/AspectRatioImg';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    border: theme.palette.borderWidth + ' solid ' + theme.palette.divider,
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1),
    height: 'auto',
    padding: 0,
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexWrap: 'wrap',
    '--multiplier': `calc( ${theme.breakpoints.values.md}px - 100%)`,
    backgroundColor: theme.palette.background.paper,
    gridGap: theme.spacing(1),
  },
  content: {
    minWidth: '33%',
    maxWidth: '100%',
    flexGrow: 1.5,
    flexBasis: 'calc( var(--multiplier) * 999 )',
    padding: theme.spacing(1),
    justifyContent: 'space-evenly',
    width: 1,
    minHeight: 110,
  },
  imgContainer: {
    minWidth: '33%',
    maxWidth: '100%',
    flexGrow: 1,
    flexBasis: 'calc( var(--multiplier) * 999 )',
  },
  largeImg: {
    flexGrow: 1.5,
  },
  title: {
    fontSize: '1.8rem',
    color: theme.palette.text.primary,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  infoRoot: {
    width: 'auto',
    margin: theme.spacing(0.25, 0),
  },
  info: {
    color: theme.palette.text.secondary,
    fontSize: '1rem',
    textAlign: 'left',
    overflow: 'hidden',
    '-webkit-line-clamp': 2,
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
    height: 24,
    width: 24,
    margin: theme.spacing(0),
  },
}));

type IconProps = {
  icon?: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>>;
  label: string;
};

const InfoContent = ({ icon: Icon, label }: IconProps) => {
  const classes = useStyles();
  return (
    <Grid alignItems='center' className={classes.infoRoot} container direction='row' wrap='nowrap'>
      {Icon && <Icon className={classes.icon} />}
      <Typography className={classes.info} variant='subtitle1'>
        {label}
      </Typography>
    </Grid>
  );
};

type ListItemProps = {
  event?: Event;
  news?: News;
  jobpost?: JobPost;
  imgContain?: boolean;
  className?: string;
  largeImg?: boolean;
};

function ListItem({ event, news, jobpost, imgContain = false, className, largeImg = false }: ListItemProps) {
  const classes = useStyles();
  const item = useMemo(() => {
    if (event) {
      return {
        title: event.title,
        link: `${URLS.events}${event.id}/${urlEncode(event.title)}/`,
        img: event.image,
        imgAlt: event.image_alt,
      };
    } else if (news) {
      return {
        title: news.title,
        link: `${URLS.news}${news.id}/${urlEncode(news.title)}/`,
        img: news.image,
        imgAlt: news.image_alt,
      };
    } else if (jobpost) {
      return {
        title: jobpost.title,
        link: `${URLS.jobposts}${jobpost.id}/${urlEncode(jobpost.title)}/`,
        img: jobpost.image,
        imgAlt: jobpost.image_alt,
      };
    }
  }, [event, news, jobpost]);

  const info = useMemo((): Array<IconProps> | undefined => {
    if (event) {
      return [{ label: formatDate(parseISO(event.start_date)), icon: DateIcon }];
    } else if (news) {
      return [{ label: news.header }];
    } else if (jobpost) {
      return [
        { label: jobpost.company, icon: BusinessIcon },
        { label: jobpost.location, icon: LocationIcon },
        { label: formatDate(parseISO(jobpost.deadline)), icon: DateIcon },
      ];
    }
  }, [event, news, jobpost]);

  if (!item || !info) {
    return null;
  }

  return (
    <MaterialListItem button className={classNames(classes.root, className)} component={Link} to={item.link}>
      <AspectRatioImg
        alt={item.imgAlt || item.title}
        className={classNames(classes.imgContainer, largeImg && classes.largeImg)}
        imgContain={imgContain}
        src={item.img}
      />
      <Grid className={classes.content} container direction='column' wrap='nowrap'>
        <Typography className={classes.title} variant='h2'>
          {item.title}
        </Typography>
        {info?.map((infoItem, index: number) => (
          <InfoContent icon={infoItem.icon} key={index} label={infoItem.label} />
        ))}
      </Grid>
    </MaterialListItem>
  );
}
export default ListItem;
