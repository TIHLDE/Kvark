import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// API Imports
import API from '../api/api';

// Project components
import Navigation from '../components/Navigation';
import LayoutGrid from '../components/Grid/LayoutGrid';
import Arrangements from './Arrangement'

const styles = {
};

class Landing extends Component {
    render() {
        return (
          <Navigation>
              <LayoutGrid/>
          </Navigation>
        );
    }
}

Landing.propTypes = {
    classes: PropTypes.object,
};


export default withStyles(styles)(Landing);
