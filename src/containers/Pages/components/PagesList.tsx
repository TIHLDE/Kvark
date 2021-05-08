import { ComponentType, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import URLS from 'URLS';
import { PageChildren } from 'types/Types';

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
  pages: Array<PageChildren>;
  homeButton?: boolean;
  noBackLink?: boolean;
  linkOnClick?: () => void;
};

const PagesList = ({ homeButton = false, noBackLink = false, linkOnClick, pages }: IPagesListProps) => {
  const location = useLocation();

  const backLink = useMemo((): string | null => {
    const pathArray = location.pathname.split('/').filter((x) => x.trim() !== '');
    return pathArray.length <= 1 || noBackLink ? null : `/${pathArray.splice(0, pathArray.length - 1).join('/')}/`;
  }, [location.pathname]);

  type ElementProps = {
    label: string;
    to: string;
    icon: ComponentType;
    divider?: boolean;
  };
  const Element = ({ icon: Icon, divider, label, to }: ElementProps) => (
    <ListItem button component={Link} divider={divider} onClick={linkOnClick} to={to}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItem>
  );

  if (homeButton) {
    return (
      <List disablePadding>
        <Element icon={HomeIcon} label='Hjem' to={URLS.pages} />
      </List>
    );
  }

  return (
    <List disablePadding>
      {backLink !== null && <Element divider={Boolean(pages.length)} icon={BackIcon} label='Tilbake' to={backLink} />}
      {pages
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((page, i) => (
          <Element divider={pages.length - 1 !== i} icon={PageIcon} key={page.slug} label={page.title} to={page.path} />
        ))}
    </List>
  );
};

export default PagesList;
