import { useMemo, useState } from 'react';
import { InfiniteQueryObserverResult } from 'react-query';
import { PaginationResponse } from 'types/Types';

// Material UI Components
import { makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import MuiListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Hidden from '@material-ui/core/Hidden';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Skeleton from '@material-ui/lab/Skeleton';

// Icons
import MenuIcon from '@material-ui/icons/MenuRounded';
import AddIcon from '@material-ui/icons/AddRounded';

// Project components
import Pagination from 'components/layout/Pagination';

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
  listItemSecondary: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  drawerTop: {
    [theme.breakpoints.up('lg')]: {
      ...theme.mixins.toolbar,
    },
  },
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
    [theme.breakpoints.down('md')]: {
      bottom: theme.spacing(12),
    },
  },
}));

export type SidebarListProps<Type> = {
  useHook: (args?: unknown) => InfiniteQueryObserverResult<PaginationResponse<Type>>;
  onItemClick: (itemId: null | number) => void;
  selectedItemId: number;
  title: string;
  noExpired?: boolean;
  idKey: keyof Type;
  titleKey: keyof Type;
  descKey: keyof Type;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatDesc?: (content: any) => string;
};

// eslint-disable-next-line comma-spacing
const SidebarList = <Type,>({
  useHook,
  onItemClick,
  selectedItemId,
  title,
  idKey,
  titleKey,
  descKey,
  formatDesc,
  noExpired = false,
}: SidebarListProps<Type>) => {
  const classes = useStyles();
  const { data, hasNextPage, fetchNextPage, isLoading } = useHook();
  const items = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  const { data: expiredData, hasNextPage: hasNextExpiredPage, fetchNextPage: fetchNextExpiredPage, isLoading: isExpiredLoading } = useHook({ expired: true });
  const expiredItems = useMemo(() => (expiredData ? expiredData.pages.map((page) => page.results).flat() : []), [expiredData]);
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

  type ListItemProps = {
    item: Type;
  };

  const ListItem = ({ item }: ListItemProps) => (
    <MuiListItem
      button
      className={classes.listItem}
      onClick={() => handleItemClick(Number(item[idKey]))}
      selected={Boolean(Number(item[idKey]) === selectedItemId)}>
      <ListItemText
        classes={{ secondary: classes.listItemSecondary }}
        primary={item[titleKey]}
        secondary={formatDesc ? formatDesc(item[descKey]) : item[descKey]}
      />
    </MuiListItem>
  );
  const ListItemLoading = () => (
    <MuiListItem className={classes.listItem} selected>
      <ListItemText primary={<Skeleton width={140} />} secondary={<Skeleton width={90} />} />
    </MuiListItem>
  );

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
        <div className={classes.drawerTop} />
        <div className={classes.scroll}>
          <div className={classes.header}>
            <Typography variant='h3'>{title}</Typography>
            <IconButton onClick={() => handleItemClick(null)}>
              <AddIcon />
            </IconButton>
          </div>
          <Pagination fullWidth hasNextPage={hasNextPage} nextPage={fetchNextPage} variant='text'>
            <List className={classes.list} dense disablePadding>
              {isLoading && <ListItemLoading />}
              {items.map((item) => (
                <ListItem item={item} key={String(item[idKey])} />
              ))}
            </List>
          </Pagination>
          {!noExpired && (
            <>
              <Divider />
              <div className={classes.header}>
                <Typography variant='h3'>Tidligere</Typography>
              </div>
              <Pagination fullWidth hasNextPage={hasNextExpiredPage} nextPage={fetchNextExpiredPage} variant='text'>
                <List className={classes.list} dense disablePadding>
                  {isExpiredLoading && <ListItemLoading />}
                  {expiredItems.map((item) => (
                    <ListItem item={item} key={String(item[idKey])} />
                  ))}
                </List>
              </Pagination>
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
