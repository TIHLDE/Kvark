import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import URLS from 'URLS';
import classNames from 'classnames';
import Helmet from 'react-helmet';
import { Warning, User } from 'types/Types';
import { WarningType } from 'types/Enums';

// API and store imports
import { useMisc } from 'api/hooks/Misc';
import { useAuth } from 'api/hooks/Auth';
import { useUser } from 'api/hooks/User';
import { getCookie, setCookie } from 'api/cookie';
import { WARNINGS_READ } from 'settings';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import Skeleton from '@material-ui/lab/Skeleton';
import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';

// Assets/Icons
import TIHLDELOGO from 'assets/img/TIHLDE_LOGO.png';
import MenuIcon from '@material-ui/icons/Menu';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

// Project Components
import Footer from 'components/navigation/Footer';
import Sidebar from 'components/navigation/Sidebar';
import Snack from 'components/navigation/Snack';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    boxSizing: 'border-box',
    backgroundColor: theme.palette.colors.gradient.main.top,
    color: theme.palette.colors.text.main,
    flexGrow: 1,
    zIndex: 10001,
    transition: '0.4s',
  },
  fancyRoot: {
    backgroundColor: 'transparent',
  },
  main: {
    minHeight: '101vh',
    paddingBottom: theme.spacing(2),
  },
  normalMain: {
    paddingTop: 64,
    [theme.breakpoints.down('sm')]: {
      paddingTop: 56,
    },
  },
  navContent: {
    width: '100%',
  },
  navWrapper: {
    width: '100%',
    padding: theme.spacing(0, 1),
    display: 'flex',
    maxWidth: 1200,
    margin: 'auto',
    alignItems: 'center',
  },
  logoWrapper: {
    display: 'flex',
    minWidth: 150,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row-reverse',
    },
  },
  menuButton: {
    color: theme.palette.colors.header.text,
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
    [theme.breakpoints.down('xs')]: {
      marginTop: 56,
    },
  },
  grow: {
    display: 'flex',
    justifyContent: 'center',
    flexGrow: 1,
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  snack: {
    position: 'absolute',
    top: 62,
    maxWidth: 'none',
    minHeight: 48,
    width: '100vw',
    height: 'auto',
    padding: 0,
    [theme.breakpoints.down('sm')]: {
      top: 56,
    },
  },
  snackWarning: {
    backgroundColor: theme.palette.error.main,
  },
  snackMessage: {
    backgroundColor: theme.palette.colors.tihlde.main,
  },
  whitesmoke: {
    backgroundColor: theme.palette.colors.background.main,
  },
  light: {
    backgroundColor: theme.palette.colors.background.light,
  },
  selected: {
    borderBottom: '2px solid ' + theme.palette.colors.header.text,
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    cursor: 'pointer',
  },
  profileName: {
    margin: 'auto 10px',
    fontSize: '16px',
    color: theme.palette.colors.constant.white,
    minWidth: '40px',
    textAlign: 'right',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  avatar: {
    width: 45,
    height: 45,
    fontSize: 18,
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, ' + theme.palette.colors.gradient.avatar.top + ', ' + theme.palette.colors.gradient.avatar.bottom + ')',
    color: theme.palette.colors.gradient.avatar.text,
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
}));

export type URIbuttonProps = {
  data: {
    link: string;
    text: string;
  };
  selected: boolean;
};

const URIbutton = ({ data, selected }: URIbuttonProps) => {
  const classes = useStyles();
  return (
    <div className={classNames(selected ? classes.selected : '')}>
      <Button
        color='inherit'
        component={Link}
        onClick={data.link === window.location.pathname ? () => window.location.reload() : undefined}
        style={{ color: 'white' }}
        to={data.link}>
        {data.text}
      </Button>
    </div>
  );
};

// TODO: replace with User-object from DB
export type PersonIconProps = {
  user: User;
  link: string;
};

const PersonIcon = ({ user, link }: PersonIconProps) => {
  const classes = useStyles();
  return (
    <Button
      className={classes.profileContainer}
      component={Link}
      onClick={link === window.location.pathname ? () => window.location.reload() : undefined}
      to={link}>
      <div className={classes.profileName}>
        {user.first_name !== undefined ? user.first_name : <Skeleton className={classes.skeleton} variant='text' width={75} />}
      </div>
      <Avatar className={classes.avatar}>
        {user.first_name !== undefined ? (
          String(user.first_name.substring(0, 1)) + user.last_name.substring(0, 1)
        ) : (
          <Skeleton className={classNames(classes.skeleton, classes.skeletonCircle)} variant='text' />
        )}
      </Avatar>
    </Button>
  );
};

export type NavigationProps = {
  children?: React.ReactNode;
  banner?: React.ReactElement;
  noMaxWidth?: boolean;
  isLoading?: boolean;
  noFooter?: boolean;
  whitesmoke?: boolean;
  fancyNavbar?: boolean;
};

function Navigation({ fancyNavbar, whitesmoke, isLoading, noFooter, noMaxWidth, banner, children }: NavigationProps) {
  const classes = useStyles();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { getUserData } = useUser();
  const { getWarnings } = useMisc();
  const [showSidebar, setShowSidebar] = useState(false);
  const [warning, setWarning] = useState<Warning | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [scrollLength, setScrollLength] = useState(0);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    getUserData()
      .then((user) => {
        if (user) {
          setUserData(user);
        }
      })
      .catch(() => {});
  }, [getUserData]);

  useEffect(() => {
    getWarnings()
      .then((data: Array<Warning>) => {
        const warningsRead = getCookie(WARNINGS_READ);
        const readArray = (warningsRead === undefined ? [] : warningsRead) as number[];
        if (data?.length && !readArray.includes(data[data.length - 1].id)) {
          setWarning(data[data.length - 1]);
        }
      })
      .catch(() => {});
  }, [getWarnings]);

  const handleScroll = () => {
    setScrollLength(window.pageYOffset);
  };

  const closeSnackbar = (warning: Warning) => {
    const warningsRead = getCookie(WARNINGS_READ);
    const readArray = (warningsRead === undefined ? [] : warningsRead) as number[];
    readArray.push(warning.id);
    setCookie(WARNINGS_READ, JSON.stringify(readArray));
    setWarning(null);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      <Helmet>
        <title>TIHLDE</title>
      </Helmet>
      <AppBar
        className={classNames(classes.root, fancyNavbar && scrollLength < 20 && !showSidebar && classes.fancyRoot)}
        color='primary'
        elevation={fancyNavbar && scrollLength < 20 ? 0 : 1}
        position='fixed'>
        <Toolbar className={classes.navWrapper} disableGutters>
          <div className={classes.logoWrapper}>
            <Link className={classes.grow} to='/'>
              <img alt='TIHLDE_LOGO' height='32em' src={TIHLDELOGO} width='auto' />
            </Link>
          </div>

          <div className={classes.grow}>
            <Hidden mdDown>
              <URIbutton data={{ link: URLS.about, text: 'Om TIHLDE' }} selected={location.pathname === URLS.about} />
              {/* isAuthenticated() && <URIbutton data={{ link: URLS.cheatsheet, text: "Kokebok" }} selected={location.pathname === URLS.cheatsheet} />*/}
              <URIbutton data={{ link: URLS.events, text: 'Arrangementer' }} selected={location.pathname === URLS.events} />
              <URIbutton data={{ link: URLS.news, text: 'Nyheter' }} selected={location.pathname === URLS.news} />
              <URIbutton data={{ link: URLS.jobposts, text: 'Karriere' }} selected={location.pathname === URLS.jobposts} />
              <URIbutton data={{ link: URLS.company, text: 'For Bedrifter' }} selected={location.pathname === URLS.company} />
            </Hidden>
          </div>
          <div>
            {isAuthenticated() && userData ? (
              <PersonIcon link={URLS.profile} user={userData} />
            ) : (
              <Hidden mdDown>
                <IconButton className={classes.menuButton} component={Link} to={URLS.login}>
                  <PersonOutlineIcon />
                </IconButton>
              </Hidden>
            )}
          </div>
          <Hidden lgUp>
            <div className={classes.menuWrapper}>
              <IconButton className={classes.menuButton} onClick={toggleSidebar}>
                <MenuIcon />
              </IconButton>
            </div>
          </Hidden>
          <Drawer anchor='top' classes={{ paper: classes.sidebar }} onClose={toggleSidebar} open={showSidebar}>
            <Sidebar />
          </Drawer>
        </Toolbar>
      </AppBar>
      {warning && (
        <Snack
          className={classNames(classes.snack, classes.grow, warning.type === WarningType.MESSAGE ? classes.snackMessage : classes.snackWarning)}
          message={warning.text}
          onClose={() => closeSnackbar(warning)}
          open={Boolean(warning)}
        />
      )}
      <main className={classNames(classes.main, !fancyNavbar && classes.normalMain, whitesmoke ? classes.whitesmoke : classes.light)}>
        {isLoading ? (
          <LinearProgress />
        ) : banner ? (
          <>
            {banner}
            <Container maxWidth={noMaxWidth ? false : 'xl'}>{children}</Container>
          </>
        ) : (
          children
        )}
      </main>
      {!noFooter && !isLoading && <Footer />}
    </>
  );
}

export default Navigation;
