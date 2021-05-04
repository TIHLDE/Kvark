import { ComponentType } from 'react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { PermissionApp } from 'types/Enums';
import { HavePermission } from 'api/hooks/User';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, List, ListItem, ListItemText, ListItemAvatar } from '@material-ui/core';

// Icons
import ArrowIcon from '@material-ui/icons/ArrowForwardRounded';
import EventIcon from '@material-ui/icons/TodayRounded';
import JobPostIcon from '@material-ui/icons/WorkOutlineRounded';
import NewsIcon from '@material-ui/icons/DescriptionRounded';
import UsersIcon from '@material-ui/icons/PermIdentityRounded';
import GroupsIcon from '@material-ui/icons/GroupRounded';

// Project Components
import Paper from 'components/layout/Paper';

const useStyles = makeStyles((theme) => ({
  list: {
    display: 'grid',
    gridGap: theme.spacing(1),
  },
  avatar: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const Admin = () => {
  const classes = useStyles();

  type CardProps = {
    apps: PermissionApp[];
    to: string;
    primary: string;
    secondary: string;
    icon: ComponentType;
  };

  const Card = ({ apps, icon: Icon, to, primary, secondary }: CardProps) => (
    <HavePermission apps={apps}>
      <Paper noPadding>
        <ListItem button component={Link} to={to}>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <Icon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={primary} secondary={secondary} />
          <ArrowIcon />
        </ListItem>
      </Paper>
    </HavePermission>
  );

  const cards: Array<CardProps> = [
    {
      apps: [PermissionApp.EVENT],
      icon: EventIcon,
      to: URLS.eventAdmin,
      primary: 'Administrer arrangementer',
      secondary: 'Opprett, endre og slett arrangementer',
    },
    {
      apps: [PermissionApp.GROUP],
      icon: GroupsIcon,
      to: URLS.groups,
      primary: 'Administrer grupper',
      secondary: 'Se og endre grupper',
    },
    {
      apps: [PermissionApp.JOBPOST],
      icon: JobPostIcon,
      to: URLS.jobpostsAdmin,
      primary: 'Administrer jobbannonser',
      secondary: 'Opprett, endre og slett jobbannonser',
    },
    {
      apps: [PermissionApp.USER],
      icon: UsersIcon,
      to: URLS.eventAdmin,
      primary: 'Administrer medlemmer',
      secondary: 'Aktiver, rediger og søk etter medlemmer',
    },
    {
      apps: [PermissionApp.NEWS],
      icon: NewsIcon,
      to: URLS.newsAdmin,
      primary: 'Administrer nyheter',
      secondary: 'Opprett, endre og slett nyheter',
    },
  ];

  return (
    <List className={classes.list} disablePadding>
      {cards.map((card, i) => (
        <Card key={i} {...card} />
      ))}
    </List>
  );
};

export default Admin;
