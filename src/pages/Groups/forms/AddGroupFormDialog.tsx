import AddIcon from '@mui/icons-material/AddRounded';
import { Button, ButtonProps } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import URLS from 'URLS';

import { Group, GroupFormCreate } from 'types';
import { FormResourceType } from 'types/Enums';

import { useCreateForm } from 'hooks/Form';
import { useSnackbar } from 'hooks/Snackbar';

import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import Dialog from 'components/layout/Dialog';

export type AddGroupFormDialogProps = ButtonProps & {
  groupSlug: Group['slug'];
};

const AddGroupFormDialog = ({ groupSlug, ...props }: AddGroupFormDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const createGroupForm = useCreateForm();
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  const { register, formState, handleSubmit } = useForm<Pick<GroupFormCreate, 'title'>>();

  const submit = (data: Pick<GroupFormCreate, 'title'>) => {
    const newForm: GroupFormCreate = {
      title: data.title,
      group: groupSlug,
      resource_type: FormResourceType.GROUP_FORM,
      fields: [],
    };
    createGroupForm.mutate(newForm, {
      onSuccess: (form) => {
        showSnackbar(`Skjemaet ble opprettet`, 'success');
        navigate(`${URLS.form}admin/${form.id}`);
      },
      onError: (e) => showSnackbar(e.detail, 'error'),
    });
  };

  return (
    <>
      <Dialog
        contentText='Alle TIHLDE-medlemmer vil kunne svare på skjemaet, flere ganger om de ønsker. Du kan legge til spørsmål etter at du har opprettet skjemaet. Spørsmålene kan endres helt til noen har svart på skjemaet.'
        onClose={() => setDialogOpen(false)}
        open={dialogOpen}
        titleText='Nytt spørreskjema'>
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
