import { Button } from '~/components/ui/button';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';
import type { MembershipHistory } from '~/types';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

// TODO: Re-add delete membership history — previously used useDeleteMembershipHistory from ~/hooks/Membership.
// The new query layer (~/api/queries/groups) does not yet have a membership history delete endpoint.

type DeleteMembershipHistoryProps = {
  membership: MembershipHistory;
};

const DeleteMembershipHistory = ({ membership: _membership }: DeleteMembershipHistoryProps) => {
  const removeMemberFromGroup = () => {
    // TODO: Implement when membership history mutation is available
    toast.error('Sletting av medlemshistorikk er ikke implementert enda');
  };

  const OpenButton = (
    <Button className='w-full' variant='outline'>
      <Trash className='mr-2 w-5 h-5 stroke-[1.5px]' />
      Fjern medlem
    </Button>
  );

  return (
    <ResponsiveAlertDialog
      action={removeMemberFromGroup}
      description='Er du sikker pa at du vil slette denne medlemshistorikken?'
      title='Fjern medlemhistorikk'
      trigger={OpenButton}
    />
  );
};

export default DeleteMembershipHistory;
