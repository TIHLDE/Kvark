import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import { Button, Collapse, LinearProgress, MenuItem, Stack, Typography } from '@mui/material';
import { EMAIL_REGEX } from 'constant';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import URLS from 'URLS';

import { UserCreate } from 'types';

import { useConfetti } from 'hooks/Confetti';
import { useStudyGroups, useStudyyearGroups } from 'hooks/Group';
import { useRedirectUrl, useSetRedirectUrl } from 'hooks/Misc';
import { useSnackbar } from 'hooks/Snackbar';
import { useCreateUser } from 'hooks/User';
import { useAnalytics } from 'hooks/Utils';

import Select from 'components/inputs/Select';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import Paper from 'components/layout/Paper';
import { SecondaryTopBox } from 'components/layout/TopBox';
import TihldeLogo from 'components/miscellaneous/TihldeLogo';
import Page from 'components/navigation/Page';

type SignUpData = UserCreate & {
  password_verify: string;
};

const SignUp = () => {
  const { run } = useConfetti();
  const { event } = useAnalytics();
  const { data: studies } = useStudyGroups();
  const { data: studyyears } = useStudyyearGroups();
  const navigate = useNavigate();
  const createUser = useCreateUser();
  const showSnackbar = useSnackbar();
  const { handleSubmit, formState, control, getValues, setError, register } = useForm<SignUpData>();
  const setLogInRedirectURL = useSetRedirectUrl();
  const redirectURL = useRedirectUrl();
  const [faqOpen, setFaqOpen] = useState(false);

  const onSignUp = async (data: SignUpData) => {
    if (data.password !== data.password_verify) {
      setError('password', { message: 'Passordene må være like' });
      setError('password_verify', { message: 'Passordene må være like' });
      return;
    }

    const userData: UserCreate = {
      user_id: data.user_id.toLowerCase(),
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      class: data.class,
      study: data.study,
    };
    createUser.mutate(userData, {
      onSuccess: () => {
        run();
        event('signup', 'auth', `Signed up`);
        setLogInRedirectURL(null);
        navigate(redirectURL || URLS.login);
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  return (
    <Page banner={<SecondaryTopBox />} options={{ title: 'Ny bruker' }}>
      <Paper sx={{ maxWidth: 'md', margin: 'auto', position: 'relative', left: 0, right: 0, top: -60 }}>
        {createUser.isLoading && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}
        <TihldeLogo darkColor='white' lightColor='blue' size='large' sx={{ height: 30, width: 'auto', mb: 1 }} />
        <Typography variant='h3'>Opprett bruker</Typography>
        <Stack component='form' onSubmit={handleSubmit(onSignUp)}>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
            <TextField
              disabled={createUser.isLoading}
              formState={formState}
              label='Fornavn'
              {...register('first_name', { required: 'Feltet er påkrevd' })}
              required
            />
            <TextField
              disabled={createUser.isLoading}
              formState={formState}
              label='Etternavn'
              {...register('last_name', { required: 'Feltet er påkrevd' })}
              required
            />
          </Stack>
          <TextField
            disabled={createUser.isLoading}
            formState={formState}
            helperText='Ditt brukernavn på NTNU'
            label='Feide brukernavn'
            {...register('user_id', { required: 'Feltet er påkrevd', validate: (value) => !value.includes('@') || 'Brukernavn må være uten @stud.ntnu.no' })}
            required
          />
          <TextField
            disabled={createUser.isLoading}
            formState={formState}
            label='E-post'
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
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
            <Select control={control} formState={formState} label='Studie' name='study' required rules={{ required: 'Feltet er påkrevd' }}>
              {studies?.map((study) => (
                <MenuItem key={study.slug} value={study.slug}>
                  {study.name}
                </MenuItem>
              ))}
            </Select>
            <Select
              control={control}
              formState={formState}
              helperText='Hvilket år begynte du på studiet ditt? Hvis du går DigSam: trekk fra 3. Ex.: Du begynte på DigSam i 2022, velg da 2019.'
              label='Kull'
              name='class'
              required
              rules={{ required: 'Feltet er påkrevd' }}>
              {studyyears?.map((study) => (
                <MenuItem key={study.slug} value={study.slug}>
                  {study.name}
                </MenuItem>
              ))}
            </Select>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
            <TextField
              disabled={createUser.isLoading}
              formState={formState}
              label='Passord'
              {...register('password', {
                required: 'Feltet er påkrevd',
                minLength: {
                  value: 8,
                  message: 'Minimum 8 karakterer',
                },
              })}
              required
              type='password'
            />
            <TextField
              disabled={createUser.isLoading}
              formState={formState}
              label='Gjenta passord'
              {...register('password_verify', {
                required: 'Feltet er påkrevd',
                validate: {
                  passordEqual: (value) => value === getValues().password || 'Passordene er ikke like',
                },
              })}
              required
              type='password'
            />
          </Stack>
          <Typography gutterBottom variant='body2'>
            OBS: Når du har klikket &quot;Opprett bruker&quot; må vi godkjenne deg før du får logge inn. Les mer om hvorfor lengre ned.
          </Typography>
          <SubmitButton disabled={createUser.isLoading} formState={formState}>
            Opprett bruker
          </SubmitButton>
          <Button component={Link} disabled={createUser.isLoading} fullWidth sx={{ my: 1 }} to={URLS.login}>
            Logg inn
          </Button>
          <Button endIcon={faqOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />} fullWidth onClick={() => setFaqOpen((oldState) => !oldState)} variant='outlined'>
            Hvorfor må vi godkjenne deg?
          </Button>
          <Collapse in={faqOpen}>
            <Typography variant='body2'>
              {`For å unngå at vi får mange brukere som ikke er reelle TIHLDE-medlemmer, må vi aktivere nye brukere før de får logge inn. Det kan ta noen timer
              før noen av oss i Index eller HS får verifisert brukeren din. Hvis det haster eller tar mer enn 24 timer kan du sende en melding til TIHLDE på `}
              <a href='https://m.me/tihlde' rel='noopener noreferrer' target='_blank'>
                Messenger
              </a>
              .
            </Typography>
          </Collapse>
        </Stack>
      </Paper>
    </Page>
  );
};

export default SignUp;
