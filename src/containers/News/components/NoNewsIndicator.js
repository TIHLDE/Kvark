import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

// Icons
import NewsIcon from '../../../assets/img/news.svg';

// Project Components
import MessageIndicator from '../../../components/layout/MessageIndicator';

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
    const {classes} = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.imageWrapper}>
          <img className={classes.image} src={NewsIcon} alt='Ingen nyheter' />
        </div>
        <MessageIndicator header='Ingen nyheter' />
      </div>
    );
  }
}

NoEventsIndicator.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(NoEventsIndicator);
