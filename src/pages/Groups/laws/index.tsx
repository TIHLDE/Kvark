import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useGroup, useGroupLaws, useCreateGroupLaw, useUpdateGroupLaw, useDeleteGroupLaw } from 'hooks/Group';
import { useSnackbar } from 'hooks/Snackbar';
import { useUser } from 'hooks/User';
import { Group, Law, LawMutate } from 'types';

import { Divider, ListItem, ListItemText, ListItemSecondaryAction, IconButton, List, Typography, styled, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/EditRounded';
import AddIcon from '@mui/icons-material/AddRounded';

import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import Dialog from 'components/layout/Dialog';
import TextField from 'components/inputs/TextField';
import SubmitButton from 'components/inputs/SubmitButton';
import Paper from 'components/layout/Paper';
import VerifyDialog from 'components/layout/VerifyDialog';
import Expand from 'components/layout/Expand';
import Pagination from 'components/layout/Pagination';

type AddLawDialogProps = {
  groupSlug: Group['slug'];
};

const AddLawDialog = ({ groupSlug }: AddLawDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const createLaw = useCreateGroupLaw(groupSlug);
  const showSnackbar = useSnackbar();
  const { register, formState, handleSubmit, watch } = useForm<LawMutate>();
  const values = watch();

  const submit = async (data: LawMutate) => {
    createLaw.mutate(data, {
      onSuccess: () => {
        showSnackbar('Lovparagrafen ble opprettet', 'success');
        setDialogOpen(false);
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

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

type LawItemProps = {
  groupSlug: Group['slug'];
  law: Law;
  isAdmin?: boolean;
};

const LawItem = ({ law, groupSlug, isAdmin = false }: LawItemProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const deleteLaw = useDeleteGroupLaw(groupSlug, law.id);
  const updateLaw = useUpdateGroupLaw(groupSlug, law.id);
  const showSnackbar = useSnackbar();
  const { register, formState, handleSubmit, watch } = useForm<LawMutate>({ defaultValues: { ...law } });
  const values = watch();

  const handleDeleteLaw = () => {
    deleteLaw.mutate(null, {
      onSuccess: (data) => {
        showSnackbar(data.detail, 'success');
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  const submit = async (data: LawMutate) => {
    updateLaw.mutate(data, {
      onSuccess: () => {
        showSnackbar('Lovparagrafen ble oppdatert', 'success');
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  return (
    <>
      {isAdmin && (
        <Dialog onClose={() => setEditOpen(false)} open={editOpen} titleText='Endre lovparagraf'>
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
              formState={formState}
              helperText='Brukes for å forhåndsutfylle antall bøter når det lages en ny'
              InputProps={{ type: 'number' }}
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
            <Typography
              sx={{ fontFamily: 'Georgia, serif', fontWeight: 'bold' }}
              variant={law.description ? 'subtitle1' : 'h3'}>{`§${law.paragraph}`}</Typography>
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

const Expansion = styled(Expand)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.smoke,
}));

const GroupLaws = () => {
  const { slug } = useParams<'slug'>();
  const { data: user } = useUser();
  const { data: group } = useGroup(slug || '-');
  const { data, isLoading, hasNextPage, isFetching, fetchNextPage } = useGroupLaws(slug || '-');
  const laws = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  const isAdmin = (Boolean(user) && group?.fines_admin?.user_id === user?.user_id) || group?.permissions.write;

  if (isLoading || !slug || !group) {
    return null;
  }

  return (
    <>
      {group.fine_info && (
        <div>
          <Expansion header='Praktiske detaljer' sx={{ mb: 1 }}>
            <MarkdownRenderer value={group.fine_info} />
          </Expansion>
        </div>
      )}
      {isAdmin && <AddLawDialog groupSlug={group.slug} />}
      <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
        <List>
          {laws.map((law) => (
            <LawItem groupSlug={group.slug} isAdmin={isAdmin} key={law.id} law={law} />
          ))}
        </List>
      </Pagination>
    </>
  );
};

export default GroupLaws;
