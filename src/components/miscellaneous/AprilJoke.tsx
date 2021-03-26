import { useState } from 'react';
import { isToday } from 'date-fns';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Project components
import TihldeLogo from 'components/miscellaneous/TihldeLogo';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999999,
    background: theme.palette.background.default,
    padding: theme.spacing(10, 0, 1),
  },
  content: {
    maxWidth: theme.breakpoints.values.md,
    margin: 'auto',
    display: 'grid',
    gridGap: theme.spacing(2),
    height: '100%',
    gridTemplateRows: 'auto 1fr auto',
  },
  logo: {
    width: '100%',
  },
}));

const STORAGE_NAME = 'april-joke-closed';

const AprilJoke = () => {
  const cookieValue = !sessionStorage.getItem(STORAGE_NAME);
  const isFirstOfApril = isToday(new Date(2021, 3, 1));
  const [display, setDisplay] = useState<boolean>(cookieValue && isFirstOfApril);
  const classes = useStyles();

  const closeDialog = () => {
    setDisplay(false);
    sessionStorage.setItem(STORAGE_NAME, 'true');
  };

  if (!display) {
    return null;
  } else {
    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <div>
            <Typography align='center' variant='subtitle1'>
              Etter en lang og grundig prosess, har vi endelig gleden av å presentere
            </Typography>
            <Typography align='center' variant='h1'>
              TIHLDEs nye logo:
            </Typography>
          </div>
          <TihldeLogo className={classes.logo} darkColor='white' lightColor='blue' size='small' />
          <Button onClick={closeDialog}>Gå til siden</Button>
        </div>
      </div>
    );
  }
};

export default AprilJoke;
