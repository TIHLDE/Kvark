import React, { useState } from 'react';
import { useTheme } from 'context/ThemeContext';
import { ThemeType } from 'types/Enums';
import GA from 'analytics';

// Material-ui
import Modal from '@material-ui/core/Modal';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

// Icons
import DarkIcon from '@material-ui/icons/Brightness2Outlined';
import DeviceIcon from '@material-ui/icons/DevicesOutlined';
import LightIcon from '@material-ui/icons/WbSunnyOutlined';

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
    color: theme.palette.colors.text.main,
    marginBottom: theme.spacing(2),
  },
  button: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  group: {
    background: theme.palette.colors.background.smoke,
  },
  groupButton: {
    margin: theme.spacing(0, 1),
    color: theme.palette.colors.text.light,
  },
}));

type ThemeSettingsProps = {
  open: boolean;
  onClose: () => void;
};

function ThemeSettings({ open, onClose }: ThemeSettingsProps) {
  const theme = useTheme();
  const [themeName, setThemeName] = useState(theme.getEnum());
  const classes = useStyles();

  const changeTheme = (e: React.MouseEvent<HTMLElement, MouseEvent>, newThemeName: ThemeType) => {
    if (newThemeName) {
      setThemeName(newThemeName);
      theme.set(newThemeName);
      GA.event('Theme', 'Change theme to ' + newThemeName);
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
              <ToggleButton aria-label='Lyst tema' value={ThemeType.LIGHT}>
                <LightIcon />
                <Typography className={classes.groupButton} variant='subtitle2'>
                  Lyst
                </Typography>
              </ToggleButton>
              <ToggleButton aria-label='Enhetsinnstilling' value={ThemeType.AUTOMATIC}>
                <DeviceIcon />
                <Typography className={classes.groupButton} variant='subtitle2'>
                  Automatisk
                </Typography>
              </ToggleButton>
              <ToggleButton aria-label='Mørkt tema' value={ThemeType.DARK}>
                <DarkIcon />
                <Typography className={classes.groupButton} variant='subtitle2'>
                  Mørkt
                </Typography>
              </ToggleButton>
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
