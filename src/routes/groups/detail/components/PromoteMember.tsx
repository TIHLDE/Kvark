import { useMutation } from '@tanstack/react-query';
import { Button } from '~/components/ui/button';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';
import { updateGroupMemberRoleMutation } from '~/api/queries/groups';
import type { Membership, UserList } from '~/types';
import { MembershipType } from '~/types/Enums';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

type PromoteMemberProps = {
  user: UserList;
  membership: Membership;
};

const PromoteMember = ({ user, membership }: PromoteMemberProps) => {
  const updateMembership = useMutation(updateGroupMemberRoleMutation);

  const promoteUserToLeader = () =>
    updateMembership.mutate(
      { groupSlug: membership.group.slug, userId: user.user_id, data: { membership_type: MembershipType.LEADER } as never },
      {
        onSuccess: () => {
          toast.success(`${user.first_name} ${user.last_name} ble promotert til leder`);
        },
        onError: (e) => {
          toast.error(e.message);
        },
      },
    );

  const OpenButton = (
    <Button className='w-full' variant='outline'>
      <Star className='mr-2 w-5 h-5 stroke-[1.5px]' />
      Promoter til leder
    </Button>
  );

  return (
    <ResponsiveAlertDialog
      action={promoteUserToLeader}
      description='Er du sikker pa at du vil promotere denne brukeren til leder?'
      title='Promoter til leder'
      actionText='Promoter'
      destructive={false}
      trigger={OpenButton}
    />
  );
};

export default PromoteMember;
