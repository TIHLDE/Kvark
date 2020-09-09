import React from 'react';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = {
  imgContainer: {
    paddingRight: 8,
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
  },
};

const EventListItem = (props) => {
  const { classes, icon, text } = props;
  return (
    <div className={classes.listItem}>
      <div className={classes.imgContainer}>{icon}</div>
      <Typography>{text}</Typography>
    </div>
  );
};

EventListItem.propTypes = {
  icon: PropTypes.object,
  text: PropTypes.string,
  classes: PropTypes.object,
};

export default withStyles(styles)(EventListItem);
