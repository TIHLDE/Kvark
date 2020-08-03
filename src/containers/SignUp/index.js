import React, {useState, useEffect} from 'react';
import {useForm, Controller} from 'react-hook-form';
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

  const {handleSubmit, errors, control, setError} = useForm();

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [redirectURL, setRedirectUrl] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setRedirectUrl(MiscService.getLogInRedirectURL());
    MiscService.setLogInRedirectURL(null);
  }, []);

  const onSignUp = (data) => {
    if (isLoading) return;

    if (getUserStudyLong(data.study) === 'Digital samhandling' && ![4, 5].includes(data.userClass)) {
      setError('userClass', {
        type: 'manual',
        message: 'Digital samhandling har kun 4 og 5 klasse',
      });
      return;
    }

    if (!(getUserStudyLong(data.study) === 'Digital samhandling') && [4, 5].includes(data.userClass)) {
      setError('userClass', {
        type: 'manual',
        message: `${getUserStudyLong(data.study)} har ikke 4 og 5 klasse`,
      });
      return;
    }

    if (data.password !== data.passwordVerify) {
      setError('password', {
        type: 'manual',
        message: 'Passordene må være like',
      });
      setError('passwordVerify', {
        type: 'manual',
        message: 'Passordene må være like',
      });
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    const userData = {user_id: data.username.toLowerCase(), first_name: data.firstName, last_name: data.lastName, email: data.email, user_class: data.userClass, user_study: data.study, password: data.password};
    AuthService.createUser(userData).then((data) => {
      if (data) {
        history.push(redirectURL || URLS.login);
      } else {
        setErrorMessage('Feil: Noe gikk galt');
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
            <img className={classes.logo} src={TIHLDE_LOGO} height='30em' alt='tihlde_logo' />
            <Typography className={classes.header} variant='h6'>Opprett bruker</Typography>
            <form onSubmit={handleSubmit(onSignUp)}>
              <Grid container direction='column'>
                <Controller
                  as={TextField}
                  control={control}
                  name="firstName"
                  defaultValue=""
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName?.message}
                  label='Fornavn *'
                  variant='outlined'
                  margin='normal'
                  rules={{required: 'Feltet er påkrevd'}}
                />
                <Controller
                  as={TextField}
                  control={control}
                  defaultValue=""
                  name="lastName"
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName?.message}
                  label='Etternavn *'
                  variant='outlined'
                  margin='normal'
                  rules={{required: 'Feltet er påkrevd'}}
                />
                <Controller
                  as={TextField}
                  control={control}
                  defaultValue=""
                  name="username"
                  error={Boolean(errors.username)}
                  helperText={errors.username?.message}
                  label='NTNU brukernavn *'
                  variant='outlined'
                  margin='normal'
                  rules={{required: 'Feltet er påkrevd', validate: (value) => (!value.includes('@') || 'Brukernavn må være uten @stud.ntnu.no')}}
                />
                <Controller
                  as={TextField}
                  control={control}
                  defaultValue=""
                  name="email"
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  label='E-post *'
                  variant='outlined'
                  margin='normal'
                  type='email'
                  rules={{
                    required: 'Feltet er påkrevd', pattern: {
                      // eslint-disable-next-line no-useless-escape
                      value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: 'Ugyldig e-post',
                    },
                  }}
                />
                <Controller as={TextField} name="study" control={control} defaultValue="" error={Boolean(errors.study)} helperText={errors.study?.message} required label='Studie' variant='outlined' margin='normal' rules={{required: 'Feltet er påkrevd'}} select>
                  {[1, 2, 3, 4, 5].map((i) => <MenuItem key={i} value={i}>{getUserStudyLong(i)}</MenuItem>)}
                </Controller>
                <Controller as={TextField} name="userClass" control={control} defaultValue="" error={Boolean(errors.userClass)} helperText={errors.userClass?.message} required label='Klasse' variant='outlined' margin='normal' rules={{required: 'Feltet er påkrevd'}} select>
                  {[1, 2, 3, 4, 5].map((i) => <MenuItem key={i} value={i}>{getUserClass(i)}</MenuItem>)}
                </Controller>
                <Controller
                  as={TextField}
                  control={control}
                  defaultValue=""
                  helperText={errors.password?.message}
                  error={Boolean(errors.password)}
                  name="password"
                  label='Passord *'
                  variant='outlined'
                  margin='normal'
                  type='password'
                  rules={{
                    required: 'Feltet er påkrevd', minLength: {
                      value: 8,
                      message: 'Minimum 8 karakterer',
                    },
                  }}
                />
                <Controller
                  as={TextField}
                  control={control}
                  defaultValue=""
                  helperText={errors.passwordVerify?.message}
                  error={Boolean(errors.passwordVerify)}
                  name="passwordVerify"
                  label='Gjenta passord *'
                  variant='outlined'
                  margin='normal'
                  type='password'
                  rules={{
                    required: 'Feltet er påkrevd', minLength: {
                      value: 8,
                      message: 'Minimum 8 karakterer',
                    },
                  }}
                />
                <Typography color="error">{errorMessage}</Typography>

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
