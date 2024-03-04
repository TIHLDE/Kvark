import { Rowing } from '@mui/icons-material';
import { Grid, Button, Stack, TextField, Typography,InputAdornment} from '@mui/material';
import Box from '@mui/material/Box';
import { register } from 'module';
import { useForm } from 'react-hook-form';

import SubmitButton from 'components/inputs/SubmitButton';
import Paper from 'components/layout/Paper';
import { SecondaryTopBox } from 'components/layout/TopBox';
import Page from 'components/navigation/Page';

type Biodata = {
  description: string;
  github: string;
  linkedIn: string;
};

const UserBioForm = () => {
  const {formState, handleSubmit, register} = useForm<Biodata>();


  const onSave = async (data: Biodata) => {};

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Typography 
        sx={{ pb: 3 }} 
        variant='h2'>
        Redigér bio
      </Typography>
      <TextField 
        fullWidth 
        label='Biografi' 
        sx={{ pb: 2 }} 
        inputProps = {{maxLength:500}}
        multiline
        rows = {6}
      />   
      <TextField 
        fullWidth 
        label='GitHub (URL)' 
        sx={{ pb: 2 }}
     />
      <TextField 
        fullWidth 
        label='LinkedIn (URL)' 
        sx={{ pb: 2 }} />
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
