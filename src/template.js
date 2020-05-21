/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components

// Project Components

const styles = {};

class Template extends Component {

  render() {
    const {classes} = this.props;
    return (
      null
    );
  }
}

Template.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Template);
