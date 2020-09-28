import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import parser from 'html-react-parser';
import classNames from 'classnames';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Project Components
import Paper from './Paper';

const styles = (theme) => ({
  root: {
    padding: 40,
    '@media only screen and (max-width: 950px)': {
      margin: '0 5px',
    },
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    '@media only screen and (max-width: 1100px)': {
      flexDirection: 'column',
    },
  },
  image: {
    maxWidth: 160,
    maxHeight: 160,
  },
  margin: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: 30,

    '@media only screen and (max-width: 1100px)': {
      margin: '0 30px 30px 30px',
      minHeight: 160,
    },
  },
  padding: {
    padding: '10px 0px',
  },
  cover: {
    flex: '1',
  },
  header: {
    marginBottom: 10,
    color: theme.palette.colors.text.main,
  },
  subheader: {
    color: theme.palette.colors.text.main,
  },
  text: {
    color: theme.palette.colors.text.light,
  },
  grow: {
    flexGrow: 1,
  },
  children: {},
});

const InfoCard = (props) => {
  const { classes } = props;

  return (
    <Paper className={classNames(classes.root, props.className)} noPadding>
      <div className={classes.wrapper}>
        {props.src && (
          <div className={classes.margin}>
            <img alt={props.alt} className={classNames(classes.image, props.imageClass)} src={props.src} />
          </div>
        )}
        <Grid className={props.justifyText ? classes.cover : ''} container direction='column' justify='flex-start' nowrap='nowrap'>
          <Typography align='left' className={classes.header} variant='h5'>
            <strong>{props.header}</strong>
          </Typography>
          {props.text && (
            <Typography className={classes.text} component='p'>
              {parser(props.text)}
            </Typography>
          )}

          {props.subText && (
            <Fragment>
              <Typography className={classNames(classes.padding, classes.subheader)} variant='subtitle1'>
                <strong>{props.subheader}</strong>
              </Typography>
              <Typography className={classes.text} component='p'>
                {parser(props.subText)}
              </Typography>
            </Fragment>
          )}
          {props.children && <div className={classNames(classes.grow, classes.padding, props.classes.children)}>{props.children}</div>}
        </Grid>
      </div>
    </Paper>
  );
};

InfoCard.propTypes = {
  classes: PropTypes.object,
  header: PropTypes.string,
  text: PropTypes.string,
  src: PropTypes.any,
  alt: PropTypes.string,
  justifyText: PropTypes.bool,
  subheader: PropTypes.string,
  subText: PropTypes.string,
  className: PropTypes.string,
  elevation: PropTypes.number,
  imageClass: PropTypes.string,

  children: PropTypes.node,
};

InfoCard.defaultProps = {
  elevation: 1,
};

export default withStyles(styles)(InfoCard);
