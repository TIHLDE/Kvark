import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getCookie, setCookie } from '../../api/cookie';
import { ACCEPTED_ANALYTICS } from '../../settings';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Style
const style = (theme) => ({
  root: {
    position: 'sticky',
    bottom: 0,
    zIndex: 999,
    backgroundColor: theme.palette.colors.background.main,
    width: '100%',
    height: 'auto',
    padding: 15,
    display: 'flex',
    '@media only screen and (max-width: 700px)': {
      flexDirection: 'column',
    },
  },
  button: {
    minWidth: '15vw',
    maxHeight: 45,
    marginLeft: 15,
    '@media only screen and (max-width: 700px)': {
      minWidth: '100%',
      marginLeft: 0,
      marginTop: 15,
    },
  },
  text: {
    flexGrow: 1,
    color: theme.palette.colors.text.main,
  },
});

const MessageGDPR = (props) => {
  const { classes } = props;
  const cookieValue = !getCookie(ACCEPTED_ANALYTICS);
  const [displayState, setDisplayState] = useState(cookieValue);

  const closeDialog = () => {
    setDisplayState(false);
    setCookie(ACCEPTED_ANALYTICS, true, 3600 * 24000 * 365);
  };

  return (
    <React.Fragment>
      {displayState && (
        <div className={classes.root}>
          <Typography className={classes.text}>
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
};

MessageGDPR.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(style)(MessageGDPR);
