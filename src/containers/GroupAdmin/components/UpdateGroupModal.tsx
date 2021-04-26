import { useUpdateGroup } from 'api/hooks/Group';
import useSnackbar from 'api/hooks/Snackbar';
import TextField from 'components/inputs/TextField';
import Dialog from 'components/layout/Dialog';
import { useForm } from 'react-hook-form';
import { Group } from 'types/Types';
type UpdateGroupModalProps = {
  modalIsOpen: boolean;
  handleClose: () => void;
  group: Group;
};

const UpdateGroupModal = ({ modalIsOpen, handleClose, group }: UpdateGroupModalProps) => {
  const { register, errors, handleSubmit } = useForm();
  const updateGroup = useUpdateGroup();
  const showSnackbar = useSnackbar();

  const onSubmit = handleSubmit((formData: Group) => {
    const data = { ...group, name: formData.name, description: formData.description, contact_email: formData.contact_email };
    updateGroup.mutate(data, {
      onSuccess: () => {
        handleClose();
        showSnackbar('Gruppe oppdatert', 'success');
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  });
  return (
    <Dialog confirmText='Oppdater gruppe' onClose={handleClose} onConfirm={onSubmit} open={modalIsOpen} titleText={'Oppdater gruppe'}>
      <TextField defaultValue={group.name} errors={errors} label='Gruppenavn' name='name' register={register} required />
      <TextField
        defaultValue={group.description}
        errors={errors}
        label='Gruppebeskrivelse'
        multiline
        name='description'
        register={register}
        required
        rows={6}
      />
      <TextField defaultValue={group.contact_email} errors={errors} label='Kontakt e-post' name='contact_email' register={register} />
    </Dialog>
  );
};

export default UpdateGroupModal;
