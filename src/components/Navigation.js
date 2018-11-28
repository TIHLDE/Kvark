import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Link from 'react-router-dom/Link';
import {withRouter} from 'react-router-dom';
import URLS from '../URLS';
import classNames from 'classnames';
import {connect} from 'react-redux';

// API and store imports
import API from '../api/api';
import AuthService from '../api/services/AuthService';
import * as GridActions from '../store/actions/GridActions';

// Material UI Components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';

import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';

// Assets/Icons
import TIHLDELOGO from '../assets/img/TIHLDE_LOGO.png';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';

// Project Components
import Footer from './Footer';
import Sidebar from './Sidebar';
import Snack from './Snack';

const styles = {
    root: {
        boxSizing: 'border-box',
        backgroundColor: 'var(--tihlde-blaa)',
        color: 'white',
        flexGrow: 1,
        zIndex: 10001,
    },
    main: {
        marginTop: 64,
        minHeight: '101vh',
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
        maxWidth: 1200,
        margin: 'auto',

        alignItems: 'center',

        '@media only screen and (max-width: 600px)': {
            flexDirection: 'row-reverse',
        }
    },
    logoWrapper: {
        display: 'flex',
        minWidth: 150,

        '@media only screen and (max-width: 600px)': {
            flexDirection: 'row-reverse',
        }
    },
    menuButton: {
        color: 'white',
    },
    sidebar: {
        zIndex: 100,
        minWidth: 200,
        width: '100vw',
        overflow: 'hidden',
    },
    grow: {
        display: 'flex',
        justifyContent: 'center',
        flexGrow: 1,
    },
    horSpacing: {
        margin: '0 10px'
    },
    snack: {
        position: 'absolute',
        top: 62,
        maxWidth: 'none',
        minHeight: 48,
        width: '100vw',
        height: 'auto',
        padding: 0,

        backgroundColor: 'rgba(211,47,47,1)',
        '@media only screen and (max-width: 600px)': {
            top: 56,
        },
    },
    flex: {
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
    },

    whitesmoke: {
        backgroundColor: 'var(--gray)',
    },
    selected: {
        borderBottom: '2px solid white',
    },
    uri: {
        display: 'inline',
    },
    loginBtn: {
        color: 'white',
        border: '2px solid white',
    },
    profileBtn: {
        color: 'white',
        border: '2px solid white',
        padding: 6,
    }
};


const URIbutton = withStyles(styles)((props) => {
    const {data, classes} = props;
    return (
        <div className={classNames(props.selected ? classes.selected : '', props.uri)}>
            <Link to={data.link} style={{ textDecoration: 'none' }}>
                <Button color="inherit" style={{
                    color: 'white',
                }}>
                    {data.text}
                </Button>
            </Link>
        </div>
    );
});

class Navigation extends Component {

    constructor() {
        super();
        this.state = {
            showSidebar: false,

            showSnackbar: false,
            snackMessage: null,
        };
    }

    componentDidMount() {
        this.configureWarningMessage();
    }

    configureWarningMessage = () => {
        if(this.props.snackHasDisplayed) {
            return;
        }

        const response = API.getWarning().response();
        response.then((data) => {
            if(response.isError === false) {
                if(data && data.length > 0) {
                    this.setState({
                        snackMessage: data[data.length-1].text,
                        showSnackbar: true,
                    });
                }
            }
        });
    }

    closeSnackbar = () => {
        this.setState({showSnackbar: false});
        this.props.setHasSnackDisplayed(true);
    }

    toggleSidebar = () => {
        this.setState({showSidebar: !this.state.showSidebar});
    };

    goTo = (page) => {
        this.props.history.push(page);
    }

    logOut = () => {
        AuthService.logOut();
    }

    render() {
        const {classes} = this.props;
        return (
            <Fragment>
                <AppBar className={classes.root} position="fixed" color="default">
                    <Toolbar className={classes.navContent} disableGutters>
                        <div className={classes.navWrapper}>
                            <div className={classes.logoWrapper}>
                                <Link to='/'>
                                    <img src={TIHLDELOGO} height='32em' alt='TIHLDE_LOGO' width='auto' />
                                </Link>
                            </div>

                                <div className={classes.grow}>
                                    <Hidden smDown implementation='css'>
                                        <div className={classes.flex}>
                                            <URIbutton data={{link: URLS.about, text: "Om TIHLDE"}} selected={this.props.match.url === URLS.about}/>
                                            <URIbutton data={{link: URLS.services, text: "Tjenester"}} selected={this.props.match.url === URLS.services}/>
                                            <URIbutton data={{link: URLS.events, text: "Arrangementer"}} selected={this.props.match.url === URLS.events}/>
                                            <URIbutton data={{link: URLS.newStudent, text: "Ny student"}} selected={this.props.match.url === URLS.newStudent}/>
                                            <URIbutton data={{link: URLS.jobposts, text: "Annonser"}} selected={this.props.match.url === URLS.jobposts}/>
                                            <URIbutton data={{link: URLS.company, text: "Bedrifter"}} selected={this.props.match.url === URLS.company}/>
                                        </div>
                                    </Hidden>
                                </div>

                            <Hidden mdUp implementation='css'>
                                <IconButton className={classes.menuButton} onClick={this.toggleSidebar}><MenuIcon/></IconButton>
                            </Hidden>

                            <Hidden xsDown implementation='css'>
                                <Drawer
                                    anchor='top'
                                    open={this.state.showSidebar}
                                    onClose={this.toggleSidebar}
                                    classes={{
                                        paper: classes.sidebar,
                                    }}
                                >
                                    <Sidebar onClose={this.toggleSidebar}/>
                                </Drawer>
                            </Hidden>
                            <div>
                                <Hidden xsDown implementation={'css'}>
                                    <div>
                                        {AuthService.isAuthenticated()?
                                            <IconButton className={classes.profileBtn} onClick={() => this.goTo(URLS.profile)}><PersonIcon/></IconButton>
                                            :
                                            <Button className={classes.loginBtn} onClick={() => this.goTo(URLS.login)} variant='outlined'>Logg inn</Button>
                                        }
                                    </div>
                                </Hidden>
                            </div>
                        </div>
                    </Toolbar>
                </AppBar>
                <Snack
                    className={classNames(classes.snack, classes.flex)}
                    open={this.state.showSnackbar}
                    message={this.state.snackMessage}
                    onClose={this.closeSnackbar}/>

                <main className={classNames(classes.main, (this.props.whitesmoke ? classes.whitesmoke : null))}>
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
    whitesmoke: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    snackHasDisplayed: GridActions.getHasSnackDisplayed(state),
});

const mapDispatchToProps = (dispatch) => ({
    setHasSnackDisplayed: (bool) => dispatch(GridActions.setSnackDispalyed(bool)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(Navigation)));
