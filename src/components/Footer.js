import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

// Material UI Components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from 'react-router-dom/Link';

// Assets
import TIHLDELOGO from '../assets/img/tihldeLogo.png';

const styles = {
    root: {
        backgroundColor: 'var(--tihlde-blaa)',
        color: 'white',
        padding: '100px'
    },
};

class Footer extends Component {

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Typography variant='headline' color='inherit'>From Nettkom with 💖</Typography>
            </div>
        );
    }
}


export default withStyles(styles)(Footer);
