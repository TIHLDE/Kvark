import { parseISO } from 'date-fns';
import { ShieldMinus, StarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate } from 'utils';

import { Membership, UserList } from 'types';
import { MembershipType } from 'types/Enums';

import { useDeleteMembership, useUpdateMembership } from 'hooks/Membership';
import { useSnackbar } from 'hooks/Snackbar';

import { ShadVerifyDialog } from 'components/layout/VerifyDialog';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Button } from 'components/ui/button';
import Expandable from 'components/ui/expandable';

export type MembershipListItemProps = {
  membership: Membership;
  isAdmin?: boolean;
};

const MembershipListItem = ({ membership, isAdmin }: MembershipListItemProps) => {
  const user = membership.user as UserList;
  const deleteMembership = useDeleteMembership(membership.group.slug, user.user_id);
  const updateMembership = useUpdateMembership(membership.group.slug, user.user_id);
  const showSnackbar = useSnackbar();

  const removeMemberFromGroup = () =>
    deleteMembership.mutate(null, {
      onSuccess: (data) => showSnackbar(data.detail, 'success'),
      onError: (e) => showSnackbar(e.detail, 'error'),
    });

  const promoteUserToLeader = () =>
    updateMembership.mutate(MembershipType.LEADER, {
      onSuccess: () => showSnackbar(`${user.first_name} ${user.last_name} ble promotert til leder`, 'success'),
      onError: (e) => showSnackbar(e.detail, 'error'),
    });

  return (
    <>
      <Expandable
        description={`${formatDate(parseISO(membership.created_at), { time: false, fullMonth: true })} -> nå`}
        icon={
          <Avatar>
            <AvatarImage alt={user.first_name} src={user.image} />
            <AvatarFallback>{user.first_name[0] + user.last_name[0]}</AvatarFallback>
          </Avatar>
        }
        title={`${user.first_name} ${user.last_name}`}>
        <div className='space-y-2 lg:space-y-0 lg:flex lg:items-center lg:space-x-4'>
          <Button asChild className='w-full' variant='secondary'>
            <Link to={`${URLS.profile}${user.user_id}/`}>Se profil</Link>
          </Button>
          {isAdmin && (
            <>
              <ShadVerifyDialog
                buttonText='Promoter til leder'
                descriptionText='Dette vil gjøre brukeren til leder av gruppen.'
                icon={<StarIcon className='mr-2 w-4 h-4 stroke-[1.5px]' />}
                onConfirm={promoteUserToLeader}
                titleText={`Promoter ${user.first_name} ${user.last_name} til leder?`}
                variant='outline'
              />
              <ShadVerifyDialog
                buttonText='Fjern medlem'
                descriptionText='Dette vil fjerne brukeren fra gruppen.'
                icon={<ShieldMinus className='mr-2 w-4 h-4 stroke-[1.5px]' />}
                onConfirm={removeMemberFromGroup}
                titleText={`Fjern ${user.first_name} ${user.last_name} fra gruppen?`}
                variant='outline'
              />
            </>
          )}
        </div>
      </Expandable>
    </>
  );
};

export default MembershipListItem;
