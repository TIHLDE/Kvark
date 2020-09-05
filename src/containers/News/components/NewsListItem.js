import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import URLS from '../../../URLS';
import moment from 'moment';
import { getMonth } from '../../../utils';
import { Link } from 'react-router-dom';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';

// Icons
import Date from '@material-ui/icons/DateRange';
import TIHLDELOGO from '../../../assets/img/TihldeBackgroundNew.png';

const styles = (theme) => ({
  root: {
    boxShadow: '0px 2px 4px ' + theme.colors.border.main + '88, 0px 0px 4px ' + theme.colors.border.main + '88',
    borderRadius: theme.sizes.border.radius,
    marginBottom: 10,
    height: 140,
    padding: 10,
    position: 'relative',
    overflow: 'hidden',
    flexDirection: 'row',
    display: 'flex',
    backgroundColor: theme.colors.background.light,
    '@media only screen and (min-width: 900px)': {
      height: 160,
    },
    '@media only screen and (max-width: 600px)': {
      overflow: 'hidden',
      minHeight: 150,
      height: 'auto',
      flexDirection: 'column',
    },
  },
  src: {
    objectFit: 'contain',
    height: '100%',
    width: '40%',
    maxWidth: 250,
    borderRadius: theme.sizes.border.radius,
    '@media only screen and (min-width: 900px)': {
      minWidth: '45%',
      maxWidth: 'none',
    },
    '@media only screen and (max-width: 600px)': {
      width: '100%',
      maxWidth: 'none',
      height: 150,
    },
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
  link: {
    textDecoration: 'none',
  },
});

const InfoContent = withStyles(styles)((props) => (
  <Grid alignItems='center' className={props.classes.infoRoot} container direction='row' wrap='nowrap'>
    {props.icon}
    <Typography className={props.classes.info} variant='h6'>
      {props.label}
    </Typography>
  </Grid>
));

InfoContent.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string,
};

const getDate = (date) => {
  return date.date() + ' ' + getMonth(date.month()) + ' ' + date.year() + ' - kl. ' + date.format('HH:mm');
};

const NewsListItem = (props) => {
  const { classes, data } = props;
  const src = data.image ? data.image : TIHLDELOGO;
  const start = moment(data.created_at, ['YYYY-MM-DD HH:mm'], 'nb');
  return (
    <ListItem button className={classes.root} component={Link} to={URLS.news + ''.concat(data.id, '/')}>
      <img alt={data.title} className={classes.src} src={src} />
      <Grid className={classes.content} container direction='column' wrap='nowrap'>
        <Typography className={classes.title} variant='h5'>
          <strong>{data.title}</strong>
        </Typography>
        <InfoContent icon={<Date className={classes.icon} />} label={getDate(start)} />
      </Grid>
    </ListItem>
  );
};

NewsListItem.propTypes = {
  classes: PropTypes.object,

  data: PropTypes.object,
  onClick: PropTypes.func,
};

export default withStyles(styles)(NewsListItem);
