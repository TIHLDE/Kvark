import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = {
    root: {
        zIndex: 3000,
    },
};

class Navigation extends Component {

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
              <AppBar position="static" color="default">
                <Toolbar>
                  <Typography variant="title" color="inherit">
                    TIHLDE
                  </Typography>
                </Toolbar>
              </AppBar>
            </div>
          );
    }
}

Navigation.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(Navigation);
