import { MouseEvent as ReactMouseEvent, useState } from 'react';
import { useThemeSettings } from 'context/ThemeContext';
import { ThemeTypes, themesDetails } from 'theme';

// Material-ui
import Modal from '@material-ui/core/Modal';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

// Project components
import Paper from 'components/layout/Paper';

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    position: 'absolute',
    maxWidth: 460,
    minWidth: 320,
    maxHeight: '75%',
    display: 'flex',
    flexDirection: 'column',
    left: '50%',
    top: '50%',
    'overflow-y': 'auto',
    transform: 'translate(-50%,-50%)',
    outline: 'none',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  content: {
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    'overflow-y': 'auto',
  },
  header: {
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(2),
  },
  button: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  group: {
    background: theme.palette.background.smoke,
  },
  groupButton: {
    margin: theme.spacing(0, 1),
    color: theme.palette.text.secondary,
  },
}));

type ThemeSettingsProps = {
  open: boolean;
  onClose: () => void;
};

function ThemeSettings({ open, onClose }: ThemeSettingsProps) {
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
    <Modal onClose={onClose} open={open}>
      <>
        <Paper className={classes.paper} noPadding>
          <div className={classes.content}>
            <Typography className={classes.header} variant='h2'>
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
            <Button className={classes.button} color='primary' onClick={onClose}>
              Lukk
            </Button>
          </div>
        </Paper>
      </>
    </Modal>
  );
}

export default ThemeSettings;
