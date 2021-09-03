import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { EMAIL_REGEX } from 'constant';
import { useUpdateGroup } from 'api/hooks/Group';
import { useSnackbar } from 'api/hooks/Snackbar';
import { Group } from 'types/Types';

import EditIcon from '@mui/icons-material/Edit';

import TextField from 'components/inputs/TextField';
import SubmitButton from 'components/inputs/SubmitButton';
import Dialog from 'components/layout/Dialog';
import { BannerButton } from 'components/layout/Banner';

export type UpdateGroupModalProps = {
  group: Group;
};

const UpdateGroupModal = ({ group }: UpdateGroupModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { register, formState, handleSubmit } = useForm();
  const updateGroup = useUpdateGroup();
  const showSnackbar = useSnackbar();

  const submit = async (formData: Group) => {
    const data = { ...group, name: formData.name, description: formData.description, contact_email: formData.contact_email };
    updateGroup.mutate(data, {
      onSuccess: () => {
        setIsOpen(false);
        showSnackbar('Gruppe oppdatert', 'success');
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };
  return (
    <>
      <BannerButton onClick={() => setIsOpen(true)} startIcon={<EditIcon />}>
        Rediger gruppe
      </BannerButton>
      <Dialog onClose={() => setIsOpen(false)} open={isOpen} titleText='Oppdater gruppe'>
        <form onSubmit={handleSubmit(submit)}>
          <TextField defaultValue={group.name} formState={formState} label='Gruppenavn' {...register('name', { required: 'Gruppen må ha et navn' })} required />
          <TextField defaultValue={group.description} formState={formState} label='Gruppebeskrivelse' multiline {...register('description')} rows={6} />
          <TextField
            defaultValue={group.contact_email}
            formState={formState}
            label='Kontakt e-post'
            {...register('contact_email', {
              pattern: {
                value: EMAIL_REGEX,
                message: 'Ugyldig e-post',
              },
            })}
            type='email'
          />
          <SubmitButton disabled={updateGroup.isLoading} formState={formState}>
            Oppdater gruppe
          </SubmitButton>
        </form>
      </Dialog>
    </>
  );
};

export default UpdateGroupModal;
