import React, { Fragment } from 'react';
import classNames from 'classnames';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';

// Icons
import AddIcon from '@material-ui/icons/Add';
import DownloadIcon from '@material-ui/icons/CloudDownload';

// Project components
import Pageination from 'components/layout/Pageination';

const useStyles = makeStyles((theme: Theme) => ({
  sidebar: {
    paddingTop: theme.spacing(8),
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    width: (props: SidebarListProps | ListItemProps) => ('width' in props ? props.width : 0),
    backgroundColor: theme.palette.colors.background.light,
    border: theme.palette.sizes.border.width + ' solid ' + theme.palette.colors.border.main,

    [theme.breakpoints.down('md')]: {
      position: 'static',
      width: '100% !important',
      padding: theme.spacing(0),
    },
  },
  sidebarContent: {
    maxHeight: '100%',
    overflowY: 'auto',
  },
  sidebarTop: {
    backgroundColor: theme.palette.colors.background.main,
    color: theme.palette.colors.text.main,
    padding: theme.spacing(1, 1, 1, 2),
    position: 'sticky',
    top: 0,
    zIndex: 200,
  },
  miniTop: {
    padding: theme.spacing(1, 1, 1, 2),
  },
  listItem: {
    padding: theme.spacing(1, 1),
    textAlign: 'left',
    color: theme.palette.colors.text.main,
  },
  listButton: {
    width: '100%',
  },
  selected: {
    backgroundColor: theme.palette.colors.tihlde.main,
    color: theme.palette.colors.constant.white,
  },
  progress: {
    display: 'block',
    margin: 'auto',
    marginTop: theme.spacing(1),

    [theme.breakpoints.down('md')]: {
      order: 1,
    },
  },
}));

export type ListItemProps = {
  title: string;
  location: string;
  onClick: () => void;
  selected: boolean;
};

const ListItem = (props: ListItemProps) => {
  const classes = useStyles(props);
  const { onClick, selected, title, location } = props;
  return (
    <Fragment>
      <ButtonBase className={classes.listButton} onClick={onClick}>
        <Grid alignItems='center' className={classNames(classes.listItem, selected ? classes.selected : '')} container direction='row' justify='space-between'>
          <Grid container direction='column' justify='center'>
            <Typography color='inherit' variant='subtitle1'>
              {title}
            </Typography>
            <Typography color='inherit' variant='caption'>
              {location}
            </Typography>
          </Grid>
        </Grid>
      </ButtonBase>
      <Divider />
    </Fragment>
  );
};

export type item = {
  id: number;
  title: string;
  location: string;
};

export type SidebarListProps = {
  items: item[];
  expiredItems: item[];
  onItemClick: (i: null | item) => void;
  selectedItemId: number;
  fetchExpired?: () => void;
  getNextPage: () => void;
  nextPage?: number;
  width: number;
  hideExpired?: boolean;
  title: string;
  isLoading: boolean;
};

const SidebarList = (props: SidebarListProps) => {
  const classes = useStyles(props);
  const { items, expiredItems, onItemClick, selectedItemId, getNextPage, nextPage, title, fetchExpired, hideExpired, isLoading } = props;
  return (
    <div className={classes.sidebar}>
      <Grid className={classNames(classes.sidebarContent, 'noScrollbar')} container direction='column' wrap='nowrap'>
        <Grid alignItems='center' className={classNames(classes.sidebarTop)} container direction='row' justify='space-between' wrap='nowrap'>
          <Typography color='inherit' variant='h6'>
            {title}
          </Typography>
          <IconButton onClick={() => onItemClick(null)}>
            <AddIcon />
          </IconButton>
        </Grid>
        <Pageination nextPage={getNextPage} page={nextPage}>
          {isLoading ? (
            <CircularProgress className={classes.progress} />
          ) : (
            items.map((value, index) => (
              <ListItem key={index} location={value.location} onClick={() => onItemClick(value)} selected={value.id === selectedItemId} title={value.title} />
            ))
          )}
        </Pageination>
        {!hideExpired && (
          <>
            <Grid
              alignItems='center'
              className={classNames(classes.sidebarTop, classes.miniTop)}
              container
              direction='row'
              justify='space-between'
              wrap='nowrap'>
              <Typography color='inherit' variant='h6'>
                Utgåtte
              </Typography>
              <IconButton onClick={fetchExpired}>
                <DownloadIcon />
              </IconButton>
            </Grid>
            {expiredItems.map((value, index) => (
              <ListItem key={index} location={value.location} onClick={() => onItemClick(value)} selected={value.id === selectedItemId} title={value.title} />
            ))}
          </>
        )}
      </Grid>
    </div>
  );
};

export default SidebarList;
