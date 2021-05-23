import { useMemo, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import classNames from 'classnames';

// Material UI Components
import { makeStyles, AppBar, Toolbar, Button, Grow, Paper, Popper, MenuItem, MenuList } from '@material-ui/core';

// Assets/Icons
import ExpandIcon from '@material-ui/icons/ExpandMoreRounded';

// Project Components
import { NavigationItem } from 'components/navigation/Navigation';
import ProfileTopbarButton from 'components/navigation/ProfileTopbarButton';
import TihldeLogo from 'components/miscellaneous/TihldeLogo';

const useStyles = makeStyles((theme) => ({
  appBar: {
    boxSizing: 'border-box',
    backgroundColor: theme.palette.colors.gradient.main.top,
    color: theme.palette.text.primary,
    flexGrow: 1,
    zIndex: theme.zIndex.drawer + 1,
    transition: '0.2s',
  },
  fancyAppBar: {
    backgroundColor: 'transparent',
  },
  backdrop: {
    ...theme.palette.blurred,
    ...theme.palette.transparent,
    backgroundColor: `${theme.palette.colors.gradient.main.top}bf`,
    border: 'none',
    boxShadow: 'none',
  },
  toolbar: {
    width: '100%',
    maxWidth: theme.breakpoints.values.xl,
    margin: 'auto',
    padding: theme.spacing(0, 1),
    display: 'grid',
    gridTemplateColumns: '170px 1fr 170px',
  },
  logo: {
    height: 32,
    width: 'auto',
    marginLeft: 0,
  },
  items: {
    display: 'flex',
    justifyContent: 'center',
    color: theme.palette.common.white,
  },
  right: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  menuButton: {
    color: theme.palette.getContrastText(theme.palette.colors.gradient.main.top),
    margin: 'auto 0',
  },
  selected: {
    borderBottom: '2px solid ' + theme.palette.getContrastText(theme.palette.colors.gradient.main.top),
  },
  profileName: {
    margin: `auto ${theme.spacing(1)}px`,
    color: theme.palette.common.white,
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
  const classes = useStyles();
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
  items: Array<NavigationItem>;
};

const Topbar = ({ items }: TopbarProps) => {
  const classes = useStyles();
  const [scrollLength, setScrollLength] = useState(0);

  const handleScroll = () => setScrollLength(window.pageYOffset);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isOnTop = useMemo(() => scrollLength < 20, [scrollLength]);

  return (
    <AppBar
      className={classNames(classes.appBar, isOnTop && classes.fancyAppBar, !isOnTop && classes.backdrop)}
      color='primary'
      elevation={isOnTop ? 0 : 1}
      position='fixed'>
      <Toolbar className={classes.toolbar} disableGutters>
        <Link to={URLS.landing}>
          <TihldeLogo className={classes.logo} darkColor='white' lightColor='white' size='large' />
        </Link>
        <div className={classes.items}>
          {items.map((item, i) => (
            <TopBarItem key={i} {...item} />
          ))}
        </div>
        <div className={classes.right}>
          <ProfileTopbarButton />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
