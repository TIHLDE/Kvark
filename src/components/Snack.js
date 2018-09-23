import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

// Icons
import CloseIcon from '@material-ui/icons/Close';

// Project Components


const styles = {
    root: {
        width: 'auto',
        minHeight: 40,
    },
    flex: {
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '100%',
        height: '100%',
    },
};

class Snack extends Component {
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={this.props.open}
                    onClose={this.handleClose}
                >
                    <SnackbarContent
                        className={this.props.className}
                        message={
                            <div className={classes.flex}>
                                <div className='pulse'/>
                                <Typography variant='subheading' color='inherit'>{this.props.message}</Typography>
                                <IconButton color='inherit' onClick={this.props.onClose}><CloseIcon/></IconButton>
                            </div>
                        }
                    />
                </Snackbar>
            </div>
        );
    }
}

Snack.propTypes = {
    classes: PropTypes.object,
    data: PropTypes.object,
    open: PropTypes.bool,

    className: PropTypes.string,
    message: PropTypes.string,
    onClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(Snack);
