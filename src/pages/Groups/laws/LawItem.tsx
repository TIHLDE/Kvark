import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateGroupLaw, useDeleteGroupLaw } from 'hooks/Group';
import { useSnackbar } from 'hooks/Snackbar';
import { Group, GroupLaw, GroupLawMutate } from 'types';

import { Divider, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/EditRounded';

import Dialog from 'components/layout/Dialog';
import TextField from 'components/inputs/TextField';
import SubmitButton from 'components/inputs/SubmitButton';
import Paper from 'components/layout/Paper';
import VerifyDialog from 'components/layout/VerifyDialog';
import { formatLawHeader } from 'utils';

export type LawItemProps = {
  groupSlug: Group['slug'];
  law: GroupLaw;
  isAdmin?: boolean;
};

const LawItem = ({ law, groupSlug, isAdmin = false }: LawItemProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const deleteLaw = useDeleteGroupLaw(groupSlug, law.id);
  const updateLaw = useUpdateGroupLaw(groupSlug, law.id);
  const showSnackbar = useSnackbar();
  const { register, formState, handleSubmit, watch } = useForm<GroupLawMutate>({ defaultValues: { ...law } });
  const values = watch();

  const handleDeleteLaw = () =>
    deleteLaw.mutate(null, {
      onSuccess: (data) => showSnackbar(data.detail, 'success'),
      onError: (e) => showSnackbar(e.detail, 'error'),
    });

  const submit = (data: GroupLawMutate) =>
    updateLaw.mutate(data, {
      onSuccess: () => showSnackbar('Lovparagrafen ble oppdatert', 'success'),
      onError: (e) => showSnackbar(e.detail, 'error'),
    });

  return (
    <>
      {isAdmin && (
        <Dialog onClose={() => setEditOpen(false)} open={editOpen} titleText='Endre lovparagraf'>
          <form onSubmit={handleSubmit(submit)}>
            <TextField
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
              formState={formState}
              helperText='Brukes for å forhåndsutfylle antall bøter når det lages en ny'
              inputProps={{ type: 'number' }}
              label='Veiledende antall bøter'
              {...register('amount')}
              required
            />
            <SubmitButton disabled={updateLaw.isLoading} formState={formState} sx={{ mt: 2 }}>
              Oppdater lovparagraf
            </SubmitButton>
          </form>
          <VerifyDialog color='error' onConfirm={handleDeleteLaw} sx={{ mt: 2 }} titleText={`Slett lovparagrafen?`}>
            Slett lovparagraf
          </VerifyDialog>
          <Divider sx={{ my: 2 }} />
          <Typography gutterBottom>Forhåndsvisning:</Typography>
          <Paper noPadding sx={{ px: 2, py: 1 }}>
            <LawItem groupSlug={groupSlug} law={{ ...values, id: '-' }} />
          </Paper>
        </Dialog>
      )}
      <ListItem disablePadding>
        <ListItemText
          primary={
            <Typography sx={{ fontFamily: 'Century Schoolbook, Georgia, serif', fontWeight: 'bold' }} variant={law.paragraph % 1 !== 0 ? 'subtitle1' : 'h3'}>
              {formatLawHeader(law)}
            </Typography>
          }
          secondary={
            Boolean(law.description) && (
              <Typography sx={{ whiteSpace: 'break-spaces' }} variant='body2'>
                {law.description}
                <br />
                <i>Bøter: {law.amount}</i>
              </Typography>
            )
          }
        />
        {isAdmin && (
          <ListItemSecondaryAction>
            <IconButton onClick={() => setEditOpen(true)}>
              <EditIcon />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>
    </>
  );
};

export default LawItem;
