import { useMutation } from '@tanstack/react-query';
import { Button } from '~/components/ui/button';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';
import { removeGroupMemberMutation } from '~/api/queries/groups';
import type { Membership, UserList } from '~/types';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

type RemoveMemberProps = {
  user: UserList;
  membership: Membership;
};

const RemoveMember = ({ user, membership }: RemoveMemberProps) => {
  const deleteMembership = useMutation(removeGroupMemberMutation);

  const removeMemberFromGroup = () =>
    deleteMembership.mutate(
      { groupSlug: membership.group.slug, userId: user.user_id },
      {
        onSuccess: () => {
          toast.success('Medlemmet ble fjernet');
        },
        onError: (e) => {
          toast.error(e.message);
        },
      },
    );

  const OpenButton = (
    <Button className='w-full' variant='outline'>
      <Trash className='mr-2 w-5 h-5 stroke-[1.5px]' />
      Fjern medlem
    </Button>
  );

  return (
    <ResponsiveAlertDialog
      action={removeMemberFromGroup}
      description='Er du sikker pa at du vil fjerne denne brukeren fra gruppen?'
      title='Fjern medlem'
      actionText='Fjern medlem'
      trigger={OpenButton}
    />
  );
};

export default RemoveMember;
