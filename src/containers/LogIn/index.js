import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import URLS from '../../URLS';
import Helmet from 'react-helmet';

// Service and action imports
import AuthService from '../../api/services/AuthService';
import MiscService from '../../api/services/MiscService';

// Text imports
import Text from '../../text/LogInText';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

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
    height: '32px',
    maxHeight: '32px !important',
    margin: 'auto',
    display: 'block',
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
  buttonsContainer: {
    display: 'flex',
    height: 52,
  },
  button: {
    marginTop: 16,
    width: '100%',
  },
});

function LogIn(props) {
  const { classes } = props;
  const history = useHistory();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [redirectURL, setRedirectUrl] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setRedirectUrl(MiscService.getLogInRedirectURL());
    MiscService.setLogInRedirectURL(null);
  }, []);

  useEffect(() => setErrorMessage(null), [username, password]);

  const onLogin = (event) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    AuthService.logIn(username, password)
      .then((data) => {
        if (data) {
          history.push(redirectURL || URLS.landing);
        }
      })
      .catch((err) => {
        setErrorMessage(err.detail);
        setIsLoading(false);
      });
  };

  return (
    <Navigation fancyNavbar footer whitesmoke>
      <Helmet>
        <title>Logg inn - TIHLDE</title>
      </Helmet>
      <div className={classes.root}>
        <div className={classes.top}></div>
        <div className={classes.main}>
          <Paper className={classes.paper}>
            {isLoading && <LinearProgress className={classes.progress} />}
            <img alt='tihlde_logo' className={classes.logo} height='30em' src={TIHLDE_LOGO} />
            <Typography className={classes.header} variant='h6'>
              {Text.header}
            </Typography>
            <form onSubmit={onLogin}>
              <Grid container direction='column'>
                <TextField
                  error={errorMessage !== null}
                  label='Brukernavn'
                  margin='normal'
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  value={username}
                  variant='outlined'
                />
                <TextField
                  error={errorMessage !== null}
                  helperText={errorMessage}
                  label='Password'
                  margin='normal'
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  type='password'
                  value={password}
                  variant='outlined'
                />
                <Button className={classes.button} color='primary' disabled={isLoading} type='submit' variant='contained'>
                  Logg inn
                </Button>
                <div className={classes.buttonsContainer}>
                  <Button className={classes.button} color='primary' component={Link} disabled={isLoading} to={URLS.forgotPassword}>
                    Glemt passord?
                  </Button>
                  <Button className={classes.button} color='primary' component={Link} disabled={isLoading} to={URLS.signup}>
                    Opprett bruker
                  </Button>
                </div>
              </Grid>
            </form>
          </Paper>
        </div>
      </div>
    </Navigation>
  );
}

LogIn.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(LogIn);
