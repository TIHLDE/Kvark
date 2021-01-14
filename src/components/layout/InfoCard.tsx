import { Fragment, ReactNode } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import parser from 'html-react-parser';
import classNames from 'classnames';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Project Components
import Paper from 'components/layout/Paper';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(0, 1),
    },
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    [theme.breakpoints.down('lg')]: {
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
    marginRight: theme.spacing(4),

    [theme.breakpoints.down('lg')]: {
      margin: theme.spacing(0, 4, 4, 4),
      minHeight: 160,
    },
  },
  padding: {
    padding: theme.spacing(1, 0),
  },
  cover: {
    flex: '1',
  },
  header: {
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  subheader: {
    color: theme.palette.text.primary,
  },
  text: {
    color: theme.palette.text.secondary,
  },
  grow: {
    flexGrow: 1,
  },
  children: {},
}));

export type InfoCardProps = {
  header: string;
  text?: string;
  src?: string;
  srcComponent?: ReactNode;
  alt?: string;
  justifyText?: boolean;
  subheader?: string;
  subText?: string;
  className?: string;
  imageClass?: string;
  children?: ReactNode;
};
const InfoCard = ({ className, header, text, src, srcComponent, alt, justifyText, subheader, subText, imageClass, children }: InfoCardProps) => {
  const classes = useStyles();
  return (
    <Paper className={classNames(classes.root, className)} noPadding>
      <div className={classes.wrapper}>
        {src ? (
          <div className={classes.margin}>
            <img alt={alt || header} className={classNames(classes.image, imageClass)} src={src} />
          </div>
        ) : (
          srcComponent && <>{srcComponent}</>
        )}
        <Grid className={justifyText ? classes.cover : ''} container direction='column' justify='flex-start'>
          <Typography align='left' className={classes.header} variant='h3'>
            <strong>{header}</strong>
          </Typography>
          {text && (
            <Typography className={classes.text} component='p'>
              {parser(text)}
            </Typography>
          )}

          {subText && (
            <Fragment>
              <Typography className={classNames(classes.padding, classes.subheader)} variant='subtitle1'>
                <strong>{subheader}</strong>
              </Typography>
              <Typography className={classes.text} component='p'>
                {parser(subText)}
              </Typography>
            </Fragment>
          )}
          {children && <div className={classNames(classes.grow, classes.padding, classes.children)}>{children}</div>}
        </Grid>
      </div>
    </Paper>
  );
};

export default InfoCard;
