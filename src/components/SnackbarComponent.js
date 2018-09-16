import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';


// Material UI Components
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

// Icons
import Close from '@material-ui/icons/Close'

// Project Components


const styles = {
    root:{
        width: 'auto',
        maxHeight: 40,
        height: 'auto',
    },
    flex:{
        flexGrow: -1
    }
};


class SnackbarComponent extends Component {
    render() {
        const {classes, data} = this.props;
        return (
            <div className={classes.root}>
                <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    open={open}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">I love snacks</span>}
                >
                    <SnackbarContent

                    />
                </Snackbar>
            </div>
        );
    }
}

Snackbar.propTypes = {
    classes: PropTypes.object,
    data: PropTypes.object,
};

export default withStyles(styles)(SnackbarComponent);
