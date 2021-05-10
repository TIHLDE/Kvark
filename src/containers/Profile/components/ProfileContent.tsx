import { useState } from 'react';
import { PermissionApp } from 'types/Enums';
import { useUser, useHavePermission } from 'api/hooks/User';
import URLS from 'URLS';
import { useNavigate } from 'react-router-dom';
import { useLogout } from 'api/hooks/User';

// Material-UI
import { makeStyles, SvgIconProps, Badge, Collapse, List, ListItem, ListItemIcon, ListItemText, TextField, MenuItem, Hidden } from '@material-ui/core';

// Icons
import EventIcon from '@material-ui/icons/DateRangeRounded';
import NotificationsIcon from '@material-ui/icons/NotificationsNoneRounded';
import SettingsIcon from '@material-ui/icons/SettingsRounded';
import AdminIcon from '@material-ui/icons/TuneRounded';
import LogOutIcon from '@material-ui/icons/ExitToAppRounded';
import BadgesIcon from '@material-ui/icons/EmojiEventsRounded';
import GroupsIcon from '@material-ui/icons/PeopleOutlineRounded';

// Project Components
import ProfileAdmin from 'containers/Profile/components/ProfileAdmin';
import ProfileSettings from 'containers/Profile/components/ProfileSettings';
import ProfileEvents from 'containers/Profile/components/ProfileEvents';
import ProfileGroups from 'containers/Profile/components/ProfileGroups';
import ProfileNotifications from 'containers/Profile/components/ProfileNotifications';
import ProfileBadges from 'containers/Profile/components/ProfileBadges';
import Paper from 'components/layout/Paper';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'grid',
    gridTemplateColumns: '250px 1fr',
    gridGap: theme.spacing(1),
    alignItems: 'self-start',
    marginTop: theme.spacing(-6),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
  menu: {
    display: 'grid',
    gap: theme.spacing(1),
  },
  contentList: {
    overflow: 'hidden',
  },
  select: {
    background: theme.palette.background.paper,
  },
  logOutButton: {
    color: theme.palette.error.main,
  },
}));

const ProfileContent = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const logOut = useLogout();
  const { data: user } = useUser();
  const { allowAccess: isAdmin } = useHavePermission([PermissionApp.EVENT, PermissionApp.JOBPOST, PermissionApp.NEWS, PermissionApp.USER]);

  const logout = () => {
    logOut();
    navigate(URLS.landing);
  };

  const eventTab = { label: 'Arrangementer', icon: EventIcon };
  const notificationsTab = { label: 'Varsler', icon: NotificationsIcon, badge: user?.unread_notifications };
  const badgesTab = { label: 'Badges', icon: BadgesIcon };
  const groupsTab = { label: 'Grupper', icon: GroupsIcon };
  const settingsTab = { label: 'Innstillinger', icon: SettingsIcon };
  const adminTab = { label: 'Admin', icon: AdminIcon };
  const logoutTab = { label: 'Logg ut', icon: LogOutIcon, onClick: logout, className: classes.logOutButton };
  const tabs = [eventTab, notificationsTab, badgesTab, groupsTab, settingsTab, ...(isAdmin ? [adminTab] : [])];
  const [tab, setTab] = useState(eventTab.label);

  type NavListItem = {
    label: string;
    icon: React.ComponentType<SvgIconProps>;
    badge?: string | number;
    onClick?: () => void;
    className?: string;
  };

  const NavListItem = ({ label, icon: Icon, onClick, badge, className = '', ...props }: NavListItem) => (
    <ListItem button onClick={onClick ? onClick : () => setTab(label)} selected={tab === label} {...props}>
      <ListItemIcon>
        <Badge badgeContent={badge} color='error'>
          <Icon className={className} color={tab === label ? 'primary' : 'inherit'} />
        </Badge>
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItem>
  );

  return (
    <div className={classes.content}>
      <div className={classes.menu}>
        <Hidden mdUp>
          <TextField aria-label='Velg innhold' className={classes.select} onChange={(e) => setTab(e.target.value)} select value={tab} variant='outlined'>
            {tabs.map((tab) => (
              <MenuItem key={tab.label} value={tab.label}>
                {tab.label}
              </MenuItem>
            ))}
          </TextField>
        </Hidden>
        <Hidden smDown>
          <Paper className={classes.contentList} noPadding>
            <List aria-label='Profil innholdsliste' disablePadding>
              {tabs.map((tab) => (
                <NavListItem {...tab} key={tab.label} />
              ))}
            </List>
          </Paper>
        </Hidden>
        <Paper className={classes.contentList} noPadding>
          <List aria-label='Logg ut' disablePadding>
            <NavListItem {...logoutTab} />
          </List>
        </Paper>
      </div>
      <div>
        <Collapse in={tab === eventTab.label}>
          <ProfileEvents />
        </Collapse>
        <Collapse in={tab === notificationsTab.label} mountOnEnter unmountOnExit>
          <ProfileNotifications />
        </Collapse>
        <Collapse in={tab === badgesTab.label} mountOnEnter>
          <ProfileBadges />
        </Collapse>
        <Collapse in={tab === groupsTab.label} mountOnEnter>
          <ProfileGroups />
        </Collapse>
        <Collapse in={tab === settingsTab.label} mountOnEnter>
          <Paper>{user && <ProfileSettings user={user} />}</Paper>
        </Collapse>
        <Collapse in={tab === adminTab.label} mountOnEnter>
          <ProfileAdmin />
        </Collapse>
      </div>
    </div>
  );
};

export default ProfileContent;
