import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { UserBase } from 'types';

import { useCreateMembership } from 'hooks/Membership';
import { useSnackbar } from 'hooks/Snackbar';

import SubmitButton from 'components/inputs/SubmitButton';
import UserSearch from 'components/inputs/UserSearch';
import Dialog from 'components/layout/Dialog';
import { Button } from 'components/ui/button';

export type AddMemberModalProps = {
  groupSlug: string;
};

type FormData = {
  user?: UserBase;
};

const AddGroupMember = ({ groupSlug }: AddMemberModalProps) => {
  const { control, handleSubmit, formState } = useForm<FormData>();
  const showSnackbar = useSnackbar();
  const createMembership = useCreateMembership();
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = (formData: FormData) => {
    if (!formData.user) {
      showSnackbar('Du har ikke valgt et medlem', 'warning');
      return;
    }
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
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size='sm' variant='outline'>
        <PlusIcon className='mr-2 w-5 h-5 stroke-[1.5px]' /> Legg til
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
