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
import TIHLDELOGO from '../assets/img/tihldeLogo.png';
import MenuIcon from '@material-ui/icons/Menu';
import Facebook from '../assets/icons/facebook.svg';
import Instagram from '../assets/icons/instagram.svg';
import Twitter from '../assets/icons/twitter.svg';

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
        maxWidth: 1200,
        margin: 'auto',

        alignItems: 'center',

        '@media only screen and (max-width: 600px)': {
            flexDirection: 'row-reverse',
        }
    },
    logoWrapper: {
        display: 'flex',


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
        backgroundColor: 'whitesmoke',
    },
    selected: {
        border: '1px solid red',
    }
};


const URIbutton = withStyles(styles)((props) => {
    const {data, classes} = props;
    return (
        <Link to={data.link} style={{ textDecoration: 'none' }} className={(props.selected ? classes.selected : '')}>
            <Button color="inherit" style={{
                color: 'white',
            }}>
                {data.text}
            </Button>
        </Link>
    );
});


const LogoLink = withStyles(styles)((props) => {
    const {classes, data} = props;
    return (
        <a className={classes.horSpacing} href={data.link} style={{flexGrid:1}}>
            <img src={data.image} width='30px' alt="Missing icon" />
        </a>
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
            console.log(data);
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

    render() {
        const {classes} = this.props;
        console.log(this.props.match);
        return (
            <Fragment>
                <AppBar className={classes.root} position="fixed" color="default">
                    <Toolbar className={classes.navContent} disableGutters>
                        <div className={classes.navWrapper}>
                            <div className={classes.logoWrapper}>
                                <Link to='/'>
                                    <img src={TIHLDELOGO} alt='logo' height='30em'/>
                                </Link>
                            </div>

                                <div className={classes.grow}>
                                    <Hidden smDown implementation='css'>
                                        <URIbutton data={{link: URLS.about, text: "Om TIHLDE"}} selected={this.props.match.url === URLS.about}/>
                                        <URIbutton data={{link: URLS.services, text: "Tjenester"}} selected={this.props.match.url === URLS.services}/>
                                        <URIbutton data={{link: URLS.events, text: "Arrangementer"}} selected={this.props.match.url === URLS.events}/>
                                        <URIbutton data={{link: URLS.newStudent, text: "Ny student"}} selected={this.props.match.url === URLS.newStudent}/>
                                        <URIbutton data={{link: URLS.company, text: "Bedrifter"}} selected={this.props.match.url === URLS.company}/>
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
                                    <LogoLink data={{link: "https://www.facebook.com/tihlde/", image: Facebook}}/>
                                    <LogoLink data={{link: "https://www.instagram.com/p/6Uh3rCBII7/", image: Instagram}}/>
                                    <LogoLink data={{link: "https://twitter.com/tihlde", image: Twitter}}/>
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
