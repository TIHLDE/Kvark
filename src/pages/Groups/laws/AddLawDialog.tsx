import AddIcon from '@mui/icons-material/AddRounded';
import { Button, Divider, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Group, GroupLawMutate } from 'types';

import { useCreateGroupLaw } from 'hooks/Group';
import { useSnackbar } from 'hooks/Snackbar';

import LawItem from 'pages/Groups/laws/LawItem';

import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import Dialog from 'components/layout/Dialog';
import Paper from 'components/layout/Paper';

export type AddLawDialogProps = {
  groupSlug: Group['slug'];
};

const AddLawDialog = ({ groupSlug }: AddLawDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const createLaw = useCreateGroupLaw(groupSlug);
  const showSnackbar = useSnackbar();
  const { register, formState, handleSubmit, watch, reset } = useForm<GroupLawMutate>();
  const values = watch();

  const submit = (data: GroupLawMutate) =>
    createLaw.mutate(data, {
      onSuccess: () => {
        showSnackbar('Lovparagrafen ble opprettet', 'success');
        setDialogOpen(false);
        reset();
      },
      onError: (e) => showSnackbar(e.detail, 'error'),
    });

  return (
    <>
      <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen} titleText='Ny lovparagraf'>
        <form onSubmit={handleSubmit(submit)}>
          <TextField
            defaultValue={1}
            formState={formState}
            helperText='Heltall for overskrift. Maks 2 siffer på hver side av komma'
            inputProps={{ inputMode: 'numeric', pattern: '^[0-9]{1,2}(.[0-9]{1,2})?$' }}
            label='Paragraf'
            placeholder='For eks.: 12.01'
            {...register('paragraph', {
              required: 'Hvilken paragraf',
              valueAsNumber: true,
            })}
            required
          />
          <TextField
            formState={formState}
            helperText='For eks.: Forsentkomming'
            label='Tittel'
            {...register('title', { required: 'Navngi paragrafen' })}
            required
          />
          <TextField
            formState={formState}
            helperText='La stå tom for å ikke kunne velges ved botgivning'
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
            inputProps={{ type: 'number' }}
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
          <LawItem groupSlug={groupSlug} law={{ ...values, paragraph: values.paragraph || 1, title: values.title || '', id: '-' }} />
        </Paper>
      </Dialog>
      <Button fullWidth onClick={() => setDialogOpen(true)} startIcon={<AddIcon />} variant='outlined'>
        Ny lovparagraf
      </Button>
    </>
  );
};

export default AddLawDialog;
