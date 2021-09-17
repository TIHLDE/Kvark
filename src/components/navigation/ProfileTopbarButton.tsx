import { useState } from 'react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { useUser } from 'hooks/User';
import { useSetRedirectUrl } from 'hooks/Misc';

// Material UI Components
import { makeStyles } from '@mui/styles';
import { Theme, Button, IconButton, Badge } from '@mui/material';

// Assets/Icons
import PersonOutlineIcon from '@mui/icons-material/PersonRounded';
import LightIcon from '@mui/icons-material/WbSunnyRounded';
import NotificationsIcon from '@mui/icons-material/NotificationsNoneRounded';

// Project Components
import Avatar from 'components/miscellaneous/Avatar';
import ThemeSettings from 'components/miscellaneous/ThemeSettings';
import NotifcationsTopBar from 'components/miscellaneous/TopbarNotifications'
import { NavigationOptions } from 'components/navigation/Navigation';
import { useGoogleAnalytics } from 'hooks/Utils';

const useStyles = makeStyles<Theme, ProfileTopbarButtonProps>((theme) => ({
  themeButton: {
    height: 54,
    width: 54,
    color: (props) => getColor(props, theme),
  },
  themeSettingsIcon: {
    fontSize: 26,
  },
  menuButton: {
    color: (props) => getColor(props, theme),
    margin: 'auto 0',
  },
}));

const getColor = ({ darkColor, lightColor }: ProfileTopbarButtonProps, theme: Theme) => {
  const type = theme.palette.mode === 'light' ? lightColor : darkColor;
  return type === 'white' ? theme.palette.common.white : type === 'blue' ? theme.palette.colors.tihlde : theme.palette.common.black;
};

export type ProfileTopbarButtonProps = Pick<NavigationOptions, 'darkColor' | 'lightColor'>;

const ProfileTopbarButton = (props: ProfileTopbarButtonProps) => {
  const { event } = useGoogleAnalytics();
  const classes = useStyles(props);
  const { data: user } = useUser();
  const setLogInRedirectURL = useSetRedirectUrl();
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [showNotifcationItem, setShowNotifcationItem] = useState(false);

  const analytics = (page: string) => event(`go-to-${page}`, 'topbar-profile-button', `Go to ${page}`);

  const notificationsBadge = {icon: NotificationsIcon, badge: user?.unread_notifications };

  return (
    <div>
      <NotifcationsTopBar onClose={() => setShowNotifcationItem(false)} open={showNotifcationItem}/>
      <IconButton aria-label='Vis meldinger' className={classes.themeButton} onClick={() => setShowNotifcationItem(true)}>
        <Badge badgeContent={notificationsBadge.badge} color='error'>
          <notificationsBadge.icon/>
        </Badge>
      </IconButton>
      <ThemeSettings onClose={() => setShowThemeSettings(false)} open={showThemeSettings} />
      <IconButton aria-label='Endre tema' className={classes.themeButton} onClick={() => setShowThemeSettings(true)}>
        <LightIcon className={classes.themeSettingsIcon} />
      </IconButton>
      {user ? (
        <Button component={Link} onClick={URLS.profile === location.pathname ? () => location.reload() : () => analytics('profile')} to={URLS.profile}>
          <Avatar className={classes.avatar} user={user} />
        </Button>
      ) : (
        <IconButton
          className={classes.menuButton}
          component={Link}
          onClick={() => {
            setLogInRedirectURL(window.location.pathname);
            analytics('log-in');
          }}
          to={URLS.login}>
          <PersonOutlineIcon />
        </IconButton>
      )}
    </div>
  );
};

export default ProfileTopbarButton;
