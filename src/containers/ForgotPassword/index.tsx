import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { EMAIL_REGEX } from 'constant';
import Helmet from 'react-helmet';
import { useAuth } from 'api/hooks/Auth';
import { useSnackbar } from 'api/hooks/Snackbar';

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
  button: {
    marginTop: theme.spacing(2),
  },
}));

type FormData = {
  email: string;
};

const ForgotPassword = () => {
  const classes = useStyles();
  const { forgotPassword } = useAuth();
  const showSnackbar = useSnackbar();
  const { register, errors, handleSubmit, setError } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await forgotPassword(data.email);
      showSnackbar(response.detail, 'success');
    } catch (e) {
      setError('email', e.detail);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Navigation banner={<div className={classes.top} />} fancyNavbar>
      <Helmet>
        <title>Glemt passord</title>
      </Helmet>
      <Paper className={classes.paper}>
        {isLoading && <LinearProgress className={classes.progress} />}
        <TihldeLogo className={classes.logo} darkColor='white' lightColor='blue' size='large' />
        <Typography variant='h3'>Glemt passord</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            disabled={isLoading}
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
          <SubmitButton className={classes.button} disabled={isLoading} errors={errors}>
            Få nytt passord
          </SubmitButton>
          <Button className={classes.button} color='primary' component={Link} disabled={isLoading} fullWidth to={URLS.login}>
            Logg inn
          </Button>
        </form>
      </Paper>
    </Navigation>
  );
};

export default ForgotPassword;
