import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import URLS from '../../URLS';
import Helmet from 'react-helmet';

// Service and action imports
import { useAuth } from '../../api/hooks/Auth';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import Paper from '../../components/layout/Paper';
import TihldeLogo from '../../components/miscellaneous/TihldeLogo';

const styles = (theme) => ({
  root: {
    minHeight: '100vh',
    width: '100%',
  },
  top: {
    height: 220,
    background:
      'radial-gradient(circle at bottom, ' + theme.palette.colors.gradient.secondary.top + ', ' + theme.palette.colors.gradient.secondary.bottom + ')',
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
    left: 0,
    right: 0,
    top: '-60px',
  },
  logo: {
    height: 30,
    width: 'auto',
    marginBottom: 10,
  },
  header: {
    color: theme.palette.colors.text.main,
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  button: {
    marginTop: 16,
    width: '100%',
  },
  snackbar: {
    marginTop: 55,
    backgroundColor: theme.palette.colors.background.smoke,
    color: theme.palette.colors.text.main,
  },
});

function ForgotPassword(props) {
  const { classes } = props;
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackMessage, setSnackMessage] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(null);

  useEffect(() => setErrorMessage(null), [email]);

  const onSubmit = (event) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    forgotPassword(email)
      .then((data) => {
        setSnackMessage(data.detail);
      })
      .catch((error) => {
        setSnackMessage(null);
        setErrorMessage(error.detail);
      })
      .finally(() => {
        setShowSnackbar(true);
        setIsLoading(false);
      });
  };

  return (
    <Navigation fancyNavbar whitesmoke>
      <Helmet>
        <title>Glemt passord - TIHLDE</title>
      </Helmet>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        open={showSnackbar}>
        <SnackbarContent className={classes.snackbar} message={snackMessage} />
      </Snackbar>
      <div className={classes.root}>
        <div className={classes.top}></div>
        <div className={classes.main}>
          <Paper className={classes.paper}>
            {isLoading && <LinearProgress className={classes.progress} />}
            <TihldeLogo className={classes.logo} darkColor='white' lightColor='blue' size='large' />
            <Typography className={classes.header} variant='h6'>
              Glemt passord
            </Typography>
            <form onSubmit={onSubmit}>
              <Grid container direction='column'>
                <TextField
                  error={errorMessage !== null}
                  helperText={errorMessage}
                  label='Epost'
                  margin='normal'
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type='email'
                  value={email}
                  variant='outlined'
                />
                <Button className={classes.button} color='primary' disabled={isLoading} type='submit' variant='contained'>
                  Få nytt passord
                </Button>
                <Button className={classes.button} color='primary' component={Link} disabled={isLoading} to={URLS.login}>
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
