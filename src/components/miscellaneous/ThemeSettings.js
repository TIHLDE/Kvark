import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import COOKIE from '../../api/cookie';
import { THEME, THEME_OPTIONS } from '../../settings';
import ThemeStore from '../../themeStore';
import GA from '../../analytics';

// Material-ui
import Modal from '@material-ui/core/Modal';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

// Icons
import DarkIcon from '@material-ui/icons/Brightness2Outlined';
import DeviceIcon from '@material-ui/icons/DevicesOutlined';
import LightIcon from '@material-ui/icons/WbSunnyOutlined';

// Project components
import Paper from '../layout/Paper';

const style = (theme) => ({
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
    '@media only screen and (max-width: 400px)': {
      width: '100%',
    },
  },
  content: {
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    'overflow-y': 'auto',
  },
  header: {
    color: theme.colors.text.main,
    marginBottom: 15,
  },
  button: {
    width: '100%',
    marginTop: 20,
  },
  group: {
    background: theme.colors.background.smoke,
  },
  groupButton: {
    margin: '0 12px',
    color: theme.colors.text.light,
  },
});

const ThemeSettings = (props) => {
  const { classes, open, onClose } = props;
  const themeStore = useContext(ThemeStore);

  let cookieValue = COOKIE.get(THEME);
  if (cookieValue === undefined) {
    cookieValue = THEME_OPTIONS.automatic;
    COOKIE.set(THEME, cookieValue);
  }
  const [themeName, setThemeName] = useState(cookieValue);

  const changeTheme = (e, newThemeName) => {
    if (newThemeName) {
      setThemeName(newThemeName);
      themeStore.theme.set(newThemeName);
      COOKIE.set(THEME, newThemeName);
      GA.event('Theme', 'Change theme to ' + newThemeName);
    }
  };

  return (
    <Modal onClose={onClose} open={open}>
      <>
        <Paper className={classes.paper} noPadding>
          <div className={classes.content}>
            <Typography className={classes.header} variant='h4'>
              Tema
            </Typography>
            <ToggleButtonGroup aria-label='Tema' className={classes.group} exclusive onChange={changeTheme} orientation='vertical' value={themeName}>
              <ToggleButton aria-label='Lyst tema' value={THEME_OPTIONS.light}>
                <LightIcon />
                <Typography className={classes.groupButton} variant='subtitle2'>
                  Lyst
                </Typography>
              </ToggleButton>
              <ToggleButton aria-label='Enhetsinnstilling' value={THEME_OPTIONS.automatic}>
                <DeviceIcon />
                <Typography className={classes.groupButton} variant='subtitle2'>
                  Automatisk
                </Typography>
              </ToggleButton>
              <ToggleButton aria-label='Mørkt tema' value={THEME_OPTIONS.dark}>
                <DarkIcon />
                <Typography className={classes.groupButton} variant='subtitle2'>
                  Mørkt
                </Typography>
              </ToggleButton>
            </ToggleButtonGroup>
            <Button align='center' className={classes.button} color='primary' onClick={onClose}>
              Lukk
            </Button>
          </div>
        </Paper>
      </>
    </Modal>
  );
};

ThemeSettings.propTypes = {
  classes: PropTypes.object,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

export default withStyles(style)(ThemeSettings);
