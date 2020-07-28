import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Link, withRouter} from 'react-router-dom';
import URLS from '../../URLS';
import classNames from 'classnames';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';

// API and store imports
import MiscService from '../../api/services/MiscService';
import AuthService from '../../api/services/AuthService';
import * as MiscActions from '../../store/actions/MiscActions';
import UserService from '../../api/services/UserService';
import COOKIE from '../../api/cookie';
import {WARNINGS_READ} from '../../settings';

// Material UI Components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import Skeleton from '@material-ui/lab/Skeleton';
import Avatar from '@material-ui/core/Avatar';

// Assets/Icons
import TIHLDELOGO from '../../assets/img/TIHLDE_LOGO.png';
import MenuIcon from '@material-ui/icons/Menu';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

// Project Components
import Footer from './Footer';
import Sidebar from './Sidebar';
import Snack from './Snack';

const styles = (theme) => ({
  root: {
    boxSizing: 'border-box',
    backgroundColor: theme.colors.gradient.main.top,
    color: theme.colors.text.m,
    flexGrow: 1,
    zIndex: 10001,
    transition: '0.4s',
  },
  rootLanding: {
    backgroundColor: 'transparent',
  },
  main: {
    paddingTop: 64,
    minHeight: '101vh',
    '@media only screen and (max-width: 600px)': {
      paddingTop: 56,
    },
  },
  mainLanding: {
    minHeight: '101vh',
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
    },
  },
  menuButton: {
    color: theme.colors.header.text,
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
    marginTop: 64,

    '@media only screen and (max-width: 600px)': {
      marginTop: 56,
    },
  },
  grow: {
    display: 'flex',
    justifyContent: 'center',
    flexGrow: 1,
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
    backgroundColor: theme.palette.error.main,
  },
  snackMessage: {
    backgroundColor: theme.colors.tihlde.main,
  },
  flex: {
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whitesmoke: {
    backgroundColor: theme.colors.background.main,
  },
  light: {
    backgroundColor: theme.colors.background.light,
  },
  selected: {
    borderBottom: '2px solid ' + theme.colors.header.text,
  },

  profileContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: theme.sizes.border.radius,
    cursor: 'pointer',
  },
  profileName: {
    margin: 'auto 10px',
    fontSize: '16px',
    color: theme.colors.constant.white,
    minWidth: '40px',
    textAlign: 'right',
    '@media only screen and (max-width: 450px)': {
      display: 'none',
    },
  },
  avatar: {
    width: 45,
    height: 45,
    fontSize: 18,
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, ' + theme.colors.gradient.avatar.top + ', ' + theme.colors.gradient.avatar.bottom + ')',
    color: theme.colors.gradient.avatar.text,
  },
  skeleton: {
    animation: 'animate 1.5s ease-in-out infinite',
  },
  skeletonCircle: {
    margin: 'auto',
    height: '75%',
    width: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
});

const URIbutton = withStyles(styles)((props) => {
  const {data, classes} = props;
  return (
    <div className={classNames(props.selected ? classes.selected : '', props.uri)}>
      <Button component={Link} to={data.link} color="inherit" style={{color: 'white'}} onClick={data.link === window.location.pathname ? () => window.location.reload() : null}>
        {data.text}
      </Button>
    </div>
  );
});

const PersonIcon = withStyles(styles)((props) => {
  const {user, link, classes} = props;
  return (
    <Button component={Link} to={link} onClick={link === window.location.pathname ? () => window.location.reload() : null}>
      <div className={classes.profileContainer}>
        <div className={classes.profileName}>{user.first_name !== undefined ? user.first_name : <Skeleton className={classes.skeleton} variant="text" width={75} />}</div>
        <Avatar className={classes.avatar}>{user.first_name !== undefined ? String((user.first_name).substring(0, 1)) + (user.last_name).substring(0, 1) : <Skeleton className={classNames(classes.skeleton, classes.skeletonCircle)} variant="text" />}</Avatar>
      </div>
    </Button>
  );
});

function Navigation(props) {
  const {classes, fancyNavbar, whitesmoke, isLoading, footer, children, snackHasDisplayed, setHasSnackDisplayed, match} = props;
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState(null);
  const [snackWarningId, setSnackWarningId] = useState(null);
  const [userData, setUserData] = useState(0);
  const [snackType, setSnackType] = useState({});
  const [scrollLength, setScrollLength] = useState(0);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, {passive: true});
    if (AuthService.isAuthenticated()) {
      UserService.getUserData().then((user) => {
        if (user) {
          setUserData(user);
        }
      });
    }
    if (snackHasDisplayed) return;
    MiscService.getWarning((isError, data) => {
      let warningsRead = COOKIE.get(WARNINGS_READ);
      if (warningsRead === undefined) warningsRead = [];
      if (isError === false && data && data.length > 0 && !warningsRead.includes(data[data.length - 1].id)) {
        setSnackMessage(data[data.length - 1].text);
        setShowSnackbar(true);
        setSnackWarningId(data[data.length - 1].id);
        setSnackType(data[data.length - 1].type);
      }
    });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [snackHasDisplayed]);

  const handleScroll = () => {
    setScrollLength(window.pageYOffset);
  };

  const closeSnackbar = () => {
    setShowSidebar(false);
    setHasSnackDisplayed(true);
    let warningsRead = COOKIE.get(WARNINGS_READ);
    if (warningsRead === undefined) warningsRead = [];
    warningsRead.push(snackWarningId);
    COOKIE.set(WARNINGS_READ, warningsRead);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      <Helmet>
        <title>TIHLDE</title>
      </Helmet>
      <AppBar elevation={(fancyNavbar && scrollLength < 20 ? 0 : 1)} className={classNames(classes.root, (fancyNavbar && scrollLength < 20 && classes.rootLanding))} position="fixed" color="primary">
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
                  <URIbutton data={{link: URLS.about, text: 'Om TIHLDE'}} selected={match.url === URLS.about} />
                  <URIbutton data={{link: URLS.newStudent, text: 'Ny student'}} selected={match.url === URLS.newStudent} />
                  {/* AuthService.isAuthenticated() && <URIbutton data={{ link: URLS.cheatsheet, text: "Kokebok" }} selected={match.url === URLS.cheatsheet} />*/}
                  <URIbutton data={{link: URLS.events, text: 'Arrangementer'}} selected={match.url === URLS.events} />
                  <URIbutton data={{link: URLS.news, text: 'Nyheter'}} selected={match.url === URLS.news} />
                  <URIbutton data={{link: URLS.company, text: 'For Bedrifter'}} selected={match.url === URLS.company} />
                </div>
              </Hidden>
            </div>
            <div>
              {AuthService.isAuthenticated() ?
                <PersonIcon user={userData} link={URLS.profile} /> :
                <Hidden smDown implementation='css'>
                  <IconButton className={classes.menuButton} component={Link} to={URLS.login}><PersonOutlineIcon /></IconButton>
                </Hidden>
              }
            </div>
            <Hidden mdUp implementation='css'>
              <div className={classes.menuWrapper}>
                <IconButton className={classes.menuButton} onClick={toggleSidebar}><MenuIcon /></IconButton>
              </div>
            </Hidden>
            <Hidden xsDown implementation='css'>
              <Drawer
                anchor='top'
                open={showSidebar}
                onClose={toggleSidebar}
                classes={{paper: classes.sidebar}}>
                <Sidebar onClose={toggleSidebar} />
              </Drawer>
            </Hidden>
          </div>
        </Toolbar>
      </AppBar>
      <Snack
        className={classNames(classes.snack, classes.flex, snackType === 2 ? classes.snackMessage : classes.snackWarning)}
        open={showSnackbar}
        message={snackMessage}
        onClose={closeSnackbar} />
      <main className={classNames((fancyNavbar ? classes.mainLanding : classes.main), (whitesmoke ? classes.whitesmoke : classes.light))}>
        {(isLoading) ? <LinearProgress /> : null}
        <div className={classes.wrapper}>
          {children}
        </div>
      </main>
      {footer && !isLoading &&
        <Footer />
      }
    </>
  );
}

Navigation.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  footer: PropTypes.bool,
  whitesmoke: PropTypes.bool,
  fancyNavbar: PropTypes.bool,
  match: PropTypes.object,
  snackHasDisplayed: PropTypes.bool,
  setHasSnackDisplayed: PropTypes.func,
};

const mapStateToProps = (state) => ({
  snackHasDisplayed: MiscActions.getHasSnackDisplayed(state),
});

const mapDispatchToProps = (dispatch) => ({
  setHasSnackDisplayed: (bool) => dispatch(MiscActions.setSnackDispalyed(bool)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(Navigation)));
