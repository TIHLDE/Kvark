import { useState } from 'react';
import classnames from 'classnames';
import URLS from 'URLS';
import { Link } from 'react-router-dom';
import { useAuth } from 'api/hooks/Auth';

// Material UI Components
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Drawer from '@material-ui/core/Drawer';

// Icons
import ExpandIcon from '@material-ui/icons/ExpandMoreRounded';

const useStyles = makeStyles((theme) => ({
  sidebar: {
    backgroundColor: theme.palette.colors.gradient.main.top,
    width: '100vw',
    overflow: 'auto',
    height: 'calc(100% - 64px)',
    marginTop: 64,
    [theme.breakpoints.down('xs')]: {
      height: 'calc(100% - 56px)',
      marginTop: 56,
    },
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
}));

type SidebarItemProps = {
  items?: {
    text: string;
    to: string;
  }[];
  text: string;
  to?: string;
  type: 'dropdown' | 'link';
};

const SidebarItem = ({ items, text, to, type }: SidebarItemProps) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  if (type === 'link' && to) {
    return (
      <Typography
        className={classes.text}
        component={Link}
        onClick={to === window.location.pathname ? () => window.location.reload() : undefined}
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
          endIcon={<ExpandIcon className={classnames(classes.dropdownIcon, isOpen && classes.expanded)} />}
          onClick={() => setIsOpen((prev) => !prev)}>
          <Typography className={classes.text} variant='h2'>
            {text}
          </Typography>
        </Button>
        <Collapse classes={{ wrapperInner: classes.dropdown }} in={isOpen}>
          {items.map((item, i) => (
            <Typography
              className={classnames(classes.text, classes.itemText)}
              component={Link}
              key={i}
              onClick={item.to === window.location.pathname ? () => window.location.reload() : undefined}
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

export type IProps = {
  items: Array<SidebarItemProps>;
  onClose: () => void;
  open: boolean;
};

const Sidebar = ({ items, onClose, open }: IProps) => {
  const classes = useStyles();
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  return (
    <Drawer anchor='top' classes={{ paper: classes.sidebar }} onClose={onClose} open={open} style={{ zIndex: theme.zIndex.drawer - 1 }}>
      <div className={classes.root}>
        {items.map((item, i) => (
          <SidebarItem key={i} {...item} />
        ))}
        {isAuthenticated() ? <SidebarItem text='Min side' to={URLS.profile} type='link' /> : <SidebarItem text='Logg inn' to={URLS.login} type='link' />}
      </div>
    </Drawer>
  );
};

export default Sidebar;
