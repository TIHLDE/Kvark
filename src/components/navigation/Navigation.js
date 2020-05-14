import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Link from 'react-router-dom/Link';
import { withRouter } from 'react-router-dom';
import URLS from '../../URLS';
import classNames from 'classnames';
import { connect } from 'react-redux';

// API and store imports
import MiscService from '../../api/services/MiscService';
import AuthService from '../../api/services/AuthService';
import * as MiscActions from '../../store/actions/MiscActions';
import UserService from '../../api/services/UserService';
import COOKIE from '../../api/cookie';
import { WARNINGS_READ } from '../../settings';

// Material UI Components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';

import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';

import Skeleton from '@material-ui/lab/Skeleton';

import Tooltip from '@material-ui/core/Tooltip';

// Assets/Icons
import TIHLDELOGO from '../../assets/img/TIHLDE_LOGO.png';
import MenuIcon from '@material-ui/icons/Menu';
import SopraSteria from '../../assets/img/sopraSteriaLogo.svg';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

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
    menuWrapper: {
        display: 'flex',
        alignItems: 'center',
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
        '@media only screen and (max-width: 600px)': {
            top: 56,
        },
    },
    snackWarning: {
        backgroundColor: 'rgba(211,47,47,1)',
    },
    snackMessage: {
        backgroundColor: 'var(--tihlde-blaa)',
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
    },
    sponsorWrapper: {
        verticalAlign: 'top',
        display: 'inline-block',
        textAlign: 'center',
        margin: 'auto 10px',

        '@media only screen and (max-width: 600px)': {
            margin: 'auto 0px auto 10px',
        },
    },
    sponsorLogo: {
        '@media only screen and (max-width: 600px)': {
            width: '5rem',
            height: 'auto',
        }
    },
    sponsorText: {
        color: 'white',
        fontSize: '10px',
        textAlign: 'center',
        opacity: 0.7,

        '@media only screen and (max-width: 600px)': {
            fontSize: '8px',
        },
        '@media only screen and (max-width: 350px)': {
            fontSize: '7px',
        },
    },
    profileLink: {
        '& button': {
            padding: '0',
        },
        textDecoration: 'none',
    },
    profileContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    profileContainerHidden: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderRadius: '4px',
        cursor: 'pointer',
        opacity: '0',
    },
    profileName: {
        margin: 'auto 10px',
        fontSize: '16px',
        color: 'white',
        minWidth: '40px',
        textAlign: 'right',
        '@media only screen and (max-width: 450px)': {
            display: 'none',
        }
    },
    profileCircle: {
        borderRadius: '50%',
        backgroundImage: 'linear-gradient(90deg, #DA4453, #89216B)',
        fontSize: '18px',
        padding: '7px',
        color: 'white',
        height: '45px',
        width: '45px',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    profileCircleImage: {
        backgroundImage: 'url(https://thenypost.files.wordpress.com/2019/09/takes-donald-trump.jpg?quality=90&strip=all&w=618&h=410&crop=1)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#00000000',
        userSelect: 'none',
    },
    skeleton: {
        animation: 'animate 1.5s ease-in-out infinite',
    },
    skeletonCircle: {
        margin: '5px',
        height: 'calc(100% - 10px)',
        width: 'calc(100% - 10px)',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
    },
    tooltip: {
        top: '-75px !important',
        zIndex: 10002,
    },
};


const URIbutton = withStyles(styles)((props) => {
    const { data, classes } = props;
    return (
        <div className={classNames(props.selected ? classes.selected : '', props.uri)}>
            <Link to={data.link} onClick={data.link === window.location.pathname ? () => window.location.refresh() : null} style={{ textDecoration: 'none' }}>
                <Button color="inherit" style={{
                    color: 'white',
                }}>
                    {data.text}
                </Button>
            </Link>
        </div>
    );
});

const SponsorLogo = withStyles(styles)((props) => {
    const { classes } = props;
    return (
        <a className={classes.sponsorWrapper} target="_blank" rel="noopener noreferrer" href="https://www.soprasteria.no/">
            <img className={classes.sponsorLogo} src={SopraSteria} alt='Sopra Steria Logo' height={'18rem'} />
            <div className={classes.sponsorText}>HOVEDSAMARBEIDSPARTNER</div>
        </a>
    );
});

const PersonIcon = withStyles(styles)((props) => {
    const { user, link, classes } = props;
    return (
        <Link to={link} className={classes.profileLink} onClick={link === window.location.pathname ? () => window.location.refresh() : null} >
            <Button>
                <div className={classes.profileContainer} >
                    <div className={classes.profileName}>{ user.first_name !== undefined ? user.first_name : <Skeleton className={classes.skeleton} variant="text" width={75} /> }</div>
                    <div className={classNames(classes.profileCircle)}>{ user.first_name !== undefined ? (user.first_name).substring(0,1) + '' + (user.last_name).substring(0,1) : <Skeleton className={classNames(classes.skeleton, classes.skeletonCircle)} variant="text" /> }</div>
                </div>
            </Button>
        </Link>
    );
})

class Navigation extends Component {

    constructor() {
        super();
        this.state = {
            showSidebar: false,

            showSnackbar: false,
            snackMessage: null,
            snackWarningId: null,
            snackType: 0,

            userData: {},
        };
    }

    loadUserData = () => {
        UserService.getUserData().then((user) => {
            if(user) {
                this.setState({userData: user});
            }
        });
    }

    componentDidMount() {
        this.configureWarningMessage();
        if (AuthService.isAuthenticated()) {
            this.loadUserData();
        }
    }

    configureWarningMessage = () => {
        if (this.props.snackHasDisplayed) {
            return;
        }

        MiscService.getWarning((isError, data) => {
            let warnings_read = COOKIE.get(WARNINGS_READ);
            if (warnings_read === undefined) warnings_read = [];
            if (isError === false && data && data.length > 0 && !warnings_read.includes(data[data.length - 1].id)) {
                this.setState({
                    snackMessage: data[data.length - 1].text,
                    showSnackbar: true,
                    snackWarningId: data[data.length - 1].id,
                    snackType: data[data.length - 1].type,
                });
            }
        });
    }

    closeSnackbar = () => {
        this.setState({ showSnackbar: false });
        this.props.setHasSnackDisplayed(true);
        let warnings_read = COOKIE.get(WARNINGS_READ);
        if (warnings_read === undefined) warnings_read = [];
        warnings_read.push(this.state.snackWarningId);
        COOKIE.set(WARNINGS_READ, warnings_read);
    }

    toggleSidebar = () => {
        this.setState({ showSidebar: !this.state.showSidebar });
    };

    goTo = (page) => {
        this.props.history.push(page);
    }

    logOut = () => {
        AuthService.logOut();
    }

    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <AppBar className={classes.root} position="fixed" color="primary">
                    <Toolbar className={classes.navContent} disableGutters>
                        <div className={classes.navWrapper}>
                            <div className={classes.logoWrapper}>
                                <Link className={classes.flex} to='/'>
                                    <img src={TIHLDELOGO} height='32em' alt='TIHLDE_LOGO' width='auto' />
                                </Link>
                            </div>

                            <div className={classes.grow}>
                                <Hidden smDown implementation='css'>
                                    <div className={classes.flex}>
                                        <URIbutton data={{ link: URLS.about, text: "Om TIHLDE" }} selected={this.props.match.url === URLS.about} />
                                        <URIbutton data={{ link: URLS.newStudent, text: "Ny student" }} selected={this.props.match.url === URLS.newStudent} />
                                        <URIbutton data={{ link: URLS.events, text: "Arrangementer" }} selected={this.props.match.url === URLS.events} />
                                        <URIbutton data={{ link: URLS.jobposts, text: "Karriere" }} selected={this.props.match.url === URLS.jobposts} />
                                        <URIbutton data={{ link: URLS.company, text: "For Bedrifter" }} selected={this.props.match.url === URLS.company} />
                                    </div>
                                </Hidden>
                            </div>

                            <div>
                                {!AuthService.isAuthenticated() &&
                                    <SponsorLogo />
                                }
                            </div>
                            <div>
                                {AuthService.isAuthenticated() ?
                                    <PersonIcon user={this.state.userData} link={URLS.profile} />
                                    :
                                    <Hidden smDown implementation='css'>
                                        <IconButton className={classes.menuButton} onClick={() => this.goTo(URLS.login)}><PersonOutlineIcon /></IconButton>
                                    </Hidden>
                                }
                            </div>

                            <Hidden mdUp implementation='css'>
                                <div className={classes.menuWrapper}>
                                    <Tooltip classes={{ popper: classes.tooltip }} title="Meny">
                                        <IconButton className={classes.menuButton} onClick={this.toggleSidebar}><MenuIcon /></IconButton>
                                    </Tooltip>
                                </div>
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
                                    <Sidebar onClose={this.toggleSidebar} />
                                </Drawer>
                            </Hidden>

                        </div>
                    </Toolbar>
                </AppBar>
                <Snack
                    className={classNames(classes.snack, classes.flex, this.state.snackType === 2 ? classes.snackMessage : classes.snackWarning)}
                    open={this.state.showSnackbar}
                    message={this.state.snackMessage}
                    onClose={this.closeSnackbar} />

                <main className={classNames(classes.main, (this.props.whitesmoke ? classes.whitesmoke : null))}>
                    {(this.props.isLoading) ? <LinearProgress /> : null}
                    <div className={classes.wrapper}>
                        {this.props.children}
                    </div>
                </main>
                {(!this.props.footer || this.props.isLoading) ? null :
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
    snackHasDisplayed: MiscActions.getHasSnackDisplayed(state),
});

const mapDispatchToProps = (dispatch) => ({
    setHasSnackDisplayed: (bool) => dispatch(MiscActions.setSnackDispalyed(bool)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(Navigation)));
