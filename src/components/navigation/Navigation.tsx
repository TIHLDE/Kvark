import { ReactNode, ReactElement, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { WARNINGS_READ } from 'constant';

// Material UI Components
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import Skeleton from '@material-ui/lab/Skeleton';
import Avatar from '@material-ui/core/Avatar';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

// Assets/Icons
import MenuIcon from '@material-ui/icons/Menu';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import ExpandIcon from '@material-ui/icons/ExpandMoreRounded';

// Project Components
import Footer from 'components/navigation/Footer';
import Sidebar from 'components/navigation/Sidebar';
import Snack from 'components/navigation/Snack';
import Container from 'components/layout/Container';
import TihldeLogo from 'components/miscellaneous/TihldeLogo';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    boxSizing: 'border-box',
    backgroundColor: theme.palette.colors.gradient.main.top,
    color: theme.palette.text.primary,
    flexGrow: 1,
    zIndex: theme.zIndex.drawer + 1,
    transition: '0.4s',
  },
  fancyRoot: {
    backgroundColor: 'transparent',
  },
  main: {
    minHeight: '101vh',
    backgroundColor: theme.palette.background.default,
  },
  normalMain: {
    paddingTop: 64,
    [theme.breakpoints.down('sm')]: {
      paddingTop: 56,
    },
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
  logo: {
    height: 32,
    width: 'auto',
  },
  menuButton: {
    color: theme.palette.getContrastText(theme.palette.colors.gradient.main.top),
  },
  menuWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  sidebar: {
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
    backgroundColor: theme.palette.colors.tihlde,
  },
  selected: {
    borderBottom: '2px solid ' + theme.palette.getContrastText(theme.palette.colors.gradient.main.top),
  },
  loginBtn: {
    marginLeft: theme.spacing(7),
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
    color: theme.palette.common.white,
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
  menulist: {
    padding: theme.spacing(0.5, 0),
    background: theme.palette.background.smoke,
    borderRadius: theme.spacing(1),
    textTransform: 'uppercase',
    minWidth: 150,
  },
  menulistItem: {
    display: 'block',
    textAlign: 'center',
  },
  dropdownIcon: {
    transition: 'transform 0.5s',
  },
  expanded: {
    transform: 'rotate(180deg)',
  },
}));

export type TopBarItemProps = {
  to: string;
  name: string;
};

const TopBarItem = ({ to, name }: TopBarItemProps) => {
  const classes = useStyles();
  const selected = window.location.pathname === to;
  return (
    <div className={selected ? classes.selected : ''}>
      <Button color='inherit' component={Link} onClick={selected ? () => window.location.reload() : undefined} style={{ color: 'white' }} to={to}>
        {name}
      </Button>
    </div>
  );
};

export type DropdownMenuProps = {
  children: ReactNode;
  items: Array<{
    name: string;
    to: string;
  }>;
};

const DropdownMenu = ({ children, items }: DropdownMenuProps) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const icon = <ExpandIcon className={classNames(classes.dropdownIcon, isOpen && classes.expanded)} />;
  return (
    <div onMouseLeave={() => setIsOpen(false)}>
      <Button
        color='inherit'
        endIcon={icon}
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseEnter={() => setIsOpen(true)}
        ref={anchorRef}
        style={{ color: 'white' }}>
        {children}
      </Button>
      <Popper anchorEl={anchorRef.current} disablePortal open={isOpen} role={undefined} transition>
        {({ TransitionProps, placement }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}>
            <Paper>
              <MenuList className={classes.menulist}>
                {items.map((item, i) => (
                  <MenuItem className={classes.menulistItem} component={Link} key={i} to={item.to}>
                    {item.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

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
  children?: ReactNode;
  banner?: ReactElement;
  maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  noFooter?: boolean;
  fancyNavbar?: boolean;
};

function Navigation({ fancyNavbar, isLoading, noFooter, maxWidth, banner, children }: NavigationProps) {
  const classes = useStyles();
  const { isAuthenticated } = useAuth();
  const { getUserData } = useUser();
  const { getWarnings } = useMisc();
  const theme = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [warning, setWarning] = useState<Warning | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [scrollLength, setScrollLength] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let subscribed = true;
    getUserData().then((user) => {
      if (user && subscribed) {
        setUserData(user);
      }
    });
    return () => {
      subscribed = false;
    };
  }, [getUserData]);

  useEffect(() => {
    let subscribed = true;
    getWarnings().then((data: Array<Warning>) => {
      const warningsRead = getCookie(WARNINGS_READ);
      const readArray = (warningsRead === undefined ? [] : warningsRead) as number[];
      if (data?.length && !readArray.includes(data[data.length - 1].id) && subscribed) {
        setWarning(data[data.length - 1]);
      }
    });
    return () => {
      subscribed = false;
    };
  }, [getWarnings]);

  const handleScroll = () => setScrollLength(window.pageYOffset);

  const closeSnackbar = (warning: Warning) => {
    const warningsRead = getCookie(WARNINGS_READ);
    const readArray = (warningsRead === undefined ? [] : warningsRead) as number[];
    readArray.push(warning.id);
    setCookie(WARNINGS_READ, JSON.stringify(readArray));
    setWarning(null);
  };

  const toggleSidebar = () => setShowSidebar((prev) => !prev);

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
              <TihldeLogo className={classes.logo} darkColor='white' lightColor='white' size='large' />
            </Link>
          </div>
          <div className={classes.grow}>
            <Hidden mdDown>
              <DropdownMenu
                items={[
                  { name: 'Om TIHLDE', to: URLS.about },
                  { name: 'Ny student', to: URLS.newStudent },
                ]}>
                Om TIHLDE
              </DropdownMenu>
              <TopBarItem name='Arrangementer' to={URLS.events} />
              <TopBarItem name='Nyheter' to={URLS.news} />
              <TopBarItem name='Karriere' to={URLS.jobposts} />
              {isAuthenticated() ? (
                <DropdownMenu items={[{ name: 'Kokebok', to: URLS.cheatsheet }]}>For Medlemmer</DropdownMenu>
              ) : (
                <TopBarItem name='For Bedrifter' to={URLS.company} />
              )}
            </Hidden>
          </div>
          <div>
            {isAuthenticated() && userData ? (
              <PersonIcon link={URLS.profile} user={userData} />
            ) : (
              <Hidden mdDown>
                <IconButton className={classNames(classes.menuButton, classes.loginBtn)} component={Link} to={URLS.login}>
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
          <Drawer anchor='top' classes={{ paper: classes.sidebar }} onClose={toggleSidebar} open={showSidebar} style={{ zIndex: theme.zIndex.drawer - 1 }}>
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
      <main className={classNames(classes.main, !fancyNavbar && classes.normalMain)}>
        {isLoading ? (
          <LinearProgress />
        ) : banner || maxWidth ? (
          <>
            {banner}
            {maxWidth === false ? <>{children}</> : <Container maxWidth={maxWidth || 'xl'}>{children || <></>}</Container>}
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
