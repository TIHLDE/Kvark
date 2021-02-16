import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Helmet from 'react-helmet';
import URLS from 'URLS';
import { useLogin } from 'api/hooks/User';
import { useMisc } from 'api/hooks/Misc';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

// Project Components
import Navigation from 'components/navigation/Navigation';
import Paper from 'components/layout/Paper';
import TihldeLogo from 'components/miscellaneous/TihldeLogo';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';

const useStyles = makeStyles((theme) => ({
  top: {
    height: 220,
    background: `radial-gradient(circle at bottom, ${theme.palette.colors.gradient.secondary.top}, ${theme.palette.colors.gradient.secondary.bottom})`,
  },
  paper: {
    maxWidth: theme.breakpoints.values.sm,
    margin: 'auto',
    position: 'relative',
    left: 0,
    right: 0,
    top: -60,
  },
  logo: {
    height: 30,
    width: 'auto',
    marginBottom: theme.spacing(1),
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  buttons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

type LoginData = {
  username: string;
  password: string;
};

const LogIn = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const logIn = useLogin();
  const { setLogInRedirectURL, getLogInRedirectURL } = useMisc();
  const { register, errors, handleSubmit, setError } = useForm<LoginData>();

  const onLogin = async (data: LoginData) => {
    logIn.mutate(
      { username: data.username, password: data.password },
      {
        onSuccess: () => {
          const redirectURL = getLogInRedirectURL();
          setLogInRedirectURL(null);
          navigate(redirectURL || URLS.landing);
        },
        onError: (e) => {
          setError('password', { message: e.detail || 'Noe gikk galt' });
        },
      },
    );
  };

  return (
    <Navigation banner={<div className={classes.top} />} fancyNavbar>
      <Helmet>
        <title>Logg inn</title>
      </Helmet>
      <Paper className={classes.paper}>
        {logIn.isLoading && <LinearProgress className={classes.progress} />}
        <TihldeLogo className={classes.logo} darkColor='white' lightColor='blue' size='large' />
        <Typography variant='h3'>Logg inn</Typography>
        <form onSubmit={handleSubmit(onLogin)}>
          <TextField
            disabled={logIn.isLoading}
            errors={errors}
            label='Brukernavn'
            name='username'
            register={register}
            required
            rules={{
              required: 'Feltet er påkrevd',
              validate: (value: string) => (value.includes('@') ? 'Bruk Feide-brukernavn, ikke epost' : undefined),
            }}
          />
          <TextField
            disabled={logIn.isLoading}
            errors={errors}
            label='Passord'
            name='password'
            register={register}
            required
            rules={{ required: 'Feltet er påkrevd' }}
            type='password'
          />
          <SubmitButton className={classes.button} disabled={logIn.isLoading} errors={errors}>
            Logg inn
          </SubmitButton>
          <div className={classes.buttons}>
            <Button className={classes.button} color='primary' component={Link} disabled={logIn.isLoading} fullWidth to={URLS.forgotPassword}>
              Glemt passord?
            </Button>
            <Button className={classes.button} color='primary' component={Link} disabled={logIn.isLoading} fullWidth to={URLS.signup}>
              Opprett bruker
            </Button>
          </div>
        </form>
      </Paper>
    </Navigation>
  );
};

export default LogIn;
