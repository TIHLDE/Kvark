import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'makeStyles';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import URLS from 'URLS';

import { useRedirectUrl, useSetRedirectUrl } from 'hooks/Misc';
import { useLogin } from 'hooks/User';
import { useAnalytics } from 'hooks/Utils';

import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import Paper from 'components/layout/Paper';
import { SecondaryTopBox } from 'components/layout/TopBox';
import TihldeLogo from 'components/miscellaneous/TihldeLogo';
import Page from 'components/navigation/Page';

const useStyles = makeStyles()((theme) => ({
  paper: {
    maxWidth: theme.breakpoints.values.sm,
    margin: 'auto',
    position: 'relative',
    overflow: 'hidden',
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
    top: -1,
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
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { event } = useAnalytics();
  const logIn = useLogin();
  const setLogInRedirectURL = useSetRedirectUrl();
  const redirectURL = useRedirectUrl();
  const { register, formState, handleSubmit, setError } = useForm<LoginData>();

  const onLogin = async (data: LoginData) => {
    logIn.mutate(
      { username: data.username, password: data.password },
      {
        onSuccess: () => {
          event('login', 'auth', `Logged in`);
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
    <Page banner={<SecondaryTopBox />} options={{ title: 'Logg inn' }}>
      <Paper className={classes.paper}>
        {logIn.isLoading && <LinearProgress className={classes.progress} />}
        <TihldeLogo className={classes.logo} darkColor='white' lightColor='blue' size='large' />
        <Typography variant='h3'>Logg inn</Typography>
        <form onSubmit={handleSubmit(onLogin)}>
          <TextField
            disabled={logIn.isLoading}
            formState={formState}
            label='Brukernavn'
            {...register('username', {
              required: 'Feltet er påkrevd',
              validate: (value: string) => (value.includes('@') ? 'Bruk Feide-brukernavn, ikke epost' : undefined),
            })}
            required
          />
          <TextField
            disabled={logIn.isLoading}
            formState={formState}
            label='Passord'
            {...register('password', { required: 'Feltet er påkrevd' })}
            required
            type='password'
          />
          <SubmitButton className={classes.button} disabled={logIn.isLoading} formState={formState}>
            Logg inn
          </SubmitButton>
          <div className={classes.buttons}>
            <Button className={classes.button} component={Link} disabled={logIn.isLoading} fullWidth to={URLS.forgotPassword}>
              Glemt passord?
            </Button>
            <Button className={classes.button} component={Link} disabled={logIn.isLoading} fullWidth to={URLS.signup}>
              Opprett bruker
            </Button>
          </div>
        </form>
      </Paper>
    </Page>
  );
};

export default LogIn;
