import { useState } from 'react';
import { getCookie, setCookie } from 'api/cookie';
import { ACCEPTED_ANALYTICS } from 'constant';

// Material UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Project components
import Paper from 'components/layout/Paper';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: theme.breakpoints.values.lg,
    padding: theme.spacing(2),
    margin: '0 auto',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.snackbar,
    [theme.breakpoints.down('md')]: {
      bottom: theme.spacing(10),
    },
  },
  paper: {
    display: 'grid',
    gridGap: theme.spacing(2),
    gridTemplateColumns: '1fr auto',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
  button: {
    minWidth: 150,
  },
}));

const MessageGDPR = () => {
  const cookieValue = !getCookie(ACCEPTED_ANALYTICS);
  const [display, setDisplay] = useState<boolean>(cookieValue);
  const classes = useStyles();

  const closeDialog = () => {
    setDisplay(false);
    setCookie(ACCEPTED_ANALYTICS, 'true', 3600 * 24000 * 365);
  };

  if (!display) {
    return null;
  } else {
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant='body1'>
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
        </Paper>
      </div>
    );
  }
};

export default MessageGDPR;
