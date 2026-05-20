import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button, PaginateButton } from '~/components/ui/button';
import Expandable from '~/components/ui/expandable';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';
import { useQuery } from '@tanstack/react-query';
import { getGroupFinesQuery } from '~/api/queries/groups';
import FineItem, { type FineItemProps } from './FineItem';
import type { GroupUserFine } from '~/types';
import { Check, HandCoins } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// TODO: Re-add batch update user fines — previously used useBatchUpdateUserGroupFines from ~/hooks/Group.
// The new query layer does not yet have a batch update user fines endpoint.

// TODO: Re-add analytics — previously used useAnalytics() from ~/hooks/Utils

export type UserFineItemProps = Pick<FineItemProps, 'groupSlug' | 'isAdmin'> & {
  userFine: GroupUserFine;
  filters: {
    approved?: boolean;
    payed?: boolean;
  };
};

const UserFineItem = ({ userFine, groupSlug, isAdmin, filters }: UserFineItemProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  // TODO: Replace with user-specific fines query when available
  const { data, isFetching } = useQuery({
    ...getGroupFinesQuery(groupSlug, 0, filters as never, 100),
    enabled: expanded,
  });
  const fines = Array.isArray(data) ? data : [];

  const toggleApproved = () => {
    // TODO: Implement batch approve when batch mutation is available
    toast.error('Batch-godkjenning er ikke implementert enda');
  };

  const togglePayed = () => {
    // TODO: Implement batch pay when batch mutation is available
    toast.error('Batch-betaling er ikke implementert enda');
  };

  const UserAvatar = (
    <Avatar>
      <AvatarImage alt={userFine.user.first_name} src={userFine.user.image} />
      <AvatarFallback>{userFine.user.first_name[0] + userFine.user.last_name[0]}</AvatarFallback>
    </Avatar>
  );

  const FinesAmount = <h1 className='text-2xl font-bold'>{userFine.fines_amount}</h1>;

  const ApprovedButton = (
    <Button className='w-full' variant='outline'>
      <Check className='w-5 h-5 mr-2' />
      Godkjenn alle
    </Button>
  );

  const PaidButton = (
    <Button className='w-full' variant='outline'>
      <HandCoins className='w-5 h-5 mr-2' />
      Betal alle
    </Button>
  );

  return (
    <Expandable
      extra={FinesAmount}
      icon={UserAvatar}
      onOpenChange={setExpanded}
      open={expanded}
      title={`${userFine.user.first_name} ${userFine.user.last_name}`}>
      {isAdmin && !fines.length && <h1 className='text-center'>Ingen boter</h1>}
      {isAdmin && fines.length > 0 && (
        <div className='flex items-center space-x-4 pb-4'>
          <ResponsiveAlertDialog
            action={toggleApproved}
            description='Alle botene til brukeren, uavhengig av valgte filtre, vil bli merket som godkjent.'
            title='Godkjenn alle boter'
            trigger={ApprovedButton}
            actionText='Godkjenn alle boter'
            destructive={false}
          />

          <ResponsiveAlertDialog
            action={togglePayed}
            description='Alle botene til brukeren, uavhengig av valgte filtre, vil bli merket som betalt.'
            title='Betal alle boter'
            trigger={PaidButton}
            actionText='Betal alle boter'
            destructive={false}
          />
        </div>
      )}
      {fines.map((fine: { id: string }) => (
        <FineItem fine={fine as never} fineUser={userFine.user} groupSlug={groupSlug} hideUserInfo isAdmin={isAdmin} key={fine.id} />
      ))}

      {/* TODO: Re-add pagination */}
      {false && <PaginateButton className='w-full mt-4' isLoading={isFetching} nextPage={() => {}} />}
    </Expandable>
  );
};

export default UserFineItem;
