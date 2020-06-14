/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components

// Icons/Images

// Project Components

const styles = {};

function Template(props) {
  const {classes} = props;
  const [variable, setVariable] = useState(null);

  return (
    null
  );
}

Template.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Template);
