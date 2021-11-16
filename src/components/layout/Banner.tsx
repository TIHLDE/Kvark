import { ReactNode } from 'react';
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';

// Material UI Components
import { makeStyles } from 'makeStyles';
import { Typography, Button, ButtonProps } from '@mui/material';

const useStyles = makeStyles<Pick<BannerProps, 'background'>>()((theme, { background }) => ({
  banner: {
    whiteSpace: 'break-spaces',
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
  },
  bannerInner: {
    height: 'auto',
    padding: theme.spacing(8, 0, 0),
    background: background || theme.palette.colors.gradient.main.top,
  },
  bannerContent: {
    maxWidth: theme.breakpoints.values.xl,
    margin: 'auto',
    padding: theme.spacing(3, 3, 1),
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('lg')]: {
      fontSize: '2.1em',
      padding: theme.spacing(2),
      flexDirection: 'column',
    },
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1),
    },
  },
  title: {
    color: theme.palette.getContrastText(background || theme.palette.colors.gradient.main.top),
    fontSize: theme.typography.pxToRem(66),
    [theme.breakpoints.down('lg')]: {
      fontSize: theme.typography.pxToRem(50),
      padding: theme.spacing(0, 2),
      overflowWrap: 'break-word',
      '@supports not (overflow-wrap: anywhere)': {
        hyphens: 'auto',
      },
    },
    [theme.breakpoints.down('md')]: {
      fontSize: theme.typography.pxToRem(40),
    },
  },
  text: {
    '& p,a': {
      color: theme.palette.getContrastText(background || theme.palette.colors.gradient.main.top),
    },
    paddingTop: theme.spacing(2),
    maxWidth: 600,
    width: '50vw',
    [theme.breakpoints.down('lg')]: {
      fontSize: 16,
      padding: theme.spacing(2, 2, 0),
      width: '100%',
    },
  },
  line: {
    height: 4,
    backgroundColor: theme.palette.getContrastText(background || theme.palette.colors.gradient.main.top),
    borderRadius: theme.shape.borderRadius,
    width: 90,
    [theme.breakpoints.down('lg')]: {
      width: 50,
    },
  },
  bannerButton: {
    color: theme.palette.getContrastText(background || theme.palette.colors.gradient.main.top),
    borderColor: theme.palette.getContrastText(background || theme.palette.colors.gradient.main.top),
    '&:hover': {
      borderColor: theme.palette.getContrastText(background || theme.palette.colors.gradient.main.top),
    },
  },
  children: {
    display: 'grid',
    gridGap: theme.spacing(1),
    padding: theme.spacing(2, 0, 0),
    minWidth: 350,
    height: 'fit-content',
    [theme.breakpoints.down('lg')]: {
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
    fill: background || theme.palette.colors.gradient.main.top,
    fillOpacity: 1,
  },
}));

export type BannerButtonProps = ButtonProps & Pick<BannerProps, 'background'>;

export const BannerButton = ({ background, children, className, ...props }: BannerButtonProps) => {
  const { classes, cx } = useStyles({ background });
  return (
    <Button className={cx(classes.bannerButton, className)} fullWidth variant='outlined' {...props}>
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

const Banner = ({ className, title, text, children, background }: BannerProps) => {
  const { classes, cx } = useStyles({ background });
  return (
    <div className={cx(classes.banner, className)}>
      <div className={cx(classes.bannerInner, classes.background)}>
        <div className={classes.bannerContent}>
          <div>
            {title && (
              <Typography className={classes.title} variant='h1'>
                {title}
                <div className={classes.line} />
              </Typography>
            )}
            {text && Boolean(text.trim().length) && (
              <div className={classes.text}>
                <MarkdownRenderer value={text} />
              </div>
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
