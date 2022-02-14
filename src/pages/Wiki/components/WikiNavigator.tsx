import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import WikiIcon from '@mui/icons-material/LibraryBooksRounded';
import { TreeItem, TreeItemContentProps, TreeItemProps, TreeView, useTreeItem } from '@mui/lab';
import { Box, Divider, Drawer, Fab, IconButton, Theme, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { makeStyles } from 'makeStyles';
import { forwardRef, Ref, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import URLS from 'URLS';

import { WikiChildren, WikiTree } from 'types';

import { useWikiTree } from 'hooks/Wiki';

import Paper from 'components/layout/Paper';
import { AlertOnce } from 'components/miscellaneous/UserInformation';

const useStyles = makeStyles()({});

const CustomContent = forwardRef(function CustomContent(props: TreeItemContentProps, ref) {
  const { classes, className, label, nodeId, icon: iconProp, expansionIcon, displayIcon } = props;
  const { cx } = useStyles();
  const { disabled, expanded, selected, focused, handleExpansion, handleSelection, preventSelection } = useTreeItem(nodeId);
  const icon = iconProp || expansionIcon || displayIcon;

  return (
    <Box
      className={cx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={(e) => preventSelection(e)}
      ref={ref as Ref<HTMLDivElement>}
      sx={{ borderRadius: (theme) => `${theme.shape.borderRadius}px` }}
      tabIndex={-1}>
      <Typography
        className={classes.label}
        component={Link}
        onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => handleSelection(event)}
        sx={{ textDecoration: 'none', color: (theme) => theme.palette.text.primary }}
        to={nodeId === '/' ? URLS.wiki : nodeId}>
        {label}
      </Typography>
      <IconButton disabled={!icon} onClick={(e) => handleExpansion(e)} sx={{ my: 0.5, mr: -0.5, width: 30, height: 30 }}>
        {icon}
      </IconButton>
    </Box>
  );
});

const CustomTreeItem = (props: TreeItemProps) => <TreeItem ContentComponent={CustomContent} {...props} />;

export type PagesListProps = {
  pages?: Array<WikiChildren>;
  homeButton?: boolean;
  noBackLink?: boolean;
  linkOnClick?: () => void;
};

const getPathLevels = (url: string) =>
  url
    .split('/')
    .filter((x) => x.trim() !== '')
    .slice(1);

const getExpandedFromLevels = (levels: Array<string>) => {
  const arr = ['/'];
  for (let i = 0; i < levels.length; i++) {
    arr.push(`${levels.slice(0, i + 1).join('/')}/`);
  }
  return arr;
};

const Tree = () => {
  const { data } = useWikiTree();
  const location = useLocation();
  const levels = useMemo(() => getPathLevels(location.pathname), [location.pathname]);
  const [expanded, setExpanded] = useState(getExpandedFromLevels(levels));

  useEffect(() => {
    setExpanded((prev) => [...prev, ...getExpandedFromLevels(getPathLevels(location.pathname))]);
  }, [location.pathname]);

  const renderTree = (node: WikiTree, parentPath: string) => {
    const id = `${parentPath}${node.slug}${node.slug === '' ? '' : '/'}`;
    if (id === location.pathname) {
      return null;
    }
    return (
      <CustomTreeItem key={id} label={node.title} nodeId={id === '' ? '/' : id}>
        {Array.isArray(node.children) && node.children.sort((a, b) => a.title.localeCompare(b.title)).map((childNode) => renderTree(childNode, id))}
      </CustomTreeItem>
    );
  };

  if (!data) {
    return null;
  }

  return (
    <TreeView
      defaultCollapseIcon={<ExpandLessIcon />}
      defaultExpandIcon={<ExpandMoreIcon />}
      expanded={expanded}
      onNodeToggle={(event, nodeIds) => setExpanded(nodeIds)}
      selected={`${levels.join('/')}/`}
      sx={{ p: 0.5 }}>
      {renderTree({ ...data, slug: '' }, '')}
    </TreeView>
  );
};

const WikiNavigator = () => {
  const [open, setOpen] = useState(false);
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  useEffect(() => setOpen(false), [location.pathname]);

  if (lgDown) {
    return (
      <>
        <AlertOnce cookieKey='ShowWikiInfoMobile' severity='info' variant='outlined'>
          På jakt etter noe? Klikk på den runde knappen nede til høyre for å utforske innholdet i wikien, eller bruk søket over!
        </AlertOnce>
        <Tooltip placement='left' title='Utforsk innholdet i Wiki'>
          <Fab
            color='primary'
            onClick={() => setOpen(true)}
            size='medium'
            sx={{ position: 'fixed', bottom: (theme) => theme.spacing(12), right: (theme) => theme.spacing(2), zIndex: 1 }}>
            <WikiIcon />
          </Fab>
        </Tooltip>
        <Drawer
          anchor='bottom'
          onClose={() => setOpen(false)}
          open={open}
          sx={{
            [`& .MuiDrawer-paper`]: {
              pb: 12,
              borderTopRightRadius: (theme) => `${theme.shape.borderRadius}px`,
              borderTopLeftRadius: (theme) => `${theme.shape.borderRadius}px`,
              border: (theme) => `${theme.palette.borderWidth} solid ${theme.palette.divider}`,
            },
          }}>
          <Typography sx={{ px: 2, py: 1 }} variant='h3'>
            Utforsk Wiki
          </Typography>
          <Divider />
          <Tree />
        </Drawer>
      </>
    );
  }
  return (
    <Paper noOverflow noPadding>
      <Tree />
    </Paper>
  );
};

export default WikiNavigator;
