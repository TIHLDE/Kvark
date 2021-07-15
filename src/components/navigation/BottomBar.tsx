import { ComponentType, useEffect, useMemo, useState } from 'react';
import URLS from 'URLS';
import { Link, useLocation } from 'react-router-dom';

// Material UI Components
import { makeStyles } from '@material-ui/styles';
import { BottomNavigation, BottomNavigationAction, SvgIcon } from '@material-ui/core';
import EventIcon from '@material-ui/icons/EventRounded';
import MenuIcon from '@material-ui/icons/MenuRounded';
import JobPostIcon from '@material-ui/icons/WorkOutlineRounded';
import NewsIcon from '@material-ui/icons/NewReleasesRounded';
import CloseIcon from '@material-ui/icons/CloseRounded';

// Project components
import Paper from 'components/layout/Paper';
import { NavigationItem } from 'components/navigation/Navigation';
import Sidebar from 'components/navigation/Sidebar';
import Logo from 'components/miscellaneous/TihldeLogo';
import { useGoogleAnalytics } from 'api/hooks/Utils';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.drawer + 1,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
    ...theme.palette.blurred,
    ...theme.palette.transparent,
    background: `${theme.palette.background.paper}aa`,
    overflow: 'hidden',
  },
  bottombar: {
    height: 80,
    background: 'transparent',
    padding: theme.spacing(1, 0, 3),
  },
  action: {
    color: theme.palette.text.secondary,
    padding: 12,
    '&$selected': {
      color: theme.palette.text.primary,
    },
    minWidth: 50,
  },
  selected: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem !important',
    },
  },
  label: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.7rem',
    },
  },
}));

type Item = {
  icon: ComponentType<{ className?: string }>;
  text: string;
  to: string;
};

const MainLogo = () => <SvgIcon component={Logo} darkColor='white' lightColor='black' size='small' />;
const MENU_TAB_KEY = 'menu';

export type BottomBarProps = {
  items: Array<NavigationItem>;
};

const BottomBar = ({ items }: BottomBarProps) => {
  const { event } = useGoogleAnalytics();
  const classes = useStyles();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const actions = useMemo<Array<Item>>(
    () => [
      {
        icon: MainLogo,
        text: 'Hjem',
        to: URLS.landing,
      },
      {
        icon: EventIcon,
        text: 'Arrangementer',
        to: URLS.events,
      },
      {
        icon: NewsIcon,
        text: 'Nyheter',
        to: URLS.news,
      },
      {
        icon: JobPostIcon,
        text: 'Karriere',
        to: URLS.jobposts,
      },
    ],
    [],
  );
  useEffect(() => {
    setMenuOpen(false);
    setTab(location.pathname);
  }, [location]);
  const [tab, setTab] = useState(location.pathname);

  const toggleMenu = () => {
    if (!menuOpen) {
      event('menu', 'bottom-bar', 'Open menu');
    }
    setMenuOpen((prev) => !prev);
  };

  return (
    <Paper className={classes.root} noPadding>
      <BottomNavigation
        className={classes.bottombar}
        onChange={(event, newValue) => (actions.some((item) => item.to === newValue) ? setTab(newValue) : null)}
        showLabels
        value={tab}>
        {actions.map(({ text, to, icon: Icon }, i) => (
          <BottomNavigationAction
            classes={{ root: classes.action, selected: classes.selected, label: classes.label }}
            component={Link}
            icon={<Icon />}
            key={i}
            label={text}
            to={to}
            value={to}
          />
        ))}
        <BottomNavigationAction
          classes={{ root: classes.action, selected: classes.selected, label: classes.label }}
          icon={menuOpen ? <CloseIcon /> : <MenuIcon />}
          label='Meny'
          onClick={toggleMenu}
          value={MENU_TAB_KEY}
        />
      </BottomNavigation>
      <Sidebar items={items} onClose={() => setMenuOpen(false)} open={menuOpen} />
    </Paper>
  );
};

export default BottomBar;
