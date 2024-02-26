import { Rowing } from '@mui/icons-material';
import { Grid, Stack, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { register } from 'module';
import { useForm } from 'react-hook-form';

import SubmitButton from 'components/inputs/SubmitButton';
import Paper from 'components/layout/Paper';
import { SecondaryTopBox } from 'components/layout/TopBox';
import Page from 'components/navigation/Page';

type Biodata = {
  description: string;
  gitlab: string;
  linkedIn: string;
};

const UserBioForm = () => {
  const { register, formState, handleSubmit, setError } = useForm<Biodata>();

  const onSave = async (data: Biodata) => {};

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Typography sx={{ pb: 3 }} variant='h2'>
        Rediger profil
      </Typography>
      <TextField fullWidth label='Beskrivelse' sx={{ pb: 2 }} />
      <TextField fullWidth label='GitHub' sx={{ pb: 2 }} />
      <TextField fullWidth label='LinkedIn' sx={{ pb: 2 }} />
      <SubmitButton formState={formState}>Lagre</SubmitButton>
    </form>
  );
};

const ProfileEditor = () => {
  return (
    <Stack component={Paper} direction={{ xs: 'column', md: 'row' }} gap={1} sx={{ p: 2, m: 1 }} variant='elevation'>
      <UserBioForm />
    </Stack>
  );
};

export default ProfileEditor;
