import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Link, withRouter} from 'react-router-dom';
import URLS from '../../URLS';
import classNames from 'classnames';
import {connect} from 'react-redux';

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
import SopraSteria from '../../assets/img/sopraSteriaLogo.svg';
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
  uri: {
    display: 'inline',
  },
  sponsorWrapper: {
    verticalAlign: 'top',
    display: 'inline-block',
    textAlign: 'center',
    margin: 'auto 10px',
    textDecoration: 'none',
    '@media only screen and (max-width: 600px)': {
      margin: 'auto 0px auto 10px',
    },
  },
  sponsorLogo: {
    '@media only screen and (max-width: 600px)': {
      width: '5rem',
      height: 'auto',
    },
  },
  sponsorText: {
    color: theme.colors.header.text,
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
      <Link to={data.link} onClick={data.link === window.location.pathname ? () => window.location.reload() : null} style={{textDecoration: 'none'}}>
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
  const {classes} = props;
  return (
    <a className={classes.sponsorWrapper} target="_blank" rel="noopener noreferrer" href="https://www.soprasteria.no/">
      <img className={classes.sponsorLogo} src={SopraSteria} alt='Sopra Steria Logo' height={'18rem'} />
      <div className={classes.sponsorText}>HOVEDSAMARBEIDSPARTNER</div>
    </a>
  );
});

const PersonIcon = withStyles(styles)((props) => {
  const {user, link, classes} = props;
  return (
    <Link to={link} className={classes.profileLink} onClick={link === window.location.pathname ? () => window.location.reload() : null}>
      <Button>
        <div className={classes.profileContainer}>
          <div className={classes.profileName}>{ user.first_name !== undefined ? user.first_name : <Skeleton className={classes.skeleton} variant="text" width={75} /> }</div>
          <Avatar className={classes.avatar}>{ user.first_name !== undefined ? String((user.first_name).substring(0, 1)) + (user.last_name).substring(0, 1) : <Skeleton className={classNames(classes.skeleton, classes.skeletonCircle)} variant="text" /> }</Avatar>
        </div>
      </Button>
    </Link>
  );
});

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

      scrollLength: 0,
    };
  }

    loadUserData = () => {
      UserService.getUserData().then((user) => {
        if (user) {
          this.setState({userData: user});
        }
      });
    }

    componentDidMount() {
      window.addEventListener('scroll', this.handleScroll, {passive: true});
      this.handleScroll();
      this.configureWarningMessage();
      if (AuthService.isAuthenticated()) {
        this.loadUserData();
      }
    }

    componentWillUnmount() {
      window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
      const position = window.pageYOffset;
      this.setState({scrollLength: position});
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        const position = window.pageYOffset;
        this.setState({scrollLength: position});
    }

    configureWarningMessage = () => {
      if (this.props.snackHasDisplayed) {
        return;
      }

      MiscService.getWarning((isError, data) => {
        let warningsRead = COOKIE.get(WARNINGS_READ);
        if (warningsRead === undefined) warningsRead = [];
        if (isError === false && data && data.length > 0 && !warningsRead.includes(data[data.length - 1].id)) {
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
      this.setState({showSnackbar: false});
      this.props.setHasSnackDisplayed(true);
      let warningsRead = COOKIE.get(WARNINGS_READ);
      if (warningsRead === undefined) warningsRead = [];
      warningsRead.push(this.state.snackWarningId);
      COOKIE.set(WARNINGS_READ, warningsRead);
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
          <AppBar elevation={(this.props.fancyNavbar && this.state.scrollLength < 20 ? 0 : 1)} className={classNames(classes.root, (this.props.fancyNavbar && this.state.scrollLength < 20 && classes.rootLanding))} position="fixed" color="primary">
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
                      <URIbutton data={{link: URLS.about, text: 'Om TIHLDE'}} selected={this.props.match.url === URLS.about} />
                      <URIbutton data={{link: URLS.newStudent, text: 'Ny student'}} selected={this.props.match.url === URLS.newStudent} />
                      {/* AuthService.isAuthenticated() &&
                        <URIbutton data={{ link: URLS.cheatsheet, text: "Kokebok" }} selected={this.props.match.url === URLS.cheatsheet} />*/}
                      <URIbutton data={{link: URLS.events, text: 'Arrangementer'}} selected={this.props.match.url === URLS.events} />
                      <URIbutton data={{link: URLS.jobposts, text: 'Karriere'}} selected={this.props.match.url === URLS.jobposts} />
                      <URIbutton data={{link: URLS.company, text: 'For Bedrifter'}} selected={this.props.match.url === URLS.company} />
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
                    <PersonIcon user={this.state.userData} link={URLS.profile} /> :
                    <Hidden smDown implementation='css'>
                      <IconButton className={classes.menuButton} onClick={() => this.goTo(URLS.login)}><PersonOutlineIcon /></IconButton>
                    </Hidden>
                  }
                </div>

                <Hidden mdUp implementation='css'>
                  <div className={classes.menuWrapper}>
                    <IconButton className={classes.menuButton} onClick={this.toggleSidebar}><MenuIcon /></IconButton>
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

          <main className={classNames((this.props.fancyNavbar ? classes.mainLanding : classes.main), (this.props.whitesmoke ? classes.whitesmoke : classes.light))}>
            {(this.props.isLoading) ? <LinearProgress /> : null}
            <div className={classes.wrapper}>
              {this.props.children}
            </div>
          </main>
          {this.props.footer && !this.props.isLoading &&
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
  fancyNavbar: PropTypes.bool,
  history: PropTypes.object,
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
