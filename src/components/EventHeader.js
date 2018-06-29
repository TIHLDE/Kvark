import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import Typography from '@material-ui/core/Typography';

const styles = {
    root: {
        width: '100%',
        minHeight: '500px',
        maxWidth: 1400,
        margin: 'auto',
        backgroundColor: 'whitesmoke',

        // Should be removed - just a demostration
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
};

class EventHeader extends Component {

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <Typography variant='display4' align='center'>Event Header</Typography>
                <Typography variant='headline' color='textSecondary' align='center'>Eller Noe Lignende</Typography>
            </div>
        );
    }
}

EventHeader.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(EventHeader);
