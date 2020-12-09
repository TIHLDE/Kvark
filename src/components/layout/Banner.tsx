import React from 'react';
import parser from 'html-react-parser';
import classNames from 'classnames';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';

const useStyles = makeStyles((theme: Theme) => ({
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
    padding: theme.spacing(8, 0, 0),
    background: (props: BannerProps) => (props.background ? props.background : theme.palette.colors.gradient.main.top),
  },
  topContent: {
    maxWidth: theme.breakpoints.values.xl,
    margin: 'auto',
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(0),
    paddingTop: theme.spacing(9),
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    [theme.breakpoints.down('md')]: {
      fontSize: '2.1em',
      padding: theme.spacing(2),
      flexDirection: 'column',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
  title: {
    color: theme.palette.colors.gradient.main.text,
    fontSize: 72,
    [theme.breakpoints.down('md')]: {
      fontSize: 50,
      padding: theme.spacing(0, 2),
    },
  },
  text: {
    color: theme.palette.colors.gradient.main.text,
    paddingTop: theme.spacing(2),
    maxWidth: 600,
    width: '50vw',
    fontSize: 18,
    [theme.breakpoints.down('md')]: {
      fontSize: '16px',
      padding: theme.spacing(2),
      width: '100%',
    },
  },
  line: {
    height: 4,
    backgroundColor: theme.palette.colors.gradient.main.text,
    width: 50,
  },
  children: {
    padding: theme.spacing(2, 0, 0),
    minWidth: 300,
    [theme.breakpoints.down('md')]: {
      minWidth: 200,
      padding: theme.spacing(2, 2, 0, 2),
    },
  },
  svg: {
    marginTop: -1,
    marginRight: -5,
    marginLeft: -5,
  },
  background: {
    fill: (props: BannerProps) => (props.background ? props.background : theme.palette.colors.gradient.main.top),
    fillOpacity: 1,
  },
}));

export type BannerProps = {
  className?: string;
  title?: string;
  text?: string;
  children?: React.ReactNode;
  background?: string;
};

const Banner = (props: BannerProps) => {
  const classes = useStyles(props);
  const { className, title, text, children } = props;
  return (
    <div className={classNames(classes.root, className)}>
      <div className={classes.top}>
        <div className={classNames(classes.topInner, classes.background)}>
          <div className={classes.topContent}>
            <div>
              {title && (
                <Typography className={classes.title} variant='h1'>
                  {title}
                  <div className={classes.line} />
                </Typography>
              )}
              {text && (
                <Typography className={classes.text} component='p' variant='subtitle2'>
                  {parser(text)}
                </Typography>
              )}
            </div>
            {children && <div className={classes.children}>{children}</div>}
          </div>
        </div>
        <Hidden mdUp>
          <svg className={classes.svg} viewBox='0 30 500 45' xmlns='http://www.w3.org/2000/svg'>
            <path className={classes.background} d='M0.00,49.99 C225.95,117.73 260.38,-10.55 500.00,49.99 L500.00,-0.00 L0.00,-0.00 Z'></path>
          </svg>
        </Hidden>
        <Hidden smDown>
          <svg className={classes.svg} viewBox='0 30 500 45' xmlns='http://www.w3.org/2000/svg'>
            <path className={classes.background} d='M0.00,49.99 C233.29,86.15 256.43,22.00 500.00,49.99 L500.00,-0.00 L0.00,-0.00 Z'></path>
          </svg>
        </Hidden>
      </div>
    </div>
  );
};

export default Banner;
