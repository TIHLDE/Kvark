import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Material UI Components
import Card from '@material-ui/core/Card';

const styles = {

};

class Jodel extends Component {

    render() {
        return <Card></Card>;
    }
}

Jodel.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(Jodel);
