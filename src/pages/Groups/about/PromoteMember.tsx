import { Star } from 'lucide-react';
import { toast } from 'sonner';

import { Membership, UserList } from 'types';
import { MembershipType } from 'types/Enums';

import { useUpdateMembership } from 'hooks/Membership';

import { Button } from 'components/ui/button';
import ResponsiveAlertDialog from 'components/ui/responsive-alert-dialog';

type PromoteMemberProps = {
  user: UserList;
  membership: Membership;
};

const PromoteMember = ({ user, membership }: PromoteMemberProps) => {
  const updateMembership = useUpdateMembership(membership.group.slug, user.user_id);

  const promoteUserToLeader = () =>
    updateMembership.mutate(MembershipType.LEADER, {
      onSuccess: () => {
        toast.success(`${user.first_name} ${user.last_name} ble promotert til leder`);
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });

  const OpenButton = (
    <Button className='w-full' variant='outline'>
      <Star className='mr-2 w-5 h-5 stroke-[1.5px]' />
      Promoter til leder
    </Button>
  );

  return (
    <ResponsiveAlertDialog
      action={promoteUserToLeader}
      description='Er du sikker på at du vil promotere denne brukeren til leder?'
      title='Promoter til leder'
      trigger={OpenButton}
    />
  );
};

export default PromoteMember;
