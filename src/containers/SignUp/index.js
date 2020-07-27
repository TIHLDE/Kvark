import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Link, useHistory} from 'react-router-dom';
import URLS from '../../URLS';
import {getUserStudyLong, getUserClass} from '../../utils';
import Helmet from 'react-helmet';

// Service and action imports
import AuthService from '../../api/services/AuthService';
import MiscService from '../../api/services/MiscService';

// Material UI Components
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';

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
    height: 32,
    maxHeight: '32px !important',
    margin: 'auto',
    display: 'block',
    marginBottom: 10,
  },
  header: {
    color: theme.colors.text.main,
  },
  button: {
    marginTop: 16,
    width: '100%',
  },
  progress: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
  },
});

function SignUp(props) {
  const {classes} = props;
  const history = useHistory();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [userClass, setUserClass] = useState(1);
  const [study, setStudy] = useState(1);
  const [em, setEm] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [redirectURL, setRedirectUrl] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setRedirectUrl(MiscService.getLogInRedirectURL());
    MiscService.setLogInRedirectURL(null);
  }, []);

  useEffect(() => setErrorMessage(null), [firstName, lastName, username, email, userClass, study, em, password, passwordVerify]);

  const onSignUp = (event) => {
    event.preventDefault();

    if (isLoading) return;

    if (password !== passwordVerify) {
      setErrorMessage('Passordene må være like!');
      return;
    }
    if (username.includes('@')) {
      setErrorMessage('Brukernavn må være uten @stud.ntnu.no');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    const userData = {user_id: username.toLowerCase(), first_name: firstName, last_name: lastName, email: email, user_class: userClass, user_study: study, vipps_transaction_id: 0, em_nr: em, password: password};
    AuthService.createUser(userData).then((data) => {
      if (data) {
        history.push(redirectURL || URLS.login);
      } else {
        setErrorMessage('Noe gikk galt');
        setIsLoading(false);
      }
    });
  };

  return (
    <Navigation footer fancyNavbar whitesmoke>
      <Helmet>
        <title>Ny bruker - TIHLDE</title>
      </Helmet>
      <div className={classes.root}>
        <div className={classes.top}></div>
        <div className={classes.main}>
          <Paper className={classes.paper}>
            {isLoading && <LinearProgress className={classes.progress} />}
            <img className={classes.logo} src={TIHLDE_LOGO} height='30em' alt='tihlde_logo'/>
            <Typography className={classes.header} variant='h6'>Opprett bruker</Typography>
            <form onSubmit={onSignUp}>
              <Grid container direction='column'>
                <TextField
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  error={errorMessage !== null}
                  label='Fornavn'
                  variant='outlined'
                  margin='normal'
                  required/>
                <TextField
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  error={errorMessage !== null}
                  label='Etternavn'
                  variant='outlined'
                  margin='normal'
                  required/>
                <TextField
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  error={errorMessage !== null}
                  label='NTNU brukernavn'
                  variant='outlined'
                  margin='normal'
                  required/>
                <TextField
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  error={errorMessage !== null}
                  label='Epost'
                  variant='outlined'
                  margin='normal'
                  type='email'
                  required/>
                <TextField required label='Studie' variant='outlined' margin='normal' onChange={(e) => setStudy(e.target.value)} value={study} select>
                  {[1, 2, 3, 4, 5].map((i) => <MenuItem key={i} value={i}>{getUserStudyLong(i)}</MenuItem>)}
                </TextField>
                <TextField required label='Klasse' variant='outlined' margin='normal' onChange={(e) => setUserClass(e.target.value)} value={userClass} select>
                  {[1, 2, 3, 4, 5].map((i) => <MenuItem key={i} value={i}>{getUserClass(i)}</MenuItem>)}
                </TextField>
                <TextField
                  onChange={(e) => setEm(e.target.value)}
                  value={em}
                  error={errorMessage !== null}
                  label='EM-nummer (studentkortet)'
                  variant='outlined'
                  margin='normal'
                  required/>
                <TextField
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  helperText={errorMessage}
                  error={errorMessage !== null}
                  label='Passord'
                  variant='outlined'
                  margin='normal'
                  type='password'
                  required/>
                <TextField
                  onChange={(e) => setPasswordVerify(e.target.value)}
                  value={passwordVerify}
                  helperText={errorMessage}
                  error={errorMessage !== null}
                  label='Gjenta passord'
                  variant='outlined'
                  margin='normal'
                  type='password'
                  required/>
                <Button className={classes.button}
                  variant='contained'
                  color='primary'
                  disabled={isLoading}
                  type='submit'>
                  Opprett bruker
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

SignUp.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(SignUp);
