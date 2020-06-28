import React, {useState, useEffect} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {Link, useHistory} from 'react-router-dom';
import URLS from '../../URLS';

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
  const {classes} = props;
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
    AuthService.logIn(username, password).then((data) => {
      if (data) {
        history.push(redirectURL || URLS.landing);
      } else {
        setErrorMessage(Text.wrongCred);
        setIsLoading(false);
      }
    });
  };

  return (
    <Navigation footer fancyNavbar whitesmoke>
      <div className={classes.root}>
        <div className={classes.top}></div>
        <div className={classes.main}>
          <Paper className={classes.paper}>
            {isLoading && <LinearProgress className={classes.progress} />}
            <img className={classes.logo} src={TIHLDE_LOGO} height='30em' alt='tihlde_logo'/>
            <Typography className={classes.header} variant='h6'>{Text.header}</Typography>
            <form onSubmit={onLogin}>
              <Grid container direction='column'>
                <TextField
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  error={errorMessage !== null}
                  label='Brukernavn'
                  variant='outlined'
                  margin='normal'
                  required/>
                <TextField
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  helperText={errorMessage}
                  error={errorMessage !== null}
                  label='Password'
                  variant='outlined'
                  margin='normal'
                  type='password'
                  required/>
                <Button className={classes.button}
                  variant='contained'
                  color='primary'
                  disabled={isLoading}
                  type='submit'>
                    Logg inn
                </Button>
                <div className={classes.buttonsContainer}>
                  <Button
                    component={Link}
                    to={URLS.forgotPassword}
                    className={classes.button}
                    color='primary'
                    disabled={isLoading}>
                      Glemt passord?
                  </Button>
                  <Button
                    component={Link}
                    to={URLS.signup}
                    className={classes.button}
                    color='primary'
                    disabled={isLoading}>
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

