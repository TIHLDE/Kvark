import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { EMAIL_REGEX } from 'constant';
import { makeStyles } from 'makeStyles';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import URLS from 'URLS';

import { useSnackbar } from 'hooks/Snackbar';
import { useForgotPassword } from 'hooks/User';
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
  button: {
    marginTop: theme.spacing(2),
  },
}));

type FormData = {
  email: string;
};

const ForgotPassword = () => {
  const { classes } = useStyles();
  const { event } = useAnalytics();
  const forgotPassword = useForgotPassword();
  const showSnackbar = useSnackbar();
  const { register, formState, handleSubmit, setError } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    forgotPassword.mutate(data.email, {
      onSuccess: (data) => {
        showSnackbar(data.detail, 'success');
        event('forgot-password', 'auth', 'Forgot password');
      },
      onError: (e) => {
        setError('email', { message: e.detail });
      },
    });
  };

  return (
    <Page banner={<SecondaryTopBox />} options={{ title: 'Glemt passord' }}>
      <Paper className={classes.paper}>
        {forgotPassword.isLoading && <LinearProgress className={classes.progress} />}
        <TihldeLogo className={classes.logo} size='large' />
        <Typography variant='h3'>Glemt passord</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            disabled={forgotPassword.isLoading}
            formState={formState}
            label='Epost'
            {...register('email', {
              required: 'Feltet er påkrevd',
              pattern: {
                value: EMAIL_REGEX,
                message: 'Ugyldig e-post',
              },
            })}
            required
            type='email'
          />
          <SubmitButton className={classes.button} disabled={forgotPassword.isLoading} formState={formState}>
            Få nytt passord
          </SubmitButton>
          <Button className={classes.button} component={Link} disabled={forgotPassword.isLoading} fullWidth to={URLS.login}>
            Logg inn
          </Button>
        </form>
      </Paper>
    </Page>
  );
};

export default ForgotPassword;
