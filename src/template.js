import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Material UI Components

// Icons

const styles = {

};

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


const Template = (props) => {
    const {classes} = props;
    return (
        null
    );
};
