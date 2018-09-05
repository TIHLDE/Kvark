import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';


// Material UI Components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close'

// Icons


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


class Snackbar extends Component {
    render() {
        const {classes, data} = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="subheading" color="primary" align='left' className={classes.flex}>
                            {data.text}
                        </Typography>
                        <IconButton color="inherit">
                            <Close/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

Snackbar.propTypes = {
    classes: PropTypes.object,
    data: PropTypes.object,
};

export default withStyles(styles)(Snackbar);
