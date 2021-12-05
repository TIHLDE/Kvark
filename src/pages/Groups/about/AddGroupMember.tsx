import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserList } from 'types';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'hooks/Snackbar';
import { useCreateMembership } from 'hooks/Membership';

import Dialog from 'components/layout/Dialog';
import UserSearch from 'components/inputs/UserSearch';
import SubmitButton from 'components/inputs/SubmitButton';

export type AddMemberModalProps = {
  groupSlug: string;
};

type FormData = {
  user?: UserList;
};

const AddGroupMember = ({ groupSlug }: AddMemberModalProps) => {
  const { control, handleSubmit, formState } = useForm<FormData>();
  const showSnackbar = useSnackbar();
  const createMembership = useCreateMembership();
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = (formData: FormData) => {
    if (formData.user) {
      createMembership.mutate(
        { groupSlug: groupSlug, userId: formData.user.user_id },
        {
          onSuccess: () => {
            showSnackbar('Medlem lagt til', 'success');
            setIsOpen(false);
          },
          onError: (e) => {
            showSnackbar(e.detail, 'error');
          },
        },
      );
    } else {
      showSnackbar('Du har ikke valgt et medlem', 'warning');
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} startIcon={<AddIcon />} sx={{ height: 'auto' }} variant='outlined'>
        Legg til
      </Button>
      <Dialog onClose={() => setIsOpen(false)} open={isOpen} titleText='Legg til medlem'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <UserSearch
            autoFocus
            control={control}
            formState={formState}
            helperText='Brukeren vil motta en epost/varsel om at de er lagt til i gruppen.'
            label='Søk etter bruker'
            name='user'
          />
          <SubmitButton disabled={createMembership.isLoading} formState={formState}>
            Legg til medlem
          </SubmitButton>
        </form>
      </Dialog>
    </>
  );
};

export default AddGroupMember;
