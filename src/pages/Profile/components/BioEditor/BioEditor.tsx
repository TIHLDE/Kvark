import { Rowing } from '@mui/icons-material';
import { Grid, Stack, TextField, Typography } from '@mui/material';




import Box from '@mui/material/Box';
import SubmitButton from 'components/inputs/SubmitButton';
import Paper from 'components/layout/Paper';
import { SecondaryTopBox } from 'components/layout/TopBox';
import Page from 'components/navigation/Page';
import { register } from 'module';
import { useForm } from 'react-hook-form';





type Biodata = {
  description: string,
  gitlab: string,
  linkedIn: string,
};


const UserBioForm = () => {

  const { register, formState, handleSubmit, setError } = useForm<Biodata>();

  const onSave = async (data: Biodata) => {

  };

  return (
    <form 
      onSubmit={handleSubmit(onSave)}
    >
      <Typography variant='h2' sx={{ pb: 3 }}>
        Rediger profil
      </Typography>
      <TextField
        sx={{ pb: 2 }}
        fullWidth
        label='Beskrivelse'
      />
      <TextField
        sx={{ pb: 2 }}
        fullWidth
        label='GitHub'
      />
      <TextField
        sx={{ pb: 2 }}
        fullWidth
        label='LinkedIn'
      />
      <SubmitButton formState={formState}>
        Lagre
      </SubmitButton>
    </form>
  );
}



const ProfileEditor = () => {
  return(
    <Stack component={Paper} variant="elevation" direction={{ xs: 'column', md: 'row' }} gap={1} sx={{ p: 2, m: 1 }}>
      <UserBioForm />
    </Stack>
  )
};



export default ProfileEditor;
