import { useState } from 'react';

// Material UI Components
import { makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Hidden from '@material-ui/core/Hidden';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';

// Icons
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import DownloadIcon from '@material-ui/icons/CloudDownload';

// Project components
import Pageination from 'components/layout/Pageination';

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    color: theme.palette.text.primary,
    padding: theme.spacing(1, 1, 1, 2),
    alignItems: 'center',
  },
  list: {
    padding: theme.spacing(1, 2, 1, 0),
  },
  listItem: {
    borderRadius: theme.spacing(0, 3, 3, 0),
  },
  drawerTop: theme.mixins.toolbar,
  drawerPaper: {
    width: theme.spacing(35),
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    overflow: 'hidden',
  },
  scroll: {
    overflow: 'auto',
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 10,
  },
}));

export type item = {
  id: number;
  location: string;
  title: string;
};

export type SidebarListProps = {
  expiredItems: item[];
  fetchExpired?: () => void;
  getNextPage: () => void;
  isLoading: boolean;
  items: item[];
  nextPage?: number | null;
  onItemClick: (item: null | number) => void;
  selectedItemId: number;
  title: string;
};

const SidebarList = ({ items, expiredItems, onItemClick, selectedItemId, getNextPage, nextPage, title, fetchExpired, isLoading }: SidebarListProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const handleItemClick = (item: number | null) => {
    onItemClick(item);
    setMobileOpen(false);
  };

  return (
    <>
      <Drawer
        anchor='left'
        classes={{ paper: classes.drawerPaper }}
        ModalProps={{ keepMounted: true }}
        onClose={() => setMobileOpen(false)}
        open={!isSmallScreen || mobileOpen}
        style={{ zIndex: theme.zIndex.drawer }}
        variant={isSmallScreen ? 'temporary' : 'permanent'}>
        <div className={classes.drawerTop}></div>
        <div className={classes.scroll}>
          <div className={classes.header}>
            <Typography variant='h3'>{title}</Typography>
            <IconButton onClick={() => handleItemClick(null)}>
              <AddIcon />
            </IconButton>
          </div>
          <Pageination nextPage={getNextPage} page={nextPage}>
            {isLoading && <LinearProgress />}
            <List className={classes.list} dense disablePadding>
              {items.map((item) => (
                <ListItem button className={classes.listItem} key={item.id} onClick={() => handleItemClick(item.id)} selected={item.id === selectedItemId}>
                  <ListItemText primary={item.title} secondary={item.location} />
                </ListItem>
              ))}
            </List>
          </Pageination>
          {fetchExpired && (
            <>
              <Divider />
              <div className={classes.header}>
                <Typography variant='h3'>Tidligere</Typography>
                <IconButton onClick={fetchExpired}>
                  <DownloadIcon />
                </IconButton>
              </div>
              {isLoading && <LinearProgress />}
              <List className={classes.list} dense disablePadding>
                {expiredItems.map((item) => (
                  <ListItem button className={classes.listItem} key={item.id} onClick={() => handleItemClick(item.id)} selected={item.id === selectedItemId}>
                    <ListItemText primary={item.title} secondary={item.location} />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </div>
      </Drawer>
      <Hidden lgUp>
        <Zoom in={!mobileOpen} style={{ transitionDelay: `${mobileOpen ? 0 : transitionDuration.exit}ms` }} timeout={transitionDuration} unmountOnExit>
          <Fab aria-label='Meny' className={classes.fab} color='primary' onClick={() => setMobileOpen((prev) => !prev)} size='medium'>
            <MenuIcon />
          </Fab>
        </Zoom>
      </Hidden>
    </>
  );
};

export default SidebarList;
