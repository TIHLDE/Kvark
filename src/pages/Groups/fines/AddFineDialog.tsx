import { useState, forwardRef, Ref, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateGroupFine, useGroupLaws } from 'hooks/Group';
import { useSnackbar } from 'hooks/Snackbar';
import { useAnalytics } from 'hooks/Utils';
import { Group, GroupFineCreate, UserBase } from 'types';

import { Fab, MenuItem, ListSubheader, FabProps } from '@mui/material';
import AddIcon from '@mui/icons-material/AddRounded';

import Dialog from 'components/layout/Dialog';
import Select from 'components/inputs/Select';
import UserSearch from 'components/inputs/UserSearch';
import TextField from 'components/inputs/TextField';
import SubmitButton from 'components/inputs/SubmitButton';
import { formatLawHeader } from 'utils';

export type AddFineDialogProps = FabProps & {
  groupSlug: Group['slug'];
};

type FormValues = Omit<GroupFineCreate, 'user'> & {
  user: Array<UserBase>;
};

const AddFineDialog = forwardRef(function AddFineDialog({ groupSlug, ...props }: AddFineDialogProps, ref: Ref<HTMLButtonElement>) {
  const { event } = useAnalytics();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: laws } = useGroupLaws(groupSlug, { enabled: dialogOpen });
  const createFine = useCreateGroupFine(groupSlug);
  const showSnackbar = useSnackbar();
  const { register, formState, handleSubmit, control, watch, setValue } = useForm<FormValues>();

  const selectedLaw = watch('description');

  useEffect(() => {
    const law = laws?.find((law) => law.id === selectedLaw);
    if (law) {
      setValue('amount', law.amount);
    }
  }, [selectedLaw]);

  const submit = (data: FormValues) => {
    const law = laws?.find((law) => law.id === data.description);
    if (!law) {
      showSnackbar('Du må velge en lov', 'warning');
      return;
    }
    if (!data.user?.length) {
      showSnackbar('Du må velge minst en person', 'warning');
      return;
    }
    event('create', 'fines', `Created a new fine`);
    createFine.mutate(
      { ...data, description: formatLawHeader(law), user: data.user.map((u) => u.user_id) },
      {
        onSuccess: () => {
          showSnackbar('Boten ble opprettet', 'success');
          setDialogOpen(false);
        },
        onError: (e) => showSnackbar(e.detail, 'error'),
      },
    );
  };

  const selectableLawExists = Boolean(laws?.filter((law) => Boolean(law.description)).length);

  return (
    <>
      {laws !== undefined && (
        <Dialog
          contentText={!selectableLawExists ? 'Det er ingen lover i lovverket, du kan ikke gi bot for å ha brutt en lov som ikke finnes' : undefined}
          onClose={() => setDialogOpen(false)}
          open={dialogOpen}
          titleText='Ny bot'>
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
                defaultValue={laws.filter((l) => Boolean(l.description))[0].id}
                formState={formState}
                label='Lovbrudd'
                name='description'
                required>
                {laws.map((law) =>
                  law.description ? (
                    <MenuItem key={law.id} sx={{ whiteSpace: 'break-spaces' }} value={law.id}>
                      {formatLawHeader(law)}
                    </MenuItem>
                  ) : (
                    <ListSubheader key={law.id}>{formatLawHeader(law)}</ListSubheader>
                  ),
                )}
              </Select>
              <TextField
                defaultValue={1}
                formState={formState}
                inputProps={{ type: 'number' }}
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
      <Fab color='primary' variant='extended' {...props} onClick={() => setDialogOpen(true)} ref={ref}>
        <AddIcon sx={{ mr: 1 }} />
        Ny bot
      </Fab>
    </>
  );
});

export default AddFineDialog;
