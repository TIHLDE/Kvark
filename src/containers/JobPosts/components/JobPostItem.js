import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';

// Icons
import Date from '@material-ui/icons/DateRange';
import Location from '@material-ui/icons/LocationOn';
import Business from '@material-ui/icons/Business';
import TIHLDELOGO from '../../../assets/img/tihlde_image.png';

const styles = {
  root: {
    boxShadow: '0px 2px 4px #ddd, 0px 0px 4px #ddd',
    borderRadius: 5,
    marginBottom: 10,
    height: 140,
    padding: 10,
    position: 'relative',
    overflow: 'hidden',
    flexDirection: 'row',
    display: 'flex',
    backgroundColor: 'white',
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
    borderRadius: 5,
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
    color: '#000000',
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
    color: '#555555',
    fontSize: '1rem',
  },
  icon: {
    color: '#555555',
    height: 24,
    width: 24,
    margin: 0,
  },
  expired: {
    color: 'rgba(0,0,0,0.3)',
  },
  filter: {
    filter: 'opacity(0.3)',
  },
};

const InfoContent = withStyles(styles)((props) => (
  <Grid className={props.classes.infoRoot} container direction='row' wrap='nowrap' alignItems='center'>
    {props.icon}
    <Typography className={props.classes.info} variant='h6'>{props.label}</Typography>
  </Grid>
));

InfoContent.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string,
};

const JobPostItem = (props) => {
  const {classes, data} = props;
  const src = (data.image) ? data.image : TIHLDELOGO;
  const start = moment(data.deadline, ['YYYY-MM-DD HH:mm'], 'nb');
  return (
    <ListItem className={classes.root} button onClick={props.onClick}>
      <img className={classNames(classes.src, (data.expired) ? classes.filter : '')} src={src} alt={data.title} />
      <Grid className={classes.content} container direction='column' wrap='nowrap'>
        <Typography className={classNames(classes.title, (data.expired) ? classes.expired : '')} variant='h6' gutterBottom>
          <strong>{data.title}</strong>
        </Typography>
        <InfoContent icon={<Business className={classes.icon}/>} label={data.company} />
        <InfoContent icon={<Location className={classes.icon}/>} label={data.location} />
        <InfoContent icon={<Date className={classes.icon}/>} label={start.format('DD.MM.YYYY')} />
      </Grid>
    </ListItem>
  );
};

JobPostItem.propTypes = {
  classes: PropTypes.object,

  data: PropTypes.object,
  onClick: PropTypes.func,
};

export default withStyles(styles)(JobPostItem);
