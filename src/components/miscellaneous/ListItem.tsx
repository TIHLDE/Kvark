import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { urlEncode, formatDate, getJobpostType } from 'utils';
import { parseISO } from 'date-fns';
import URLS from 'URLS';
import { News, JobPost } from 'types';

// Material UI Components
import { makeStyles } from 'makeStyles';
import {
  lighten,
  Theme,
  Skeleton,
  useMediaQuery,
  Grid,
  Typography,
  ListItem as MaterialListItemButton,
  ListItemProps as MaterialListItemButtonProps,
  SvgIconTypeMap,
} from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

// Icons
import BusinessIcon from '@mui/icons-material/BusinessRounded';
import DeadlineIcon from '@mui/icons-material/AlarmRounded';
import SchoolIcon from '@mui/icons-material/School';

// Project components
import AspectRatioImg, { AspectRatioLoading } from 'components/miscellaneous/AspectRatioImg';

const useStyles = makeStyles()((theme) => ({
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
    WebkitLineClamp: 2,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
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
  const { classes } = useStyles();
  return (
    <Grid alignItems='center' className={classes.infoRoot} container direction='row' wrap='nowrap'>
      {Icon && <Icon className={classes.icon} />}
      <Typography className={classes.info} variant='subtitle1'>
        {label}
      </Typography>
    </Grid>
  );
};

export type ListItemProps = {
  news?: News;
  jobpost?: JobPost;
  className?: string;
  largeImg?: boolean;
  sx?: MaterialListItemButtonProps['sx'];
};

const ListItem = ({ news, jobpost, className, largeImg = false, sx }: ListItemProps) => {
  const { classes, cx } = useStyles();
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const item = useMemo(() => {
    if (news) {
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
  }, [news, jobpost]);

  const info = useMemo((): Array<IconProps> | undefined => {
    if (news) {
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
  }, [news, jobpost]);

  if (!item || !info) {
    return null;
  }

  return (
    <MaterialListItemButton className={cx(classes.root, className)} component={Link} sx={sx} to={item.link}>
      <AspectRatioImg alt={item.imgAlt || item.title} className={cx(classes.imgContainer, largeImg && lgUp && classes.largeImg)} src={item.img} />
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
  const { classes, cx } = useStyles();
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  return (
    <MaterialListItemButton className={cx(classes.root, className)} sx={sx}>
      <AspectRatioLoading className={cx(classes.imgContainer, largeImg && lgUp && classes.largeImg)} />
      <Grid className={classes.content} container direction='column' wrap='nowrap'>
        <Skeleton height={60} width={200} />
        <Skeleton height={30} width={300} />
        <Skeleton height={30} width={250} />
      </Grid>
    </MaterialListItemButton>
  );
};
