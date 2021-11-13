import { useState } from 'react';
import URLS from 'URLS';
import { Link } from 'react-router-dom';
import { useIsAuthenticated } from 'hooks/User';

// Material UI Components
import { makeStyles } from 'makeStyles';
import { useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Drawer from '@mui/material/Drawer';

// Icons
import ExpandIcon from '@mui/icons-material/ExpandMoreRounded';

// Project components
import TihldeLogo from 'components/miscellaneous/TihldeLogo';

const useStyles = makeStyles()((theme) => ({
  sidebar: {
    backgroundColor: theme.palette.colors.gradient.main.top,
    width: '100vw',
    overflow: 'auto',
    height: '100%',
  },
  root: {
    padding: theme.spacing(2, 3),
    display: 'flex',
    flexDirection: 'column',
  },
  dropdownButton: {
    textTransform: 'none',
    textAlign: 'left',
    justifyContent: 'flex-start',
    width: 'fit-content',
    padding: 0,
    paddingRight: theme.spacing(1),
  },
  dropdown: {
    display: 'flex',
    flexDirection: 'column',
  },
  text: {
    color: theme.palette.getContrastText(theme.palette.colors.gradient.main.top),
    padding: theme.spacing(1),
    textDecoration: 'none',
    width: 'fit-content',
  },
  itemText: {
    marginLeft: theme.spacing(2),
  },
  dropdownIcon: {
    transition: 'transform 0.5s',
    color: theme.palette.getContrastText(theme.palette.colors.gradient.main.top),
    fontSize: '40px !important',
    marginBottom: theme.spacing(-0.5),
  },
  expanded: {
    transform: 'rotate(180deg)',
  },
  logo: {
    height: 32,
    width: 'auto',
    margin: theme.spacing(2, 'auto', 0, 2),
  },
}));

type SidebarItemType = {
  items?: {
    text: string;
    to: string;
  }[];
  text: string;
  to?: string;
  type: 'dropdown' | 'link';
};

export type SidebarItemProps = SidebarItemType & {
  onClose: SidebarProps['onClose'];
};

const SidebarItem = ({ items, text, to, type, onClose }: SidebarItemProps) => {
  const { classes, cx } = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  if (type === 'link' && to) {
    return (
      <Typography
        className={classes.text}
        component={Link}
        onClick={to === window.location.pathname ? () => window.location.reload() : onClose}
        to={to}
        variant='h2'>
        {text}
      </Typography>
    );
  } else if (type === 'dropdown' && Array.isArray(items)) {
    return (
      <>
        <Button
          className={classes.dropdownButton}
          endIcon={<ExpandIcon className={cx(classes.dropdownIcon, isOpen && classes.expanded)} />}
          onClick={() => setIsOpen((prev) => !prev)}>
          <Typography className={classes.text} variant='h2'>
            {text}
          </Typography>
        </Button>
        <Collapse classes={{ wrapperInner: classes.dropdown }} in={isOpen}>
          {items.map((item, i) => (
            <Typography
              className={cx(classes.text, classes.itemText)}
              component={Link}
              key={i}
              onClick={item.to === window.location.pathname ? () => window.location.reload() : onClose}
              to={item.to}
              variant='h3'>
              - {item.text}
            </Typography>
          ))}
        </Collapse>
      </>
    );
  } else {
    return null;
  }
};

export type SidebarProps = {
  items: Array<SidebarItemType>;
  onClose: () => void;
  open: boolean;
};

const Sidebar = ({ items, onClose, open }: SidebarProps) => {
  const { classes } = useStyles();
  const isAuthenticated = useIsAuthenticated();
  const theme = useTheme();
  return (
    <Drawer anchor='bottom' classes={{ paper: classes.sidebar }} onClose={onClose} open={open} style={{ zIndex: theme.zIndex.drawer }}>
      <TihldeLogo className={classes.logo} darkColor='white' lightColor='white' size='large' />
      <div className={classes.root}>
        {items.map((item, i) => (
          <SidebarItem key={i} {...item} onClose={onClose} />
        ))}
        {isAuthenticated ? (
          <SidebarItem onClose={onClose} text='Min profil' to={URLS.profile} type='link' />
        ) : (
          <SidebarItem onClose={onClose} text='Logg inn' to={URLS.login} type='link' />
        )}
      </div>
    </Drawer>
  );
};

export default Sidebar;
