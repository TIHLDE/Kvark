import { useState, useEffect } from 'react';
import { PermissionApp } from 'types/Enums';
import { useUser, useHavePermission } from 'hooks/User';
import { useGoogleAnalytics } from 'hooks/Utils';
import URLS from 'URLS';
import { useNavigate } from 'react-router-dom';
import { useLogout } from 'hooks/User';
import {
  SvgIconProps,
  Badge,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  ListItemProps,
  ListItemIcon,
  ListItemText,
  Stack,
  Skeleton,
  Typography,
  Box,
  styled,
} from '@mui/material';

// Icons
import EventIcon from '@mui/icons-material/DateRangeRounded';
import SettingsIcon from '@mui/icons-material/SettingsRounded';
import AdminIcon from '@mui/icons-material/TuneRounded';
import LogOutIcon from '@mui/icons-material/ExitToAppRounded';
import BadgesIcon from '@mui/icons-material/EmojiEventsRounded';
import GroupsIcon from '@mui/icons-material/PeopleOutlineRounded';
import FormsIcon from '@mui/icons-material/HelpOutlineRounded';
import WorkspacesIcon from '@mui/icons-material/WorkspacesRounded';

// Project Components
import ProfileAdmin from 'pages/Profile/components/ProfileAdmin';
import ProfileSettings from 'pages/Profile/components/ProfileSettings';
import ProfileEvents from 'pages/Profile/components/ProfileEvents';
import ProfileForms from 'pages/Profile/components/ProfileForms';
import ProfileGroups from 'pages/Profile/components/ProfileGroups';
import ProfileBadges from 'pages/Profile/components/ProfileBadges';
import ProfileStrikes from 'pages/Profile/components/ProfileStrikes';
import Page from 'components/navigation/Page';
import Paper from 'components/layout/Paper';
import Avatar from 'components/miscellaneous/Avatar';
import QRButton from 'components/miscellaneous/QRButton';

const Content = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '250px 1fr',
  gridGap: theme.spacing(1),
  alignItems: 'self-start',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

const Profile = () => {
  const { data: user } = useUser();
  const navigate = useNavigate();
  const { event } = useGoogleAnalytics();
  const logOut = useLogout();
  const { allowAccess: isAdmin } = useHavePermission([PermissionApp.EVENT, PermissionApp.JOBPOST, PermissionApp.NEWS, PermissionApp.USER]);

  const logout = () => {
    event('log-out', 'profile', 'Logged out');
    logOut();
    navigate(URLS.landing);
  };

  const eventTab: NavListItem = { label: 'Arrangementer', icon: EventIcon };
  const badgesTab: NavListItem = { label: 'Badges', icon: BadgesIcon };
  const groupsTab: NavListItem = { label: 'Grupper', icon: GroupsIcon };
  const formsTab: NavListItem = { label: 'Spørreskjemaer', icon: FormsIcon, badge: user?.unanswered_evaluations_count };
  const settingsTab: NavListItem = { label: 'Innstillinger', icon: SettingsIcon };
  const adminTab: NavListItem = { label: 'Admin', icon: AdminIcon };
  const strikesTab: NavListItem = { label: 'Prikker', icon: WorkspacesIcon };
  const logoutTab: NavListItem = { label: 'Logg ut', icon: LogOutIcon, onClick: logout, iconProps: { sx: { color: (theme) => theme.palette.error.main } } };
  const tabs: Array<NavListItem> = [eventTab, badgesTab, groupsTab, strikesTab, formsTab, settingsTab, ...(isAdmin ? [adminTab] : [])];

  const [tab, setTab] = useState(eventTab.label);

  useEffect(() => event('change-tab', 'profile', `Changed tab to: ${tab}`), [tab]);

  type NavListItem = ListItemProps &
    Pick<ListItemButtonProps, 'onClick'> & {
      label: string;
      icon: React.ComponentType<SvgIconProps>;
      badge?: string | number;
      iconProps?: SvgIconProps;
    };

  const NavListItem = ({ label, icon: Icon, onClick, badge, iconProps, ...props }: NavListItem) => (
    <ListItem disableGutters disablePadding {...props}>
      <ListItemButton
        onClick={onClick ? onClick : () => setTab(label)}
        selected={tab === label}
        sx={{ borderRadius: ({ shape }) => `${shape.borderRadius}px` }}>
        <ListItemIcon sx={{ minWidth: { xs: 32, sm: 40 } }}>
          <Badge badgeContent={badge} color='error'>
            <Icon color={tab === label ? 'primary' : 'inherit'} {...iconProps} />
          </Badge>
        </ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );

  return (
    <Page options={{ title: 'Profil', gutterTop: true, lightColor: 'blue' }}>
      <Stack component={Paper} direction={{ xs: 'column', md: 'row' }} gap={1} sx={{ p: 2, mt: 1 }}>
        <Stack direction='row' gap={1} sx={{ flex: 1 }}>
          <Avatar sx={{ width: { xs: 70, md: 140 }, height: { xs: 70, md: 140 }, fontSize: { xs: '1.8rem', md: '3rem' } }} user={user} />
          {user && user.first_name ? (
            <Stack sx={{ m: 'auto', mx: 1, flex: 1 }}>
              <Typography sx={{ fontSize: { xs: '1.8rem', md: '3rem' } }} variant='h1'>{`${user.first_name} ${user.last_name}`}</Typography>
              <Typography variant='subtitle1'>
                {user.user_id} | {user.email}
              </Typography>
            </Stack>
          ) : (
            <Stack sx={{ m: 'auto', mx: 1, flex: 1 }}>
              <Skeleton sx={{ fontSize: { xs: '1.8rem', md: '3rem' } }} variant='text' width={230} />
              <Skeleton variant='text' width={170} />
            </Stack>
          )}
        </Stack>
        {user && (
          <QRButton qrValue={user.user_id} subtitle={`${user.first_name} ${user.last_name}`} sx={{ mb: 'auto' }}>
            Medlemsbevis
          </QRButton>
        )}
      </Stack>
      <Content>
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
        <Box sx={{ overflowX: 'auto' }}>
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
        </Box>
      </Content>
    </Page>
  );
};

export default Profile;
