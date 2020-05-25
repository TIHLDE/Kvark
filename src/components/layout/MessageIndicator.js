import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Icons

const styles = (theme) => ({
  root: {
    padding: '15px 5px',
    height: '100%',
  },
  header: {
    color: theme.colors.text.light,
  },
});

const MessageIndicator = (props) => {
  const {classes} = props;
  return (
    <Grid className={classes.root} container direction='column' wrap='nowrap' justify='center'>
      <Typography className={classes.header} variant={props.variant || 'h6'} color={props.color || 'inherit'} align='center' gutterBottom>{props.header}</Typography>
      <Typography className={classes.header} variant='subtitle1' align='center'>{props.subheader}</Typography>
    </Grid>
  );
};

MessageIndicator.propTypes = {
  classes: PropTypes.object,

  header: PropTypes.string,
  subheader: PropTypes.string,
  color: PropTypes.string,
  variant: PropTypes.string,
};

export default withStyles(styles)(MessageIndicator);
