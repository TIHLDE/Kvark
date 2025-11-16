import MarkdownRenderer from '~/components/miscellaneous/MarkdownRenderer';
import { Button } from '~/components/ui/button';
import Expandable from '~/components/ui/expandable';
import { useUpdateGroupFine } from '~/hooks/Group';
import { useUser } from '~/hooks/User';
import { useAnalytics } from '~/hooks/Utils';
import { cn } from '~/lib/utils';
import type { Group, GroupFine, UserBase } from '~/types';
import { formatDate } from '~/utils';
import { parseISO } from 'date-fns';
import { Check, HandCoins } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import DeleteFine from './DeleteFine';
import EditFine from './EditFine';
import FineDefense from './FineDefense';

export type FineItemProps = {
  fine: GroupFine;
  groupSlug: Group['slug'];
  isAdmin?: boolean;
  hideUserInfo?: boolean;
  fineUser?: UserBase;
};

const FineItem = ({ fine, groupSlug, isAdmin, hideUserInfo, fineUser }: FineItemProps) => {
  const { data: user } = useUser();
  const { event } = useAnalytics();
  const updateFine = useUpdateGroupFine(groupSlug, fine.id);
  const [approved, setApproved] = useState(fine.approved);

  const toggleApproved = () => {
    event('update', 'fines', `Approved a single fine`);

    setApproved(!fine.approved);

    updateFine.mutate(
      { approved: !fine.approved },
      {
        onSuccess: () => {
          toast.success(`Boten er nå markert som ${fine.approved ? 'ikke godkjent' : 'godkjent'}`);
        },
        onError: (e) => {
          toast.error(e.detail);
          setApproved(fine.approved);
        },
      },
    );
  };

  const togglePayed = () => {
    event('update', 'fines', `Payed a single fine`);
    updateFine.mutate(
      { payed: !fine.payed },
      {
        onSuccess: () => {
          toast.success(`Boten er nå markert som ${fine.payed ? 'ikke betalt' : 'betalt'}`);
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      },
    );
  };

  const FineAmount = <h1 className='text-xl font-bold'>{fine.amount}</h1>;

  const Title = (
    <div className='flex items-center space-x-1'>
      <h1>{hideUserInfo ? fine.description : `${fine.user.first_name} ${fine.user.last_name}`}</h1>
      <Check className={cn('w-4 h-4 stroke-[1.5px]', approved ? 'text-emerald-500' : 'text-red-500')} />
      <HandCoins className={cn('w-4 h-4 stroke-[1.5px]', fine.payed ? 'text-emerald-500' : 'text-red-500')} />
    </div>
  );

  return (
    <Expandable
      description={hideUserInfo ? formatDate(parseISO(fine.created_at), { fullDayOfWeek: true, fullMonth: true }) : fine.description}
      icon={FineAmount}
      title={Title}>
      <div className='space-y-4'>
        <div className='flex items-center space-x-2'>
          <div
            className={cn(
              'flex items-center space-x-1 px-2 py-1 rounded-md border text-sm',
              approved ? 'text-emerald-500 border-emerald-500' : 'text-red-500 border-red-500',
            )}>
            <Check className='w-4 h-4' />
            <span>{approved ? 'Godkjent' : 'Ikke godkjent'}</span>
          </div>

          <div
            className={cn(
              'flex items-center space-x-1 px-2 py-1 rounded-md border text-sm',
              fine.payed ? 'text-emerald-500 border-emerald-500' : 'text-red-500 border-red-500',
            )}>
            <HandCoins className='w-4 h-4' />
            <span>{fine.payed ? 'Betalt' : 'Ikke betalt'}</span>
          </div>
        </div>

        <div>
          <p className='text-sm'>
            Opprettet av: {fine.created_by.first_name} {fine.created_by.last_name}
          </p>
          <p className='text-sm'>Dato: {formatDate(parseISO(fine.created_at), { fullDayOfWeek: true, fullMonth: true })}</p>
        </div>

        {fine.reason && (
          <div className='space-y-1 rounded-md border p-2'>
            <h1 className='text-sm text-muted-foreground'>Begrunnelse:</h1>
            <MarkdownRenderer value={fine.reason} />
          </div>
        )}

        {fine.image && <img alt='Bildebevis' className='rounded-md max-w-[600px] mx-auto w-full' loading='lazy' src={fine.image} />}

        {fine.defense && (
          <div className='space-y-1 rounded-md border p-2'>
            <h1 className='text-sm text-muted-foreground'>Forsvar fra den tiltalte:</h1>
            <MarkdownRenderer value={fine.defense} />
          </div>
        )}

        {(fineUser || fine.user)?.user_id === user?.user_id && <FineDefense defense={fine.defense} fineId={fine.id} groupSlug={groupSlug} />}

        {isAdmin && (
          <div className='grid md:grid-cols-2 gap-4'>
            <Button className='w-full' onClick={toggleApproved} variant={approved ? 'destructive' : 'default'}>
              <Check className='w-5 h-5 mr-2' />
              Merk som {approved ? 'ikke godkjent' : 'godkjent'}
            </Button>
            <Button className='w-full' onClick={togglePayed} variant={fine.payed ? 'destructive' : 'default'}>
              <HandCoins className='w-5 h-5 mr-2' />
              Merk som {fine.payed ? 'ikke betalt' : 'betalt'}
            </Button>

            <EditFine fine={fine} groupSlug={groupSlug} />

            <DeleteFine fineId={fine.id} groupSlug={groupSlug} />
          </div>
        )}
      </div>
    </Expandable>
  );
};

export default FineItem;
