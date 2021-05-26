import { MouseEvent as ReactMouseEvent, useState } from 'react';
import { useThemeSettings } from 'context/ThemeContext';
import { ThemeTypes, themesDetails } from 'theme';

// Material-ui
import { makeStyles, Typography } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

// Project components
import Dialog from 'components/layout/Dialog';

const useStyles = makeStyles((theme) => ({
  group: {
    background: theme.palette.background.smoke,
    width: '100%',
  },
  groupButton: {
    margin: theme.spacing(0, 1),
    color: theme.palette.text.secondary,
  },
}));

export type ThemeSettingsProps = {
  open: boolean;
  onClose: () => void;
};

const ThemeSettings = ({ open, onClose }: ThemeSettingsProps) => {
  const themeSettings = useThemeSettings();
  const [themeName, setThemeName] = useState(themeSettings.getThemeFromStorage());
  const classes = useStyles();

  const changeTheme = (e: ReactMouseEvent<HTMLElement, MouseEvent>, newThemeName: ThemeTypes) => {
    if (newThemeName) {
      setThemeName(newThemeName);
      themeSettings.set(newThemeName);
      window.gtag('event', 'theme-switch', {
        event_category: 'theme',
        event_label: newThemeName,
      });
    }
  };

  return (
    <Dialog maxWidth='sm' onClose={onClose} open={open}>
      <Typography align='center' gutterBottom variant='h2'>
        Tema
      </Typography>
      <ToggleButtonGroup aria-label='Tema' className={classes.group} exclusive onChange={changeTheme} orientation='vertical' value={themeName}>
        {themesDetails.map((theme) => (
          <ToggleButton aria-label={theme.name} key={theme.key} value={theme.key}>
            <theme.icon />
            <Typography className={classes.groupButton} variant='subtitle2'>
              {theme.name}
            </Typography>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Dialog>
  );
};

export default ThemeSettings;
