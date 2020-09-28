import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getMonth } from '../../../utils';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

// Project Components
import MarkdownRenderer from '../../../components/miscellaneous/MarkdownRenderer';
import Paper from '../../../components/layout/Paper';

const styles = (theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gridTemplateRows: 'auto',
    gridGap: '20px',
    marginTop: 20,

    position: 'relative',
    overflow: 'hidden',

    '@media only screen and (max-width: 800px)': {
      gridTemplateColumns: '100%',
      justifyContent: 'center',
      gridGap: '10px',
      marginTop: 10,
    },
  },
  wrapper: {
    padding: 20,
    '@media only screen and (max-width: 600px)': {
      padding: 10,
    },
  },
  image: {
    width: '100%',
    height: 'auto',
    maxHeight: 350,
    objectFit: 'cover',
    backgroundColor: theme.palette.colors.border.main,
    borderRadius: theme.palette.sizes.border.radius,
    display: 'block',
    boxSizing: 'border-box',
  },
  title: {
    color: theme.palette.colors.text.main,
    padding: 26,
    paddingLeft: 0,
    paddingTop: 0,
  },
  header: {
    color: theme.palette.colors.text.main,
    padding: 15,
    paddingLeft: 0,
    paddingTop: 0,
  },
  description: {
    color: theme.palette.colors.text.light,
  },
  content: {
    height: 'fit-content',
    '@media only screen and (max-width: 800px)': {
      order: 1,
    },
  },
  details: {
    padding: '10px 20px',
    marginBottom: 20,
    maxWidth: 280,
    '@media only screen and (max-width: 800px)': {
      order: 0,
      marginBottom: 10,
      maxWidth: 'none',
    },
  },
  info: {
    width: 'auto',
    flexDirection: 'column',

    '@media only screen and (max-width: 800px)': {
      flexDirection: 'row',
    },
  },
  ml: {
    marginRight: 5,
    fontWeight: 'bold',
    color: theme.palette.colors.text.light,
  },
  ml2: {
    textAlign: 'center',
    color: theme.palette.colors.text.light,
  },
});

const getDate = (date) => {
  return date.date() + ' ' + getMonth(date.month()) + ' ' + date.year() + ' - kl. ' + date.format('HH:mm');
};

const DetailContent = withStyles(styles)((props) => (
  <Grid alignItems='center' className={props.classes.info} container justify='flex-start' wrap='nowrap'>
    <Typography className={props.classes.ml} variant='subtitle1'>
      {props.title}
    </Typography>
    <Typography className={props.classes.ml2} variant='subtitle1'>
      {props.info}
    </Typography>
  </Grid>
));
DetailContent.propTypes = {
  classes: PropTypes.object,
  title: PropTypes.string,
  info: PropTypes.string,
};

const NewsRenderer = (props) => {
  const { classes, newsData } = props;

  const title = newsData.title || '';
  const header = newsData.header || '';
  const body = newsData.body || '';
  const createdDate = moment(newsData.created_at, ['YYYY-MM-DD HH:mm'], 'nb');
  const updatedDate = moment(newsData.updated_at, ['YYYY-MM-DD HH:mm'], 'nb');

  return (
    <div className={classes.wrapper}>
      {newsData.image && <img alt={newsData.image_alt} className={classes.image} src={newsData.image} />}
      <div className={classes.grid}>
        <div>
          <Paper className={classes.details} noPadding>
            <DetailContent info={getDate(moment(createdDate, ['YYYY-MM-DD HH:mm'], 'nb'))} title='Publisert: ' />
            <DetailContent info={getDate(moment(updatedDate, ['YYYY-MM-DD HH:mm'], 'nb'))} title='Oppdatert: ' />
          </Paper>
        </div>
        <Paper className={classes.content}>
          <Typography className={classes.title} variant='h5'>
            <strong>{title}</strong>
          </Typography>
          <Typography className={classes.header} variant='h6'>
            <strong>{header}</strong>
          </Typography>
          <MarkdownRenderer className={classes.description} value={body} />
        </Paper>
      </div>
    </div>
  );
};

NewsRenderer.propTypes = {
  classes: PropTypes.object,
  newsData: PropTypes.object.isRequired,
};

export default withStyles(styles)(NewsRenderer);
