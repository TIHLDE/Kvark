import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button, PaginateButton } from '~/components/ui/button';
import Expandable from '~/components/ui/expandable';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';
import { useBatchUpdateUserGroupFines, useGroupUserFines } from '~/hooks/Group';
import { useAnalytics } from '~/hooks/Utils';
import FineItem, { FineItemProps } from '~/pages/Groups/fines/FineItem';
import type { GroupUserFine } from '~/types';
import { Check, HandCoins } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export type UserFineItemProps = Pick<FineItemProps, 'groupSlug' | 'isAdmin'> & {
  userFine: GroupUserFine;
  filters: {
    approved?: boolean;
    payed?: boolean;
  };
};

const UserFineItem = ({ userFine, groupSlug, isAdmin, filters }: UserFineItemProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const { event } = useAnalytics();

  const updateUserFines = useBatchUpdateUserGroupFines(groupSlug, userFine.user.user_id);

  const { data, hasNextPage, isFetching, fetchNextPage } = useGroupUserFines(groupSlug, userFine.user.user_id, filters, { enabled: expanded });
  const fines = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  const toggleApproved = () => {
    event('update-batch', 'fines', `Approved all fines of user`);
    updateUserFines.mutate(
      { approved: true },
      {
        onSuccess: () => {
          toast.success('Bøtene er nå godkjent');
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      },
    );
  };

  const togglePayed = () => {
    event('update-batch', 'fines', `Payed all fines of user`);
    updateUserFines.mutate(
      { payed: true },
      {
        onSuccess: () => {
          toast.success('Bøtene er nå betalt');
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      },
    );
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
      {isAdmin && !fines.length && <h1 className='text-center'>Ingen bøter</h1>}
      {isAdmin && fines.length > 0 && (
        <div className='flex items-center space-x-4 pb-4'>
          <ResponsiveAlertDialog
            action={toggleApproved}
            description='Alle bøtene til brukeren, uavhengig av valgte filtre, vil bli merket som godkjent.'
            title='Godkjenn alle bøter'
            trigger={ApprovedButton}
          />

          <ResponsiveAlertDialog
            action={togglePayed}
            description='Alle bøtene til brukeren, uavhengig av valgte filtre, vil bli merket som betalt.'
            title='Betal alle bøter'
            trigger={PaidButton}
          />
        </div>
      )}
      {fines.map((fine) => (
        <FineItem fine={fine} fineUser={userFine.user} groupSlug={groupSlug} hideUserInfo isAdmin={isAdmin} key={fine.id} />
      ))}

      {hasNextPage && <PaginateButton className='w-full mt-4' isLoading={isFetching} nextPage={fetchNextPage} />}
    </Expandable>
  );
};

export default UserFineItem;
