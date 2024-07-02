import { Trash } from 'lucide-react';
import { toast } from 'sonner';

import { Membership, UserList } from 'types';

import { useDeleteMembership } from 'hooks/Membership';

import { Button } from 'components/ui/button';
import ResponsiveAlertDialog from 'components/ui/responsive-alert-dialog';

type RemoveMemberProps = {
  user: UserList;
  membership: Membership;
};

const RemoveMember = ({ user, membership }: RemoveMemberProps) => {
  const deleteMembership = useDeleteMembership(membership.group.slug, user.user_id);

  const removeMemberFromGroup = () =>
    deleteMembership.mutate(null, {
      onSuccess: (data) => {
        toast.success(data.detail);
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });

  const OpenButton = (
    <Button className='w-full' variant='outline'>
      <Trash className='mr-2 w-5 h-5 stroke-[1.5px]' />
      Fjern medlem
    </Button>
  );

  return (
    <ResponsiveAlertDialog
      action={removeMemberFromGroup}
      description='Er du sikker på at du vil fjerne denne brukeren fra gruppen?'
      title='Fjern medlem'
      trigger={OpenButton}
    />
  );
};

export default RemoveMember;
