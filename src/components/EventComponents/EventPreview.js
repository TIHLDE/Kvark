import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Material UI Components
import Modal from '@material-ui/core/Modal';

// Icons

const styles = {

};

class EventPreview extends Component {
    
    render() {
        const {classes} = this.props;
        return (
            <Modal open={true}>

            </Modal>
        );
    }
}

EventPreview.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(EventPreview);
