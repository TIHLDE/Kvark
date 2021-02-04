import { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

// Icons
import NoDataIcon from '../../../assets/icons/empty.svg';

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

class NoPostsIndicator extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.imageWrapper}>
          <img alt='Ingen arrangementer' className={classes.image} src={NoDataIcon} />
        </div>
        <MessageIndicator header='Fant ingen annonser' subheader='' />
      </div>
    );
  }
}

NoPostsIndicator.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(NoPostsIndicator);
