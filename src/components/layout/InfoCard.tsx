import { Grid, Typography } from '@mui/material';
import { makeStyles } from 'makeStyles';
import { ReactNode } from 'react';

import Paper from 'components/layout/Paper';
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';

const useStyles = makeStyles()((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    [theme.breakpoints.down('lg')]: {
      flexDirection: 'column',
    },
  },
  centerAlign: {
    alignItems: 'center',
  },
  image: {
    maxWidth: 160,
    maxHeight: 160,
    borderRadius: theme.shape.borderRadius,
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
  text: {
    color: theme.palette.text.secondary,
    whiteSpace: 'break-spaces',
  },
  grow: {
    flexGrow: 1,
  },
}));

export type InfoCardProps = {
  header: string;
  text?: string;
  src?: string;
  alt?: string;
  justifyText?: boolean;
  className?: string;
  imageClass?: string;
  children?: ReactNode;
};
const InfoCard = ({ className, header, text, src, alt, justifyText, imageClass, children }: InfoCardProps) => {
  const { classes, cx } = useStyles();
  return (
    <Paper className={cx(classes.root, className)} noPadding>
      <div className={cx(classes.wrapper, src && classes.centerAlign)}>
        {Boolean(src) && (
          <div className={classes.margin}>
            <img alt={alt || header} className={cx(classes.image, imageClass)} loading='lazy' src={src} />
          </div>
        )}
        <Grid className={justifyText ? classes.cover : ''} container direction='column' justifyContent='flex-start'>
          <Typography align='left' className={classes.header} variant='h3'>
            <strong>{header}</strong>
          </Typography>
          {text && <MarkdownRenderer value={text} />}
          {children && <div className={cx(classes.grow, classes.padding)}>{children}</div>}
        </Grid>
      </div>
    </Paper>
  );
};

export default InfoCard;
