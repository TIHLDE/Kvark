import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateGroupFine, useGroupLaws } from 'hooks/Group';
import { useSnackbar } from 'hooks/Snackbar';
import { Group, GroupFineCreate, UserBase } from 'types';

import { Fab, MenuItem, ListSubheader } from '@mui/material';
import AddIcon from '@mui/icons-material/AddRounded';

import Dialog from 'components/layout/Dialog';
import Select from 'components/inputs/Select';
import UserSearch from 'components/inputs/UserSearch';
import TextField from 'components/inputs/TextField';
import SubmitButton from 'components/inputs/SubmitButton';

export type AddFineDialogProps = {
  groupSlug: Group['slug'];
};

type FormValues = Omit<GroupFineCreate, 'user'> & {
  user: Array<UserBase>;
};

const AddFineDialog = ({ groupSlug }: AddFineDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: laws } = useGroupLaws(groupSlug, { enabled: dialogOpen });
  const createFine = useCreateGroupFine(groupSlug);
  const showSnackbar = useSnackbar();
  const { register, formState, handleSubmit, control } = useForm<FormValues>();

  const submit = async (data: FormValues) => {
    if (!data.user?.length) {
      showSnackbar('Du må velge minst en person', 'warning');
      return;
    }
    createFine.mutate(
      { ...data, user: data.user.map((u) => u.user_id) },
      {
        onSuccess: () => {
          showSnackbar('Boten ble opprettet', 'success');
          setDialogOpen(false);
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      },
    );
  };

  return (
    <>
      {laws !== undefined && (
        <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen} titleText='Gi bot'>
          <form onSubmit={handleSubmit(submit)}>
            <UserSearch
              control={control}
              formState={formState}
              helperText='Du kan velge flere personer'
              inGroup={groupSlug}
              label='Hvem har begått et lovbrudd?'
              multiple
              name='user'
              required
            />
            <Select
              control={control}
              defaultValue={`§${laws.filter((l) => Boolean(l.description))[0].paragraph}`}
              formState={formState}
              label='Begrunnelse'
              name='description'
              required>
              {laws.map((law) =>
                law.description ? (
                  <MenuItem key={law.id} sx={{ whiteSpace: 'break-spaces' }} value={`§${law.paragraph}`}>
                    {`§${law.paragraph}`}
                  </MenuItem>
                ) : (
                  <ListSubheader key={law.id}>{`§${law.paragraph}`}</ListSubheader>
                ),
              )}
              <MenuItem value='custom'>Egendefinert begrunnelse</MenuItem>
            </Select>
            <TextField
              defaultValue={1}
              formState={formState}
              InputProps={{ type: 'number' }}
              label='Forslag til antall bøter'
              {...register('amount')}
              required
            />
            <TextField formState={formState} label='Begrunnelse' maxRows={4} minRows={2} multiline {...register('reason')} />
            <SubmitButton disabled={createFine.isLoading} formState={formState} sx={{ mt: 2 }}>
              Opprett bot
            </SubmitButton>
          </form>
        </Dialog>
      )}
      <Fab
        color='primary'
        onClick={() => setDialogOpen(true)}
        sx={{
          position: 'fixed',
          zIndex: 1,
          bottom: (theme) => ({ xs: theme.spacing(12), lg: theme.spacing(2) }),
          right: (theme) => theme.spacing(2),
        }}
        variant='extended'>
        <AddIcon sx={{ mr: 1 }} />
        Gi bot
      </Fab>
    </>
  );
};

export default AddFineDialog;
