import { useState, forwardRef, Ref } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateGroupFine, useGroupLaws } from 'hooks/Group';
import { useSnackbar } from 'hooks/Snackbar';
import { useGoogleAnalytics } from 'hooks/Utils';
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

const AddFineDialog = forwardRef(function AddFineDialog({ groupSlug }: AddFineDialogProps, ref: Ref<HTMLButtonElement>) {
  const { event } = useGoogleAnalytics();
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
    event('create', 'fines', `Created a new fine`);
    createFine.mutate(
      { ...data, user: data.user.map((u) => u.user_id) },
      {
        onSuccess: () => {
          showSnackbar('Boten ble opprettet', 'success');
          setDialogOpen(false);
        },
        onError: (e) => showSnackbar(e.detail, 'error'),
      },
    );
  };

  const selectableLawExists = Boolean(laws.filter((l) => Boolean(l.description)).length);

  return (
    <>
      {laws !== undefined && (
        <Dialog
          contentText={!selectableLawExists ? 'Du må legge til minst en lov i lovverket før du kan gi bot' : undefined}
          onClose={() => setDialogOpen(false)}
          open={dialogOpen}
          titleText='Gi bot'>
          {selectableLawExists && (
            <form onSubmit={handleSubmit(submit)}>
              <UserSearch
                control={control}
                formState={formState}
                helperText='Du kan velge flere personer'
                inGroup={groupSlug}
                label='Hvem har begått et lovbrudd?'
                multiple
                name='user'
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
          )}
        </Dialog>
      )}
      <Fab color='primary' onClick={() => setDialogOpen(true)} ref={ref} variant='extended'>
        <AddIcon sx={{ mr: 1 }} />
        Ny bot
      </Fab>
    </>
  );
});

export default AddFineDialog;
