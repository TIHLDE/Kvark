import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// Assets
import TIHLDELOGO from '../assets/img/tihldeLogo.png';

const styles = {
    root: {
        boxSizing: 'border-box',
        backgroundColor: 'var(--tihlde-blaa)',
    },
    main: {
        marginTop: 64,
        backgroundColor: 'white',

        '@media only screen and (max-width: 600px)': {
            marginTop: 56,
        }
    },
};

class Navigation extends Component {

    render() {
        const {classes} = this.props;

        return (
            <Fragment>
                <AppBar className={classes.root} position="fixed" color="default">
                    <Toolbar>
                        <img src={TIHLDELOGO} alt='logo' height='30em'/>
                    </Toolbar>
                </AppBar>
                <main className={classes.main}>
                    {this.props.children}
                </main>
            </Fragment>
          );
    }
}

Navigation.propTypes = {
    classes: PropTypes.object,
    children: PropTypes.node,
};

export default withStyles(styles)(Navigation);
