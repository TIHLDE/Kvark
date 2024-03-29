import CloseIcon from '@mui/icons-material/CloseRounded';
import EventIcon from '@mui/icons-material/EventRounded';
import MenuIcon from '@mui/icons-material/MenuRounded';
import NewsIcon from '@mui/icons-material/NewReleasesRounded';
import JobPostIcon from '@mui/icons-material/WorkOutlineRounded';
import { BottomNavigation, BottomNavigationAction, SvgIcon } from '@mui/material';
import { makeStyles } from 'makeStyles';
import { ComponentType, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import URLS from 'URLS';

import { useAnalytics } from 'hooks/Utils';

import Paper from 'components/layout/Paper';
import Logo from 'components/miscellaneous/TihldeLogo';
import { NavigationItem } from 'components/navigation/Navigation';
import Sidebar from 'components/navigation/Sidebar';

const useStyles = makeStyles()((theme) => ({
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
    color: theme.palette.text.secondary,
    '& .Mui-selected': {
      color: theme.palette.text.primary,
    },
  },
  bottombar: {
    height: 80,
    background: 'transparent',
    padding: theme.spacing(1, 0, 3),
  },
  action: {
    color: theme.palette.text.secondary,
    padding: 12,
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

const MainLogo = () => <SvgIcon component={Logo} darkColor='white' lightColor='black' size='small' sx={{ color: 'currentColor' }} />;
const MENU_TAB_KEY = 'menu';

export type BottomBarProps = {
  items: Array<NavigationItem>;
};

const BottomBar = ({ items }: BottomBarProps) => {
  const { event } = useAnalytics();
  const { classes } = useStyles();
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
