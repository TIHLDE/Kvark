import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { urlEncode } from 'utils';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MaterialListItem from '@material-ui/core/ListItem';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core';

// Icons
import TIHLDELOGO from 'assets/img/TihldeBackground.jpg';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    boxShadow: '0px 2px 4px ' + theme.palette.colors.border.main + '88, 0px 0px 4px ' + theme.palette.colors.border.main + '88',
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1),
    height: 'auto',
    padding: theme.spacing(1),
    position: 'relative',
    overflow: 'hidden',
    flexDirection: 'row',
    display: 'flex',
    backgroundColor: theme.palette.colors.background.light,
    [theme.breakpoints.down('sm')]: {
      overflow: 'hidden',
      minHeight: 150,
      flexDirection: 'column',
    },
  },
  src: {
    objectFit: 'cover',
    height: 160,
    width: '40%',
    maxWidth: 250,
    borderRadius: theme.shape.borderRadius,
    '&:not([src*=".jpg"])': {
      background: '#fff',
    },
    [theme.breakpoints.up('md')]: {
      minWidth: '45%',
      maxWidth: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      maxWidth: 'none',
      height: 140,
    },
  },
  imgContain: {
    objectFit: 'contain',
  },
  content: {
    marginLeft: theme.spacing(2),
    padding: theme.spacing(1, 0),
    border: 6,
    height: '100%',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1, 0, 0),
    },
  },
  title: {
    color: theme.palette.colors.text.main,
    fontWeight: 'bold',
    fontSize: '24px',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  infoRoot: {
    width: 'auto',
    margin: theme.spacing(0.25, 0),
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  info: {
    marginLeft: theme.spacing(1),
    color: theme.palette.colors.text.lighter,
    fontSize: '1rem',
    textAlign: 'center',
  },
  icon: {
    color: theme.palette.colors.text.lighter,
    height: 24,
    width: 24,
    margin: theme.spacing(0),
  },
  expired: {
    color: theme.palette.colors.text.main + 'cc',
  },
  filter: {
    filter: 'opacity(0.4)',
  },
}));

type IconProps = {
  icon: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>>;
  label: string;
};

const InfoContent = ({ icon: Icon, label }: IconProps) => {
  const classes = useStyles();
  return (
    <Grid alignItems='center' className={classes.infoRoot} container direction='row' wrap='nowrap'>
      <Icon className={classes.icon} />
      <Typography className={classes.info} variant='h3'>
        {label}
      </Typography>
    </Grid>
  );
};
type ListItemProps = {
  title: string;
  link: string;
  expired?: boolean;
  img?: string;
  imgAlt?: string;
  imgContain?: string;
  info?: IconProps[];
};

function ListItem({ title, link, expired, img, imgAlt, imgContain, info }: ListItemProps) {
  const classes = useStyles();
  const src = img || TIHLDELOGO;
  return (
    <MaterialListItem button className={classes.root} component={Link} to={link + urlEncode(title) + '/'}>
      <img alt={imgAlt || title} className={classNames(classes.src, expired && classes.filter, imgContain && classes.imgContain)} src={src} />
      <Grid className={classes.content} container direction='column' wrap='nowrap'>
        <Typography className={classNames(classes.title, expired && classes.expired)} variant='h2'>
          <strong>{title}</strong>
        </Typography>
        {info?.map((item: IconProps, index: number) => (
          <InfoContent icon={item.icon} key={index} label={item.label} />
        ))}
      </Grid>
    </MaterialListItem>
  );
}
export default ListItem;
