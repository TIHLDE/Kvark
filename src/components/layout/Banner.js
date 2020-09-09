import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import parser from 'html-react-parser';
import classNames from 'classnames';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';

const styles = (theme) => ({
  root: {
    overflow: 'hidden',
    width: '100%',
  },
  top: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
  },
  topInner: {
    height: 'auto',
    padding: '60px 0 0',
    background: (props) => (props.background ? props.background : theme.colors.gradient.main.top),
  },
  topContent: {
    maxWidth: 1200,
    margin: 'auto',
    padding: 20,
    paddingBottom: 0,
    paddingTop: 70,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    '@media only screen and (max-width: 900px)': {
      fontSize: '2.1em',
      padding: 20,
      flexDirection: 'column',
    },
  },
  title: {
    color: theme.colors.gradient.main.text,
    fontWeight: 'bold',
    fontSize: 72,
    '@media only screen and (max-width: 900px)': {
      fontSize: 50,
      padding: '0 20px',
    },
  },
  text: {
    color: theme.colors.gradient.main.text,
    paddingTop: 20,
    maxWidth: 600,
    width: '50vw',
    fontSize: 18,
    '@media only screen and (max-width: 900px)': {
      fontSize: '16px',
      padding: 20,
      width: '100%',
    },
  },
  line: {
    height: 4,
    backgroundColor: theme.colors.gradient.main.text,
    width: 50,
  },
  children: {
    padding: '20px 0 0',
    minWidth: 300,
    '@media only screen and (max-width: 900px)': {
      minWidth: 200,
      padding: '20px 20px 0 20px',
    },
  },
  svg: {
    marginTop: -1,
    marginRight: -5,
    marginLeft: -5,
  },
  background: {
    fill: (props) => (props.background ? props.background : theme.colors.gradient.main.top),
    fillOpacity: 1,
  },
});

const Banner = (props) => {
  const { classes, className, title, text, children } = props;
  return (
    <div className={classNames(classes.root, className)}>
      <div className={classes.top}>
        <div className={classNames(classes.topInner, classes.background)}>
          <div className={classes.topContent}>
            <div>
              {title && (
                <Typography className={classes.title} variant='h3'>
                  <strong>{title}</strong>
                  <div className={classes.line} />
                </Typography>
              )}
              {text && (
                <Typography className={classes.text} variant='subtitle2'>
                  {parser(text)}
                </Typography>
              )}
            </div>
            {children && <div className={classes.children}>{children}</div>}
          </div>
        </div>
        <Hidden smUp>
          <svg className={classes.svg} viewBox='0 30 500 45' xmlns='http://www.w3.org/2000/svg'>
            <path className={classes.background} d='M0.00,49.99 C225.95,117.73 260.38,-10.55 500.00,49.99 L500.00,-0.00 L0.00,-0.00 Z'></path>
          </svg>
        </Hidden>
        <Hidden xsDown>
          <svg className={classes.svg} viewBox='0 30 500 45' xmlns='http://www.w3.org/2000/svg'>
            <path className={classes.background} d='M0.00,49.99 C233.29,86.15 256.43,22.00 500.00,49.99 L500.00,-0.00 L0.00,-0.00 Z'></path>
          </svg>
        </Hidden>
      </div>
    </div>
  );
};

Banner.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  children: PropTypes.node,
  background: PropTypes.string,
};

export default withStyles(styles)(Banner);
