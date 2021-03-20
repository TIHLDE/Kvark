import { useMemo, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import classNames from 'classnames';
import { useUser, useIsAuthenticated } from 'api/hooks/User';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

// Assets/Icons
import MenuIcon from '@material-ui/icons/MenuRounded';
import CloseIcon from '@material-ui/icons/CloseRounded';
import PersonOutlineIcon from '@material-ui/icons/PersonRounded';
import ExpandIcon from '@material-ui/icons/ExpandMoreRounded';

// Project Components
import Sidebar from 'components/navigation/Sidebar';
import TihldeLogo from 'components/miscellaneous/TihldeLogo';
import Avatar from 'components/miscellaneous/Avatar';

const useStyles = makeStyles<Theme, Pick<TopbarProps, 'whiteOnLight'>>((theme) => ({
  appBar: {
    boxSizing: 'border-box',
    backgroundColor: theme.palette.colors.gradient.main.top,
    color: theme.palette.text.primary,
    flexGrow: 1,
    zIndex: theme.zIndex.drawer + 1,
    transition: '0.4s',
  },
  fancyAppBar: {
    backgroundColor: 'transparent',
  },
  whiteAppBar: {
    backgroundColor: () => (theme.palette.type === 'light' ? theme.palette.common.white : undefined),
  },
  toolbar: {
    width: '100%',
    maxWidth: theme.breakpoints.values.xl,
    margin: 'auto',
    padding: theme.spacing(0, 1),
    display: 'grid',
    gridTemplateColumns: '220px 1fr 220px',
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: '160px 1fr 160px',
    },
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '160px 1fr',
    },
  },
  logo: {
    height: 32,
    width: 'auto',
    marginLeft: 0,
  },
  items: {
    display: 'flex',
    justifyContent: 'center',
    color: (props) => (props.whiteOnLight && theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white),
  },
  right: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  menuButton: {
    color: (props) =>
      props.whiteOnLight && theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.getContrastText(theme.palette.colors.gradient.main.top),
    margin: 'auto 0',
  },
  selected: {
    borderBottom: '2px solid ' + theme.palette.getContrastText(theme.palette.colors.gradient.main.top),
  },
  profileName: {
    margin: `auto ${theme.spacing(1)}px`,
    color: (props) => (props.whiteOnLight && theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white),
    textAlign: 'right',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  avatar: {
    width: 45,
    height: 45,
  },
  topbarItem: {
    alignSelf: 'center',
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
  items?: {
    text: string;
    to: string;
  }[];
  text: string;
  to?: string;
  type: 'dropdown' | 'link';
};

const TopBarItem = ({ items, text, to, type }: TopBarItemProps) => {
  const classes = useStyles({});
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const selected = useMemo(() => location.pathname === to, [location.pathname, to]);
  if (type === 'link' && to) {
    return (
      <div className={classNames(classes.topbarItem, selected && classes.selected)}>
        <Button color='inherit' component={Link} onClick={selected ? () => window.location.reload() : undefined} to={to}>
          {text}
        </Button>
      </div>
    );
  } else if (type === 'dropdown' && Array.isArray(items)) {
    return (
      <div className={classes.topbarItem} onMouseLeave={() => setIsOpen(false)}>
        <Button
          className={classes.topbarItem}
          color='inherit'
          endIcon={<ExpandIcon className={classNames(classes.dropdownIcon, isOpen && classes.expanded)} />}
          onClick={() => setIsOpen((prev) => !prev)}
          onMouseEnter={() => setIsOpen(true)}
          ref={anchorRef}>
          {text}
        </Button>
        <Popper anchorEl={anchorRef.current} disablePortal open={isOpen} role={undefined} transition>
          {({ TransitionProps, placement }) => (
            <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}>
              <Paper>
                <MenuList className={classes.menulist}>
                  {items.map((item, i) => (
                    <MenuItem className={classes.menulistItem} component={Link} key={i} to={item.to}>
                      {item.text}
                    </MenuItem>
                  ))}
                </MenuList>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  } else {
    return null;
  }
};

export type TopbarProps = {
  fancyNavbar?: boolean;
  whiteOnLight?: boolean;
};

const Topbar = ({ fancyNavbar = false, whiteOnLight = false }: TopbarProps) => {
  const isAuthenticated = useIsAuthenticated();
  const { data: user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const classes = useStyles({ whiteOnLight: whiteOnLight && !sidebarOpen });
  const [scrollLength, setScrollLength] = useState(0);

  const handleScroll = () => setScrollLength(window.pageYOffset);

  useEffect(() => {
    window.scrollTo(0, 0);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const items = useMemo(
    () =>
      [
        {
          items: [
            { text: 'Om TIHLDE', to: URLS.pages },
            { text: 'Ny student', to: URLS.newStudent },
          ],
          text: 'Generelt',
          type: 'dropdown',
        },
        { text: 'Arrangementer', to: URLS.events, type: 'link' },
        { text: 'Nyheter', to: URLS.news, type: 'link' },
        { text: 'Karriere', to: URLS.jobposts, type: 'link' },
        isAuthenticated
          ? {
              items: [{ text: 'Kokebok', to: URLS.cheatsheet }],
              text: 'For medlemmer',
              type: 'dropdown',
            }
          : { text: 'For bedrifter', to: URLS.company, type: 'link' },
      ] as Array<TopBarItemProps>,
    [isAuthenticated],
  );

  return (
    <AppBar
      className={classNames(
        classes.appBar,
        fancyNavbar && scrollLength < 20 && !sidebarOpen && classes.fancyAppBar,
        whiteOnLight && !sidebarOpen && classes.whiteAppBar,
      )}
      color='primary'
      elevation={(fancyNavbar && scrollLength < 20) || sidebarOpen ? 0 : 1}
      position='fixed'>
      <Toolbar className={classes.toolbar} disableGutters>
        <Link to={URLS.landing}>
          <TihldeLogo className={classes.logo} darkColor='white' lightColor={whiteOnLight && !sidebarOpen ? 'black' : 'white'} size='large' />
        </Link>
        <Hidden mdDown>
          <div className={classes.items}>
            {items.map((item, i) => (
              <TopBarItem key={i} {...item} />
            ))}
          </div>
        </Hidden>
        <div className={classes.right}>
          {user ? (
            <Button component={Link} onClick={URLS.profile === location.pathname ? () => location.reload() : undefined} to={URLS.profile}>
              <Hidden smDown>
                <Typography className={classes.profileName}>{user.first_name}</Typography>
              </Hidden>
              <Avatar className={classes.avatar} user={user} />
            </Button>
          ) : (
            <Hidden mdDown>
              <IconButton className={classes.menuButton} component={Link} to={URLS.login}>
                <PersonOutlineIcon />
              </IconButton>
            </Hidden>
          )}
          <Hidden lgUp>
            <IconButton className={classes.menuButton} onClick={() => setSidebarOpen((prev) => !prev)}>
              {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <Sidebar items={items} onClose={() => setSidebarOpen(false)} open={sidebarOpen} />
          </Hidden>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
