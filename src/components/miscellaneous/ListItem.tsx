import { useMemo } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { urlEncode, formatDate, getJobpostType } from 'utils';
import { parseISO } from 'date-fns';
import useDimensions from 'react-cool-dimensions';
import URLS from 'URLS';
import { EventCompact, News, JobPost } from 'types';
import { useCategories } from 'hooks/Categories';

// Material UI Components
import { makeStyles } from '@mui/styles';
import {
  lighten,
  Theme,
  Button,
  ButtonProps,
  Skeleton,
  styled,
  useMediaQuery,
  Grid,
  Typography,
  TypographyProps,
  ListItem as MaterialListItemButton,
  ListItemProps as MaterialListItemButtonProps,
  SvgIconTypeMap,
  Stack,
} from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

// Icons
import DateIcon from '@mui/icons-material/DateRangeRounded';
import BusinessIcon from '@mui/icons-material/BusinessRounded';
import DeadlineIcon from '@mui/icons-material/AlarmRounded';
import SchoolIcon from '@mui/icons-material/School';
import CategoryIcon from '@mui/icons-material/CategoryRounded';

// Project components
import AspectRatioImg, { AspectRatioLoading } from 'components/miscellaneous/AspectRatioImg';

const useStyles = makeStyles((theme) => ({
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
    '&:hover': {
      background: lighten(theme.palette.background.paper, 0.1),
    },
  },
  content: {
    minWidth: '33%',
    maxWidth: '100%',
    flexGrow: 1.5,
    flexBasis: 'calc( var(--multiplier) * 999 )',
    padding: theme.spacing(1),
    justifyContent: 'space-evenly',
    width: 1,
    minHeight: 95,
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

const Title = styled((props: TypographyProps) => <Typography variant='h2' {...props} />)(({ theme }) => ({
  color: theme.palette.text.primary,
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textTransform: 'none',
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

type EventInfoContentProps = {
  icon?: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>>;
  label: string;
};

const EventInfoContent = ({ icon: Icon, label }: EventInfoContentProps) => (
  <Grid alignItems='center' container direction='row' wrap='nowrap'>
    {Icon && <Icon sx={{ m: 0, mr: 1, width: 20, height: 20 }} />}
    <Typography sx={{ fontSize: 14, textTransform: 'none', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }} variant='subtitle1'>
      {label}
    </Typography>
  </Grid>
);

export type EventListItemProps = {
  event: EventCompact;
  sx?: MaterialListItemButtonProps['sx'];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EventListItemButton = styled(Button)<ButtonProps<any, { component: any }>>(({ theme }) => ({
  display: 'block',
  margin: 'auto',
  height: 'fit-content',
  width: '100%',
  border: theme.palette.borderWidth + ' solid ' + theme.palette.primary.main,
  borderRadius: theme.shape.borderRadius,
  padding: 2,
  borderWidth: 2,
}));

const EventListItemInner = styled('div')<{ height: number }>(({ theme, height }) => ({
  display: 'grid',
  gap: theme.spacing(1),
  gridTemplateColumns: `${(height / 9) * 21}px auto 1fr`,
  height,
  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(0.5),
  },
  borderRadius: Number(theme.shape.borderRadius) - Number(theme.shape.borderRadius) / 4,
  width: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  margin: 'auto',
  background: theme.palette.background.paper,
  overflow: 'hidden',
  color: theme.palette.text.primary,
}));

const Divider = styled('div')(({ theme }) => ({
  borderRadius: 3,
  margin: theme.spacing(0.25, 0),
  width: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
}));

export const EventListItem = ({ event, sx }: EventListItemProps) => {
  const { observe, width } = useDimensions();
  const getHeight = () => {
    if (width < 500) {
      return 70;
    } else if (width < 700) {
      return 90;
    }
    return 110;
  };
  const { data: categories = [] } = useCategories();
  const categoryLabel = `${event.group ? `${event.group.name} | ` : ''}${categories.find((c) => c.id === event.category)?.text || 'Laster...'}`;

  return (
    <EventListItemButton component={Link} ref={observe} sx={sx} to={`${URLS.events}${event.id}/${urlEncode(event.title)}/`}>
      <EventListItemInner height={getHeight()}>
        <AspectRatioImg alt={event.image_alt || event.title} src={event.image} />
        <Divider />
        <Stack justifyContent='center' sx={{ overflow: 'hidden', pr: 0.5 }}>
          <Title sx={{ fontSize: 19 }}>{event.title}</Title>
          <EventInfoContent icon={DateIcon} label={formatDate(parseISO(event.start_date))} />
          <EventInfoContent icon={CategoryIcon} label={categoryLabel} />
        </Stack>
      </EventListItemInner>
    </EventListItemButton>
  );
};

export type ListItemProps = {
  event?: EventCompact;
  news?: News;
  jobpost?: JobPost;
  className?: string;
  largeImg?: boolean;
  sx?: MaterialListItemButtonProps['sx'];
};

const ListItem = ({ event, news, jobpost, className, largeImg = false, sx }: ListItemProps) => {
  const classes = useStyles();
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const { data: categories = [] } = useCategories();
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
      const categoryLabel = `${event.group ? `${event.group.name} | ` : ''}${categories.find((c) => c.id === event.category)?.text || 'Laster...'}`;
      return [
        { label: formatDate(parseISO(event.start_date)), icon: DateIcon },
        { label: categoryLabel, icon: CategoryIcon },
      ];
    } else if (news) {
      return [{ label: `Publisert: ${formatDate(parseISO(news.created_at))}` }, { label: news.header }];
    } else if (jobpost) {
      return [
        { label: `${jobpost.company} | ${jobpost.location} | ${getJobpostType(jobpost.job_type)}`, icon: BusinessIcon },
        { label: jobpost.is_continuously_hiring ? 'Fortløpende opptak' : formatDate(parseISO(jobpost.deadline)), icon: DeadlineIcon },
        {
          label: `Årstrinn: ${jobpost.class_start === jobpost.class_end ? `${jobpost.class_start}.` : `${jobpost.class_start}. - ${jobpost.class_end}.`}`,
          icon: SchoolIcon,
        },
      ];
    }
  }, [event, news, jobpost, categories]);

  if (!item || !info) {
    return null;
  }

  return (
    <MaterialListItemButton className={classNames(classes.root, className)} component={Link} sx={sx} to={item.link}>
      <AspectRatioImg alt={item.imgAlt || item.title} className={classNames(classes.imgContainer, largeImg && lgUp && classes.largeImg)} src={item.img} />
      <Grid className={classes.content} container direction='column' wrap='nowrap'>
        <Typography className={classes.title} variant='h2'>
          {item.title}
        </Typography>
        {info?.map((infoItem, index: number) => (
          <InfoContent icon={infoItem.icon} key={index} label={infoItem.label} />
        ))}
      </Grid>
    </MaterialListItemButton>
  );
};
export default ListItem;

export const ListItemLoading = ({ className, largeImg = false, sx }: Pick<ListItemProps, 'largeImg' | 'className' | 'sx'>) => {
  const classes = useStyles();
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  return (
    <MaterialListItemButton className={classNames(classes.root, className)} sx={sx}>
      <AspectRatioLoading className={classNames(classes.imgContainer, largeImg && lgUp && classes.largeImg)} />
      <Grid className={classes.content} container direction='column' wrap='nowrap'>
        <Skeleton height={60} width={200} />
        <Skeleton height={30} width={300} />
        <Skeleton height={30} width={250} />
      </Grid>
    </MaterialListItemButton>
  );
};
