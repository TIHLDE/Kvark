import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateGroupLaw } from 'hooks/Group';
import { useSnackbar } from 'hooks/Snackbar';
import { Group, GroupLawMutate } from 'types';

import { Divider, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/AddRounded';

import Dialog from 'components/layout/Dialog';
import TextField from 'components/inputs/TextField';
import SubmitButton from 'components/inputs/SubmitButton';
import Paper from 'components/layout/Paper';

import LawItem from 'pages/Groups/laws/LawItem';

export type AddLawDialogProps = {
  groupSlug: Group['slug'];
};

const AddLawDialog = ({ groupSlug }: AddLawDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const createLaw = useCreateGroupLaw(groupSlug);
  const showSnackbar = useSnackbar();
  const { register, formState, handleSubmit, watch, reset } = useForm<GroupLawMutate>();
  const values = watch();

  const submit = async (data: GroupLawMutate) =>
    createLaw.mutate(data, {
      onSuccess: () => {
        showSnackbar('Lovparagrafen ble opprettet', 'success');
        setDialogOpen(false);
        reset();
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });

  return (
    <>
      <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen} titleText='Ny lovparagraf'>
        <form onSubmit={handleSubmit(submit)}>
          <TextField
            formState={formState}
            helperText='For eks.: 1.1 Forsentkomming'
            label='Paragraf'
            {...register('paragraph', { required: 'Navngi paragrafen' })}
            required
          />
          <TextField
            formState={formState}
            helperText='La stå tom for å gjøre til overskrift'
            label='Beskrivelse'
            maxRows={4}
            minRows={2}
            multiline
            {...register('description')}
          />
          <TextField
            defaultValue={1}
            formState={formState}
            helperText='Brukes for å forhåndsutfylle antall bøter når det lages en ny'
            InputProps={{ type: 'number' }}
            label='Veiledende antall bøter'
            {...register('amount')}
            required
          />
          <SubmitButton disabled={createLaw.isLoading} formState={formState} sx={{ mt: 2 }}>
            Opprett lovparagraf
          </SubmitButton>
        </form>
        <Divider sx={{ my: 2 }} />
        <Typography gutterBottom>Forhåndsvisning:</Typography>
        <Paper noPadding sx={{ px: 2, py: 1 }}>
          <LawItem groupSlug={groupSlug} law={{ ...values, id: '-' }} />
        </Paper>
      </Dialog>
      <Button fullWidth onClick={() => setDialogOpen(true)} startIcon={<AddIcon />} variant='outlined'>
        Ny lovparagraf
      </Button>
    </>
  );
};

export default AddLawDialog;
