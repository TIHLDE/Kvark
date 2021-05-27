import { ReactNode } from 'react';
import parser from 'html-react-parser';
import classNames from 'classnames';
import MuiLinkify from 'material-ui-linkify';

// Material UI Components
import { makeStyles, Theme, Typography, Button, ButtonProps } from '@material-ui/core';

const useStyles = makeStyles<Theme, Pick<BannerProps, 'background'>>((theme) => ({
  banner: {
    whiteSpace: 'break-spaces',
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
  },
  bannerInner: {
    height: 'auto',
    padding: theme.spacing(8, 0, 0),
    background: ({ background }) => background || theme.palette.colors.gradient.main.top,
  },
  bannerContent: {
    maxWidth: theme.breakpoints.values.xl,
    margin: 'auto',
    padding: theme.spacing(3, 3, 1),
    display: 'flex',
    justifyContent: 'space-between',
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
    color: ({ background }) => theme.palette.getContrastText(background || theme.palette.colors.gradient.main.top),
    fontSize: theme.typography.pxToRem(66),
    [theme.breakpoints.down('md')]: {
      fontSize: theme.typography.pxToRem(50),
      padding: theme.spacing(0, 2),
      overflowWrap: 'break-word',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(40),
    },
  },
  text: {
    color: ({ background }) => theme.palette.getContrastText(background || theme.palette.colors.gradient.main.top),
    paddingTop: theme.spacing(2),
    maxWidth: 600,
    width: '50vw',
    fontSize: 18,
    [theme.breakpoints.down('md')]: {
      fontSize: 16,
      padding: theme.spacing(2),
      width: '100%',
    },
  },
  line: {
    height: 4,
    backgroundColor: ({ background }) => theme.palette.getContrastText(background || theme.palette.colors.gradient.main.top),
    borderRadius: theme.shape.borderRadius / 2,
    width: 90,
    [theme.breakpoints.down('md')]: {
      width: 50,
    },
  },
  bannerButton: {
    color: ({ background }) => theme.palette.getContrastText(background || theme.palette.colors.gradient.main.top),
    borderColor: ({ background }) => theme.palette.getContrastText(background || theme.palette.colors.gradient.main.top),
    '&:hover': {
      borderColor: ({ background }) => theme.palette.getContrastText(background || theme.palette.colors.gradient.main.top),
    },
  },
  children: {
    display: 'grid',
    gridGap: theme.spacing(1),
    padding: theme.spacing(2, 0, 0),
    minWidth: 350,
    height: 'fit-content',
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
    fill: ({ background }) => background || theme.palette.colors.gradient.main.top,
    fillOpacity: 1,
  },
}));

export type BannerButtonProps = ButtonProps & Pick<BannerProps, 'background'>;

export const BannerButton = ({ background, children, className, ...props }: BannerButtonProps) => {
  const classes = useStyles({ background });
  return (
    <Button className={classNames(classes.bannerButton, className)} color='primary' fullWidth variant='outlined' {...props}>
      {children}
    </Button>
  );
};

export type BannerProps = {
  className?: string;
  title?: string | ReactNode;
  text?: string;
  children?: ReactNode;
  background?: string;
};

const Banner = (props: BannerProps) => {
  const classes = useStyles(props);
  const { className, title, text, children } = props;
  return (
    <div className={classNames(classes.banner, className)}>
      <div className={classNames(classes.bannerInner, classes.background)}>
        <div className={classes.bannerContent}>
          <div>
            {title && (
              <Typography className={classes.title} variant='h1'>
                {title}
                <div className={classes.line} />
              </Typography>
            )}
            {text && (
              <MuiLinkify LinkProps={{ color: 'inherit', underline: 'always' }}>
                <Typography className={classes.text} component='p' variant='subtitle2'>
                  {parser(text)}
                </Typography>
              </MuiLinkify>
            )}
          </div>
          {children && <div className={classes.children}>{children}</div>}
        </div>
      </div>
      <svg className={classes.svg} viewBox='0 35 500 35' xmlns='http://www.w3.org/2000/svg'>
        <path className={classes.background} d='M0.00,49.99 C233.29,86.15 256.43,22.00 500.00,49.99 L500.00,-0.00 L0.00,-0.00 Z'></path>
      </svg>
    </div>
  );
};

export default Banner;
