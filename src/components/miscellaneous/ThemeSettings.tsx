import { styled, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { MouseEvent as ReactMouseEvent, useState } from 'react';
import { themesDetails, ThemeTypes } from 'theme';

import { useThemeSettings } from 'hooks/Theme';
import { useAnalytics } from 'hooks/Utils';

import Dialog from 'components/layout/Dialog';

const ThemeDialog = styled(Dialog)({
  '& .MuiPaper-root': {
    maxWidth: '250px',
  },
});
const ButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  background: theme.palette.background.smoke,
}));
const ButtonText = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  color: theme.palette.text.secondary,
}));

export type ThemeSettingsProps = {
  open: boolean;
  onClose: () => void;
};

const ThemeSettings = ({ open, onClose }: ThemeSettingsProps) => {
  const { event } = useAnalytics();
  const themeSettings = useThemeSettings();
  const [themeName, setThemeName] = useState(themeSettings.getThemeFromStorage());

  const changeTheme = (e: ReactMouseEvent<HTMLElement, MouseEvent>, newThemeName: ThemeTypes) => {
    if (newThemeName) {
      setThemeName(newThemeName);
      themeSettings.set(newThemeName);
      event('switch', 'theme', newThemeName);
    }
  };

  return (
    <ThemeDialog maxWidth={false} onClose={onClose} open={open}>
      <Typography align='center' gutterBottom variant='h2'>
        Tema
      </Typography>
      <ButtonGroup aria-label='Tema' exclusive fullWidth onChange={changeTheme} orientation='vertical' value={themeName}>
        {themesDetails.map((theme) => (
          <ToggleButton aria-label={theme.name} key={theme.key} value={theme.key}>
            <theme.icon />
            <ButtonText variant='subtitle2'>{theme.name}</ButtonText>
          </ToggleButton>
        ))}
      </ButtonGroup>
    </ThemeDialog>
  );
};

export default ThemeSettings;
