import { useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import URLS from 'URLS';
import { Page } from 'types/Types';

// Material UI Components
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

// Icons
import BackIcon from '@material-ui/icons/ArrowBackIosRounded';
import PageIcon from '@material-ui/icons/SubjectRounded';
import HomeIcon from '@material-ui/icons/HomeRounded';

export type IPagesListProps = {
  pages: Page['children'];
  homeButton?: boolean;
};

const PagesList = ({ homeButton, pages }: IPagesListProps) => {
  const location = useLocation();

  const backLink = useMemo((): string | null => {
    const pathArray = location.pathname.split('/').filter((x) => x.trim() !== '');
    return pathArray.length <= 1 ? null : `/${pathArray.splice(0, pathArray.length - 1).join('/')}/`;
  }, [location.pathname]);

  const getToLink = useCallback(
    (slug: string): string => {
      return `/${location.pathname
        .split('/')
        .filter((x) => x.trim() !== '')
        .join('/')}/${slug}/`;
    },
    [location.pathname],
  );

  if (homeButton) {
    return (
      <List disablePadding>
        <ListItem button component={Link} to={URLS.pages}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary='Hjem' />
        </ListItem>
      </List>
    );
  }

  return (
    <List disablePadding>
      {backLink !== null && (
        <ListItem button component={Link} divider={Boolean(pages.length)} to={backLink}>
          <ListItemIcon>
            <BackIcon />
          </ListItemIcon>
          <ListItemText primary='Tilbake' />
        </ListItem>
      )}
      {pages
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((page, i) => (
          <ListItem button component={Link} divider={pages.length - 1 !== i} key={page.slug} to={getToLink(page.slug)}>
            <ListItemIcon>
              <PageIcon />
            </ListItemIcon>
            <ListItemText primary={page.title} />
          </ListItem>
        ))}
    </List>
  );
};

export default PagesList;
