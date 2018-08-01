import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Link from 'react-router-dom/Link';

// Material UI Components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';

import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';

// Assets/Icons
import TIHLDELOGO from '../assets/img/tihldeLogo.png';
import MenuIcon from '@material-ui/icons/Menu';

// Project Components
import Footer from './Footer';
import Sidebar from './Sidebar';

const sidebarWidth = 300;

const styles = {
    root: {
        boxSizing: 'border-box',
        backgroundColor: 'var(--tihlde-blaa)',
        color: 'white',
        flexGrow: 1,
    },
    main: {
        marginTop: 64,
        backgroundColor: 'white',

        '@media only screen and (max-width: 600px)': {
            marginTop: 56,
        },
    },
    navContent: {
        width: '100%',
    },
    navWrapper: {
        width: '100%',
        padding: '0 10px',
        display: 'flex',
        maxWidth: 1400,
        margin: 'auto',
  
        alignItems: 'center',
    },
    menuButton: {
        color: 'white',
    },
    sidebar: {
        zIndex: 100,
        minWidth: 200,
        width: '90vw',
        maxWidth: 300,
        overflow: 'hidden',
    },
};

class Navigation extends Component {

    constructor() {
        super();
        this.state = {
            showSidebar: false,
        };
    }

    toggleSidebar = () => {
        this.setState({showSidebar: !this.state.showSidebar});
    }

    render() {
        const {classes} = this.props;

        return (
            <Fragment>
                <AppBar className={classes.root} position="fixed" color="default">
                    <Toolbar className={classes.navContent} disableGutters>
                        <div className={classes.navWrapper}>
                            <div style={{flexGrow: 1}}>
                                <Link to='/'>
                                <img src={TIHLDELOGO} alt='logo' height='30em'/>
                                </Link>
                            </div>
                            <Hidden xsDown implementation='css'>
                                <div>
                                    <Link to='/undergrupper/' style={{ textDecoration: 'none' }}>
                                        <Button color="inherit" style={{
                                            color: 'white',
                                        }}>Undergrupper</Button>
                                    </Link>
                                    <Link to='/bedrifter/' style={{ textDecoration: 'none' }}>
                                        <Button color="primary" style={{
                                            color: 'var(--tihlde-blaa)',
                                            backgroundColor: 'white',
                                            textDecoration: 'none',
                                        }}>Bedrifter</Button>
                                    </Link>
                                </div>
                            </Hidden>
                            <Hidden smUp implementation='css'>
                                <IconButton className={classes.menuButton} onClick={this.toggleSidebar}><MenuIcon/></IconButton>
                            </Hidden>

                            <Hidden xsDown implementation='css'>
                                <Drawer
                                    open={this.state.showSidebar}
                                    onClose={this.toggleSidebar}
                                    classes={{
                                        paper: classes.sidebar,
                                    }}
                                >
                                    <Sidebar/>
                                </Drawer>
                            </Hidden>
                        </div>
                    </Toolbar>
                </AppBar>
               
                <main className={classes.main}>
                    {(this.props.isLoading)? <LinearProgress /> : null}
                    <div className={classes.wrapper}>
                        {this.props.children}
                    </div>
                </main>
                {(!this.props.footer || this.props.isLoading)? null :
                    <Footer />
                }
            </Fragment>
          );
    }
}

Navigation.propTypes = {
    classes: PropTypes.object,
    children: PropTypes.node,
    isLoading: PropTypes.bool,
    footer: PropTypes.bool,
};

export default withStyles(styles)(Navigation);
