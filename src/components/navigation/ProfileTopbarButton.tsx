import { useState } from 'react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { useUser } from 'api/hooks/User';
import { useMisc } from 'api/hooks/Misc';

// Material UI Components
import { makeStyles, Theme, Button, IconButton } from '@material-ui/core';

// Assets/Icons
import PersonOutlineIcon from '@material-ui/icons/PersonRounded';
import LightIcon from '@material-ui/icons/WbSunnyRounded';

// Project Components
import Avatar from 'components/miscellaneous/Avatar';
import ThemeSettings from 'components/miscellaneous/ThemeSettings';
import { NavigationOptions } from 'components/navigation/Navigation';

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
  const classes = useStyles(props);
  const { data: user } = useUser();
  const { setLogInRedirectURL } = useMisc();
  const [showThemeSettings, setShowThemeSettings] = useState(false);

  return (
    <div>
      <ThemeSettings onClose={() => setShowThemeSettings(false)} open={showThemeSettings} />
      <IconButton aria-label='Endre tema' className={classes.themeButton} onClick={() => setShowThemeSettings(true)}>
        <LightIcon className={classes.themeSettingsIcon} />
      </IconButton>
      {user ? (
        <Button component={Link} onClick={URLS.profile === location.pathname ? () => location.reload() : undefined} to={URLS.profile}>
          <Avatar className={classes.avatar} user={user} />
        </Button>
      ) : (
        <IconButton className={classes.menuButton} component={Link} onClick={() => setLogInRedirectURL(window.location.pathname)} to={URLS.login}>
          <PersonOutlineIcon />
        </IconButton>
      )}
    </div>
  );
};

export default ProfileTopbarButton;
