import React, { useState } from 'react';
// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { getCookie, setCookie } from 'api/cookie';
import { ACCEPTED_ANALYTICS } from 'settings';
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'sticky',
    bottom: 0,
    zIndex: 999,
    backgroundColor: theme.palette.colors.background.main,
    width: '100%',
    height: 'auto',
    padding: theme.spacing(2),
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  button: {
    minWidth: '15vw',
    maxHeight: 45,
    marginLeft: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      minWidth: '100%',
      marginLeft: theme.spacing(0),
      marginTop: theme.spacing(2),
    },
  },
  text: {
    flexGrow: 1,
    color: theme.palette.colors.text.main,
  },
}));

function MessageGDPR() {
  const cookieValue = !getCookie(ACCEPTED_ANALYTICS);
  const [displayState, setDisplayState] = useState<boolean>(cookieValue);
  const classes = useStyles();

  const closeDialog = () => {
    setDisplayState(false);
    setCookie(ACCEPTED_ANALYTICS, 'true', 3600 * 24000 * 365);
  };

  return (
    <React.Fragment>
      {displayState && (
        <div className={classes.root}>
          <Typography className={classes.text} variant='body1'>
            Denne nettsiden bruker Google Analytics for å forbedre hvordan siden brukes. Ved å fortsette å bruke denne siden godtar du Googles bruk av denne
            informasjonen som angitt{' '}
            <a href='https://policies.google.com/technologies/partner-sites?hl=no' rel='noopener noreferrer' target='_blank'>
              her
            </a>
            . Du godtar også bruk av informasjonskapsler.
          </Typography>
          <Button
            className={classes.button}
            color='primary'
            onClick={() => {
              closeDialog();
            }}
            variant='contained'>
            Ok
          </Button>
        </div>
      )}
    </React.Fragment>
  );
}

export default MessageGDPR;
