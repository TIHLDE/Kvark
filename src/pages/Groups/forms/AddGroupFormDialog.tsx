import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateForm } from 'hooks/Form';
import { useSnackbar } from 'hooks/Snackbar';
import { Group, GroupFormCreate } from 'types';
import { FormResourceType } from 'types/Enums';

import { Button, ButtonProps } from '@mui/material';
import AddIcon from '@mui/icons-material/AddRounded';

import Dialog from 'components/layout/Dialog';
import TextField from 'components/inputs/TextField';
import SubmitButton from 'components/inputs/SubmitButton';

export type AddGroupFormDialogProps = ButtonProps & {
  groupSlug: Group['slug'];
};

const AddGroupFormDialog = ({ groupSlug, ...props }: AddGroupFormDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const createGroupForm = useCreateForm();
  const showSnackbar = useSnackbar();
  const { register, formState, handleSubmit, reset } = useForm<Pick<GroupFormCreate, 'title'>>();

  const submit = (data: Pick<GroupFormCreate, 'title'>) => {
    const newForm: GroupFormCreate = {
      title: data.title,
      group: groupSlug,
      resource_type: FormResourceType.GROUP_FORM,
      fields: [],
    };
    createGroupForm.mutate(newForm, {
      onSuccess: () => {
        showSnackbar('Lovparagrafen ble opprettet', 'success');
        setDialogOpen(false);
        reset();
      },
      onError: (e) => showSnackbar(e.detail, 'error'),
    });
  };

  return (
    <>
      <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen} titleText='Nytt spørreskjema'>
        <form onSubmit={handleSubmit(submit)}>
          <TextField formState={formState} label='Tittel' {...register('title', { required: 'Navngi spørreskjemaet' })} required />
          <SubmitButton disabled={createGroupForm.isLoading} formState={formState} sx={{ mt: 2 }}>
            Opprett spørreskjema
          </SubmitButton>
        </form>
      </Dialog>
      <Button fullWidth startIcon={<AddIcon />} variant='outlined' {...props} onClick={() => setDialogOpen(true)}>
        Nytt spørreskjema
      </Button>
    </>
  );
};

export default AddGroupFormDialog;
