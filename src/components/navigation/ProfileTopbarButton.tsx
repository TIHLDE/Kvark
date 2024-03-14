import LightIcon from '@mui/icons-material/WbSunnyRounded';
import { IconButton, Theme, useTheme } from '@mui/material';
import { UserRoundIcon } from 'lucide-react';
import { makeStyles } from 'makeStyles';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';

import { useSetRedirectUrl } from 'hooks/Misc';
import { useUser } from 'hooks/User';
import { useAnalytics } from 'hooks/Utils';

import ThemeSettings from 'components/miscellaneous/ThemeSettings';
import { NavigationOptions } from 'components/navigation/Navigation';
import TopbarNotifications from 'components/navigation/TopbarNotifications';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';

const useStyles = makeStyles<ProfileTopbarButtonProps>()((theme, props) => ({
  themeButton: {
    color: getColor(props, theme),
  },
  themeSettingsIcon: {
    fontSize: 26,
  },
  menuButton: {
    color: getColor(props, theme),
    margin: 'auto 0',
  },
}));

export const getColor = ({ darkColor, lightColor }: ProfileTopbarButtonProps, theme: Theme) => {
  const type = theme.palette.mode === 'light' ? lightColor : darkColor;
  return type === 'white' ? theme.palette.common.white : type === 'blue' ? theme.palette.colors.tihlde : theme.palette.common.black;
};

export type ProfileTopbarButtonProps = Pick<NavigationOptions, 'darkColor' | 'lightColor'>;

const ProfileTopbarButton = (props: ProfileTopbarButtonProps) => {
  const { event } = useAnalytics();
  const { classes } = useStyles(props);
  const { data: user } = useUser();
  const theme = useTheme();
  const setLogInRedirectURL = useSetRedirectUrl();
  const [showThemeSettings, setShowThemeSettings] = useState(false);

  const analytics = (page: string) => event(`go-to-${page}`, 'topbar-profile-button', `Go to ${page}`);

  return (
    <div className='flex items-center'>
      {Boolean(user) && <TopbarNotifications color={getColor(props, theme)} />}
      <ThemeSettings onClose={() => setShowThemeSettings(false)} open={showThemeSettings} />
      <IconButton aria-label='Endre tema' className={classes.themeButton} onClick={() => setShowThemeSettings(true)}>
        <LightIcon className={classes.themeSettingsIcon} />
      </IconButton>
      {user ? (
        <Link className='pl-2' onClick={URLS.profile === location.pathname ? () => location.reload() : () => analytics('profile')} to={URLS.profile}>
          <Avatar>
            <AvatarImage alt={user.first_name} src={user.image} />
            <AvatarFallback>
              {user.first_name[0]}
              {user.last_name[0]}
            </AvatarFallback>
          </Avatar>
        </Link>
      ) : (
        <Link
          onClick={() => {
            setLogInRedirectURL(window.location.pathname);
            analytics('log-in');
          }}
          to={URLS.login}>
          <UserRoundIcon className='text-white stroke-[1.5px]' />
        </Link>
      )}
    </div>
  );
};

export default ProfileTopbarButton;
