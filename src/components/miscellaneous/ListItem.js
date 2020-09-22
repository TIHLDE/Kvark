import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { urlEncode } from '../../utils';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MaterialListItem from '@material-ui/core/ListItem';

// Icons
import TIHLDELOGO from '../../assets/img/TihldeBackgroundNew.png';

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: '0px 2px 4px ' + theme.colors.border.main + '88, 0px 0px 4px ' + theme.colors.border.main + '88',
    borderRadius: theme.sizes.border.radius,
    marginBottom: 10,
    height: 'auto',
    padding: 10,
    position: 'relative',
    overflow: 'hidden',
    flexDirection: 'row',
    display: 'flex',
    backgroundColor: theme.colors.background.light,
    '@media only screen and (max-width: 600px)': {
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
    borderRadius: theme.sizes.border.radius,
    '&:not([src*=".jpg"])': {
      background: '#fff',
    },
    '@media only screen and (min-width: 900px)': {
      minWidth: '45%',
      maxWidth: 'none',
    },
    '@media only screen and (max-width: 600px)': {
      width: '100%',
      maxWidth: 'none',
      height: 140,
    },
  },
  imgContain: {
    objectFit: 'contain',
  },
  content: {
    marginLeft: 20,
    padding: '10px 0px',
    border: 6,
    height: '100%',
    justifyContent: 'space-evenly',
    '@media only screen and (max-width: 600px)': {
      padding: '10px 0px 0px',
    },
  },
  title: {
    color: theme.colors.text.main,
    fontWeight: 'bold',
    fontSize: '24px',
    '@media only screen and (max-width: 600px)': {
      textAlign: 'center',
    },
  },
  infoRoot: {
    width: 'auto',
    '@media only screen and (max-width: 600px)': {
      justifyContent: 'center',
    },
  },
  info: {
    marginLeft: 10,
    color: theme.colors.text.lighter,
    fontSize: '1rem',
    textAlign: 'center',
  },
  icon: {
    color: theme.colors.text.lighter,
    height: 24,
    width: 24,
    margin: 0,
  },
  expired: {
    color: theme.colors.text.main + 'cc',
  },
  filter: {
    filter: 'opacity(0.4)',
  },
}));

const InfoContent = (props) => {
  const classes = useStyles();
  return (
    <Grid alignItems='center' className={classes.infoRoot} container direction='row' wrap='nowrap'>
      <props.icon className={classes.icon} />
      <Typography className={classes.info} variant='h6'>
        {props.label}
      </Typography>
    </Grid>
  );
};

InfoContent.propTypes = {
  icon: PropTypes.object,
  label: PropTypes.string,
};

const ListItem = ({ title, link, expired, img, imgAlt, imgContain, info }) => {
  const classes = useStyles();
  const src = img || TIHLDELOGO;
  return (
    <MaterialListItem button className={classes.root} component={Link} to={link + urlEncode(title) + '/'}>
      <img alt={imgAlt || title} className={classNames(classes.src, expired && classes.filter, imgContain && classes.imgContain)} src={src} />
      <Grid className={classes.content} container direction='column' wrap='nowrap'>
        <Typography className={classNames(classes.title, expired && classes.expired)} variant='h5'>
          <strong>{title}</strong>
        </Typography>
        {info?.map((item, index) => (
          <InfoContent icon={item.icon} key={index} label={item.label} />
        ))}
      </Grid>
    </MaterialListItem>
  );
};

ListItem.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  expired: PropTypes.bool,
  img: PropTypes.string,
  imgAlt: PropTypes.string,
  imgContain: PropTypes.bool,
  info: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.object.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
};

export default ListItem;
