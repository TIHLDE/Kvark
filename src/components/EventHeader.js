import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import Card from '@material-ui/core/Card';

const styles = {
    root: {
        width: '100%',
        minHeight: '400px',
        backgroundColor: 'whitesmoke',
    },
};

class EventHeader extends Component {

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
               
            </div>
        );
    }
}

EventHeader.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(EventHeader);
