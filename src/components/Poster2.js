import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';
import {Link} from 'react-router-dom';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const styles = {
  root: {
      height: '100%',
      backgroundSize: '100%',
  }
};

class Poster extends Component {

    render() {
        const {classes, data} = this.props;
        const textColor = (data.color)? data.color : 'white';
        const image = (data.image)? data.image : null;

        return (
            <div className={classes.root} style={{backgroundImage: 'url(' + image + ')'}}>


            </div>
        );
    }
}

Poster.propTypes = {
    classes: PropTypes.object,
    data: PropTypes.object,
};

export default withStyles(styles)(Poster);
