import { Button } from '~/components/ui/button';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';
import { useDeleteMembershipHistory } from '~/hooks/Membership';
import type { MembershipHistory } from '~/types';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

type DeleteMembershipHistoryProps = {
  membership: MembershipHistory;
};

const DeleteMembershipHistory = ({ membership }: DeleteMembershipHistoryProps) => {
  const deleteMembershipHistory = useDeleteMembershipHistory(membership.group.slug, membership.id);

  const removeMemberFromGroup = () =>
    deleteMembershipHistory.mutate(null, {
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
      description='Er du sikker på at du vil slette denne medlemshistorikken?'
      title='Fjern medlemhistorikk'
      trigger={OpenButton}
    />
  );
};

export default DeleteMembershipHistory;
