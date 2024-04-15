import { Rowing } from '@mui/icons-material';
import { Button, Grid, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { register } from 'module';
import { useForm } from 'react-hook-form';
import { useUserBio, useUpdateUserBio, useDeleteUserBio, useCreateUserBio } from 'hooks/UserBio';

import SubmitButton from 'components/inputs/SubmitButton';
import Paper from 'components/layout/Paper';
import { SecondaryTopBox } from 'components/layout/TopBox';
import Page from 'components/navigation/Page';
import { UserBioCreate } from 'types';

type Biodata = {
  description: string;
  github: string;
  linkedIn: string;
};

export type UserBioProps = {
  userBioId: number;
};

const UserBioForm = ({userBioId}: UserBioProps) => {
  const { formState, handleSubmit, register } = useForm<Biodata>();

  const createUserBio = useCreateUserBio();
  const updateUserBio = useUpdateUserBio(userBioId);
  const deleteUserBio = useDeleteUserBio(userBioId);
  const getUserBio = useUserBio(userBioId);

  const onSave = async (data: Biodata) => {
    
    updateUserBio.mutate(data, {
      onSuccess: () => {
        alert("asdadadsadadsada")
      } 
    })
    
  };

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Typography sx={{ pb: 3 }} variant='h2'>
        Redigér bio
      </Typography>
      <TextField fullWidth inputProps={{ maxLength: 500 }} label='Biografi' multiline rows={6} sx={{ pb: 2 }} />
      <TextField fullWidth label='GitHub (URL)' sx={{ pb: 2 }} />
      <TextField fullWidth label='LinkedIn (URL)' sx={{ pb: 2 }} />
      <SubmitButton disabled={formState.isSubmitting} formState={formState}>
        Lagre
      </SubmitButton>
    </form>
  );
};
const ProfileEditor = () => {
  return (
    <Stack component={Paper} direction={{ xs: 'column', md: 'row' }} gap={2} sx={{ p: 3, m: 2 }} variant='elevation'>
      <UserBioForm />
    </Stack>
  );
};

export default ProfileEditor;
