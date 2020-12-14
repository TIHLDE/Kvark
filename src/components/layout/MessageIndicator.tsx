import React from 'react';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography, { TypographyProps } from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2, 1),
    height: '100%',
  },
  header: {
    color: theme.palette.text.secondary,
  },
}));

export type MessageIndicatorProps = {
  header: string;
  subheader: string;
  color?: TypographyProps['color'];
  variant?: TypographyProps['variant'];
};

const MessageIndicator = ({ header, subheader, color = 'inherit', variant = 'h3' }: MessageIndicatorProps) => {
  const classes = useStyles();
  return (
    <Grid className={classes.root} container direction='column' justify='center' wrap='nowrap'>
      <Typography align='center' className={classes.header} color={color} gutterBottom variant={variant}>
        {header}
      </Typography>
      <Typography align='center' className={classes.header} variant='subtitle1'>
        {subheader}
      </Typography>
    </Grid>
  );
};

export default MessageIndicator;
