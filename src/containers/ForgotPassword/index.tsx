import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { EMAIL_REGEX } from 'constant';
import { useForgotPassword } from 'api/hooks/User';
import { useSnackbar } from 'api/hooks/Snackbar';

// Material UI Components
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

// Project Components
import Page from 'components/navigation/Page';
import Paper from 'components/layout/Paper';
import TihldeLogo from 'components/miscellaneous/TihldeLogo';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import { SecondaryTopBox } from 'components/layout/TopBox';

const useStyles = makeStyles((theme) => ({
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
  const classes = useStyles();
  const forgotPassword = useForgotPassword();
  const showSnackbar = useSnackbar();
  const { register, errors, handleSubmit, setError } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    forgotPassword.mutate(data.email, {
      onSuccess: (data) => {
        showSnackbar(data.detail, 'success');
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
        <TihldeLogo className={classes.logo} darkColor='white' lightColor='blue' size='large' />
        <Typography variant='h3'>Glemt passord</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            disabled={forgotPassword.isLoading}
            errors={errors}
            label='Epost'
            name='email'
            register={register}
            required
            rules={{
              required: 'Feltet er påkrevd',
              pattern: {
                value: EMAIL_REGEX,
                message: 'Ugyldig e-post',
              },
            }}
            type='email'
          />
          <SubmitButton className={classes.button} disabled={forgotPassword.isLoading} errors={errors}>
            Få nytt passord
          </SubmitButton>
          <Button className={classes.button} color='primary' component={Link} disabled={forgotPassword.isLoading} fullWidth to={URLS.login}>
            Logg inn
          </Button>
        </form>
      </Paper>
    </Page>
  );
};

export default ForgotPassword;
