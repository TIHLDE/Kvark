import { useMemo, useEffect, useState, forwardRef, Ref } from 'react';
import { Link, useLocation } from 'react-router-dom';
import URLS from 'URLS';
import { PageChildren, PageTree } from 'types';
import { usePageTree } from 'hooks/Pages';
import { Typography, Box, IconButton } from '@mui/material';
import { TreeView, TreeItem, TreeItemContentProps, TreeItemProps, useTreeItem } from '@mui/lab';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';
import { makeStyles } from 'makeStyles';

const useStyles = makeStyles()({});

const CustomContent = forwardRef(function CustomContent(props: TreeItemContentProps, ref) {
  const { classes, className, label, nodeId, icon: iconProp, expansionIcon, displayIcon } = props;
  const { cx } = useStyles();
  const { disabled, expanded, selected, focused, handleExpansion, handleSelection, preventSelection } = useTreeItem(nodeId);
  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    preventSelection(event);
  };

  const handleExpansionClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    handleExpansion(event);
  };

  return (
    <Box
      className={cx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      ref={ref as Ref<HTMLDivElement>}
      sx={{ borderRadius: (theme) => theme.shape.borderRadius }}
      tabIndex={-1}>
      <Typography
        className={classes.label}
        component={Link}
        onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => handleSelection(event)}
        sx={{ textDecoration: 'none', color: (theme) => theme.palette.text.primary }}
        to={nodeId === '/' ? URLS.pages : nodeId}>
        {label}
      </Typography>
      <IconButton disabled={!icon} onClick={handleExpansionClick} sx={{ my: 0.5, width: 20, height: 20 }}>
        {icon}
      </IconButton>
    </Box>
  );
});

const CustomTreeItem = (props: TreeItemProps) => <TreeItem ContentComponent={CustomContent} {...props} />;

export type PagesListProps = {
  pages?: Array<PageChildren>;
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

const PagesList = () => {
  const { data } = usePageTree();
  const location = useLocation();
  const levels = useMemo(() => getPathLevels(location.pathname), [location.pathname]);
  const [expanded, setExpanded] = useState(getExpandedFromLevels(levels));

  useEffect(() => {
    setExpanded((prev) => [...prev, ...getExpandedFromLevels(getPathLevels(location.pathname))]);
  }, [location.pathname]);

  const renderTree = (node: PageTree, parentPath: string) => {
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

export default PagesList;
