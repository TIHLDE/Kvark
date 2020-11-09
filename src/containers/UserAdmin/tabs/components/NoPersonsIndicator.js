import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

// Icons
import EventIcon from '../../../../assets/icons/empty.svg';

// Project Components
import MessageIndicator from '../../../../components/layout/MessageIndicator';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageWrapper: {
    maxWidth: 125,
    maxHeight: 125,
    width: 125,
    height: 125,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  },
};

class NoEventsIndicator extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.imageWrapper}>
          <img alt='Ingen Brukere' className={classes.image} src={EventIcon} />
        </div>
        <MessageIndicator header='Fant ingen brukere' />
      </div>
    );
  }
}

NoEventsIndicator.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(NoEventsIndicator);
