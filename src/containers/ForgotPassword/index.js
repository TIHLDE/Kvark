import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import URLS from '../../URLS';
import Helmet from 'react-helmet';

// Service and action imports
import AuthService from '../../api/services/AuthService';

// Material UI Components
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

// Icons
import TIHLDE_LOGO from '../../assets/img/TIHLDE_LOGO_B.png';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import Paper from '../../components/layout/Paper';

const styles = (theme) => ({
  root: {
    minHeight: '100vh',
    width: '100%',
  },
  top: {
    height: 220,
    background: 'radial-gradient(circle at bottom, ' + theme.colors.gradient.secondary.top + ', ' + theme.colors.gradient.secondary.bottom + ')',
  },
  main: {
    maxWidth: 1000,
    margin: 'auto',
    position: 'relative',
  },
  paper: {
    width: '90%',
    maxWidth: 460,
    margin: 'auto',
    position: 'relative',
    left: 0, right: 0,
    top: '-60px',
  },
  logo: {
    height: '32px',
    maxHeight: '32px !important',
    margin: 'auto',
    display: 'block',
    marginBottom: 10,
  },
  header: {
    color: theme.colors.text.main,
  },
  progress: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
  },
  button: {
    marginTop: 16,
    width: '100%',
  },
  snackbar: {
    marginTop: 55,
    backgroundColor: theme.colors.background.smoke,
    color: theme.colors.text.main,
  },
});

function ForgotPassword(props) {
  const {classes} = props;
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackMessage, setSnackMessage] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(null);

  useEffect(() => window.scrollTo(0, 0), []);

  useEffect(() => setErrorMessage(null), [email]);

  const onSubmit = (event) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    AuthService.forgotPassword(email).then((data) => {
      if (data) {
        setSnackMessage('Vi har sendt en link til eposten din der du kan opprette et nytt passord');
      } else {
        setSnackMessage(null);
        setErrorMessage('Vi fant ingen brukere med denne eposten');
      }
      setShowSnackbar(true);
      setIsLoading(false);
    });
  };

  return (
    <Navigation footer fancyNavbar whitesmoke>
      <Helmet>
        <title>Glemt passord - TIHLDE</title>
      </Helmet>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={() => setShowSnackbar(false)}>
        <SnackbarContent
          className={classes.snackbar}
          message={snackMessage}/>
      </Snackbar>
      <div className={classes.root}>
        <div className={classes.top}></div>
        <div className={classes.main}>
          <Paper className={classes.paper}>
            {isLoading && <LinearProgress className={classes.progress} />}
            <img className={classes.logo} src={TIHLDE_LOGO} height='30em' alt='tihlde_logo'/>
            <Typography className={classes.header} variant='h6'>Glemt passord</Typography>
            <form onSubmit={onSubmit}>
              <Grid container direction='column'>
                <TextField
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  error={errorMessage !== null}
                  label='Epost'
                  variant='outlined'
                  margin='normal'
                  helperText={errorMessage}
                  type='email'
                  required/>
                <Button className={classes.button}
                  variant='contained'
                  color='primary'
                  disabled={isLoading}
                  type='submit'>
                  Få nytt passord
                </Button>
                <Button
                  component={Link}
                  to={URLS.login}
                  className={classes.button}
                  color='primary'
                  disabled={isLoading}>
                  Logg inn
                </Button>
              </Grid>
            </form>
          </Paper>
        </div>
      </div>
    </Navigation>
  );
}

ForgotPassword.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(ForgotPassword);

