import { useState, useEffect } from 'react';
import { PermissionApp } from 'types/Enums';
import { useUser, useHavePermission } from 'hooks/User';
import URLS from 'URLS';
import { useNavigate } from 'react-router-dom';
import { useLogout } from 'hooks/User';

// Material-UI
import { makeStyles } from '@mui/styles';
import { SvgIconProps, Badge, Collapse, List, ListItem, ListItemIcon, ListItemText, Stack } from '@mui/material';

// Icons
import EventIcon from '@mui/icons-material/DateRangeRounded';
import SettingsIcon from '@mui/icons-material/SettingsRounded';
import AdminIcon from '@mui/icons-material/TuneRounded';
import LogOutIcon from '@mui/icons-material/ExitToAppRounded';
import BadgesIcon from '@mui/icons-material/EmojiEventsRounded';
import GroupsIcon from '@mui/icons-material/PeopleOutlineRounded';
import FormsIcon from '@mui/icons-material/HelpOutlineRounded';
import Warning from '@mui/icons-material/WarningRounded';

// Project Components
import ProfileAdmin from 'pages/Profile/components/ProfileAdmin';
import ProfileSettings from 'pages/Profile/components/ProfileSettings';
import ProfileEvents from 'pages/Profile/components/ProfileEvents';
import ProfileForms from 'pages/Profile/components/ProfileForms';
import ProfileGroups from 'pages/Profile/components/ProfileGroups';
import ProfileBadges from 'pages/Profile/components/ProfileBadges';
import ProfileStrikes from 'pages/Profile/components/ProfileStrikes';
import Paper from 'components/layout/Paper';
import { useGoogleAnalytics } from 'hooks/Utils';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'grid',
    gridTemplateColumns: '250px 1fr',
    gridGap: theme.spacing(1),
    alignItems: 'self-start',
    marginTop: theme.spacing(-6),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },
  logOutButton: {
    color: theme.palette.error.main,
  },
}));

const ProfileContent = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { event } = useGoogleAnalytics();
  const logOut = useLogout();
  const { data: user } = useUser();
  const { allowAccess: isAdmin } = useHavePermission([PermissionApp.EVENT, PermissionApp.JOBPOST, PermissionApp.NEWS, PermissionApp.USER]);

  const logout = () => {
    event('log-out', 'profile', 'Logged out');
    logOut();
    navigate(URLS.landing);
  };

  const eventTab: NavListItem = { label: 'Arrangementer', icon: EventIcon };
  const badgesTab: NavListItem = { label: 'Badges', icon: BadgesIcon };
  const groupsTab: NavListItem = { label: 'Grupper', icon: GroupsIcon };
  const strikesTab: NavListItem = { label: 'Prikker', icon: Warning };
  const formsTab: NavListItem = { label: 'Spørreskjemaer', icon: FormsIcon, badge: user?.unanswered_evaluations_count };
  const settingsTab: NavListItem = { label: 'Innstillinger', icon: SettingsIcon };
  const adminTab: NavListItem = { label: 'Admin', icon: AdminIcon };
  const logoutTab: NavListItem = { label: 'Logg ut', icon: LogOutIcon, onClick: logout, className: classes.logOutButton };
  const tabs: Array<NavListItem> = [eventTab, badgesTab, groupsTab, formsTab, strikesTab, settingsTab, ...(isAdmin ? [adminTab] : [])];
  const [tab, setTab] = useState(eventTab.label);

  useEffect(() => event('change-tab', 'profile', `Changed tab to: ${tab}`), [tab]);

  type NavListItem = {
    label: string;
    icon: React.ComponentType<SvgIconProps>;
    badge?: string | number;
    onClick?: () => void;
    className?: string;
  };

  const NavListItem = ({ label, icon: Icon, onClick, badge, className = '', ...props }: NavListItem) => (
    <ListItem
      button
      onClick={onClick ? onClick : () => setTab(label)}
      selected={tab === label}
      sx={{ px: { xs: 1, sm: 2 }, borderRadius: ({ shape }) => `${shape.borderRadius}px` }}
      {...props}>
      <ListItemIcon sx={{ minWidth: { xs: 32, sm: 40 } }}>
        <Badge badgeContent={badge} color='error'>
          <Icon className={className} color={tab === label ? 'primary' : 'inherit'} />
        </Badge>
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItem>
  );

  return (
    <div className={classes.content}>
      <Stack spacing={1}>
        <Paper noOverflow noPadding>
          <List aria-label='Profil innholdsliste' disablePadding sx={{ display: 'grid', gridTemplateColumns: { xs: '50% 50%', md: '1fr' } }}>
            {tabs.map((tab) => (
              <NavListItem {...tab} key={tab.label} />
            ))}
          </List>
        </Paper>
        <Paper noOverflow noPadding>
          <List aria-label='Logg ut' disablePadding>
            <NavListItem {...logoutTab} />
          </List>
        </Paper>
      </Stack>
      <div>
        <Collapse in={tab === eventTab.label}>
          <ProfileEvents />
        </Collapse>
        <Collapse in={tab === badgesTab.label} mountOnEnter>
          <ProfileBadges />
        </Collapse>
        <Collapse in={tab === groupsTab.label} mountOnEnter>
          <ProfileGroups />
        </Collapse>
        <Collapse in={tab === formsTab.label} mountOnEnter>
          <ProfileForms />
        </Collapse>
        <Collapse in={tab === strikesTab.label} mountOnEnter>
          <ProfileStrikes />
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
