import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import parseISO from 'date-fns/parseISO';
import classNames from 'classnames';
import { formatDate } from '../../../utils';

// Text
import Text from '../../../text/JobPostText';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

// Icons
import Business from '@material-ui/icons/Business';
import Location from '@material-ui/icons/LocationOn';
import Time from '@material-ui/icons/AccessTime';

// Project Components
import MarkdownRenderer from '../../../components/miscellaneous/MarkdownRenderer';
import Paper from '../../../components/layout/Paper';

const styles = (theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr',
    gridTemplateRows: 'auto',
    gridGap: '20px',

    position: 'relative',

    '@media only screen and (max-width: 800px)': {
      gridTemplateColumns: '100%',
      justifyContent: 'center',
    },
  },
  imageWrapper: {
    maxHeight: 454,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
    borderRadius: theme.shape.borderRadius,
  },
  title: {
    color: theme.palette.text.primary,

    '@media only screen and (max-width: 600px)': {
      fontSize: '2rem',
    },
  },
  content: {
    padding: 38,
    paddingBottom: 60,
    color: theme.palette.text.secondary,
    '@media only screen and (max-width: 800px)': {
      order: 0,
    },
  },
  details: {
    padding: 26,
    '@media only screen and (max-width: 800px)': {
      order: 1,
    },
  },
  info: {
    width: 'auto',
    marginBottom: 10,
    color: theme.palette.text.secondary,
    '@media only screen and (max-width: 800px)': {
      justifyContent: 'space-between',
    },
  },
  ml: { marginLeft: 10 },
  mt: { marginTop: 10 },
  mb: { marginBottom: 32 },
  emailLink: {
    color: theme.palette.colors.tihlde,
    cursor: 'pointer',
  },
});

const InfoContent = withStyles(styles)((props) => (
  <Grid alignItems='center' className={classNames(props.className, props.classes.info)} container direction='row' justify='flex-start' wrap='nowrap'>
    <Tooltip title={props.title}>{props.icon}</Tooltip>
    <Typography className={props.icon ? props.classes.ml : ''} variant='subtitle1'>
      {props.label}
    </Typography>
  </Grid>
));

InfoContent.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.node,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

const goToLink = (link, toMail = false) => {
  if (toMail) {
    window.location.href = 'mailto:'.concat(link);
  } else {
    window.open(link, '_blank');
  }
};

const JobPostRenderer = (props) => {
  const { classes } = props;
  const data = props.data || {};
  const deadline = data.deadline ? formatDate(parseISO(data.deadline)) : Text.noDeadline;
  const publishedAt = formatDate(parseISO(data.created_at));

  return (
    <div className={classes.grid}>
      <div>
        <Paper className={classes.content}>
          <Typography gutterBottom variant='caption'>
            Publisert: {publishedAt}
          </Typography>
          <Typography className={classNames(classes.title, classes.mb)} gutterBottom variant='h5'>
            <strong>{data.title}</strong>
          </Typography>
          <div className={classes.mb}>
            <MarkdownRenderer value={data.ingress || ''} />
          </div>
          <MarkdownRenderer value={data.body || ''} />
        </Paper>
      </div>
      <div>
        <Paper className={classes.details}>
          <div className={classes.imageWrapper}>
            <img alt={data.image_alt} className={classes.image} src={data.image} />
          </div>

          <Divider className={classes.mb} />
          <InfoContent icon={<Business />} label={<strong>{data.company}</strong>} title='Bedrift' />
          <InfoContent icon={<Time />} label={deadline} title='Søknadsfrist' />
          <InfoContent className={classes.mb} icon={<Location />} label={data.location} title='Sted' />

          {data.email && (
            <Fragment>
              <Divider className={classes.mb} />
              <Typography variant='subtitle1'>
                <strong>{Text.contact}</strong>
              </Typography>
              <Typography className={classNames(classes.emailLink, classes.mb)} onClick={() => goToLink(data.email, true)} variant='caption'>
                {data.email}
              </Typography>
            </Fragment>
          )}
          <Divider className={classes.mb} />
          {data.link && (
            <Button className={classes.mt} color='primary' fullWidth onClick={() => goToLink(data.link)} variant='outlined'>
              {Text.apply}
            </Button>
          )}
        </Paper>
      </div>
    </div>
  );
};

JobPostRenderer.propTypes = {
  classes: PropTypes.object,

  data: PropTypes.object.isRequired,
};

export default withStyles(styles)(JobPostRenderer);
