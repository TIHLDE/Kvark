import Delete from '@mui/icons-material/DeleteRounded';
import { parseISO } from 'date-fns';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';
import { formatDate } from 'utils';

import { Strike, UserBase } from 'types';

import { useDeleteStrike } from 'hooks/Strike';
import { useUserPermissions } from 'hooks/User';

import VerifyDialog from 'components/layout/VerifyDialog';
import EventListItem from 'components/miscellaneous/EventListItem';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'components/ui/collapsible';

export type StrikeProps = {
  strike: Strike;
  user: UserBase;
  displayUserInfo?: boolean;
};

const StrikeListItem = ({ strike, user, displayUserInfo = false }: StrikeProps) => {
  const { data: permissions } = useUserPermissions();
  const deleteStrike = useDeleteStrike(user.user_id);
  const [expanded, setExpanded] = useState(false);
  const deleteHandler = () => deleteStrike.mutate(strike.id);
  const primaryText = displayUserInfo ? `${user.first_name} ${user.last_name}` : strike.description;
  return (
    <Card>
      <Collapsible className='w-full bg-white dark:bg-inherit border border-secondary rounded-md' onOpenChange={setExpanded} open={expanded}>
        <CollapsibleTrigger asChild>
          <Button
            className='py-8 w-full rounded-t-md rounded-b-none bg-white dark:bg-inherit dark:hover:bg-secondary border-none flex justify-between items-center'
            variant='outline'>
            <div className='flex items-center space-x-4'>
              <h1 className='text-xl font-semibold'>{strike.strike_size}</h1>
              <div className='text-start'>
                <h1>{primaryText}</h1>
                <h1 className='text-sm'>{`Utløper ${formatDate(parseISO(strike.expires_at))}`}</h1>
              </div>
            </div>
            <div>{expanded ? <ChevronDownIcon className='stroke-[1.5px]' /> : <ChevronRightIcon className='stroke-[1.5px]' />}</div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className='border border-t-secondary border-b-0 border-x-0 p-4'>
          <div className='space-y-2'>
            <div>
              {permissions?.permissions.strike.read && Boolean(strike.creator) && (
                <h1>{`Opprettet av: ${strike.creator?.first_name} ${strike.creator?.last_name}`}</h1>
              )}
              <h1>{`Opprettet: ${formatDate(parseISO(strike.created_at))}`}</h1>
              {displayUserInfo && <h1>{`Begrunnelse: ${strike.description}`}</h1>}
            </div>
            {strike.event !== undefined && <EventListItem event={strike.event} />}
            {permissions?.permissions.strike.destroy && (
              <VerifyDialog color='error' contentText={`Er du sikker på at du vil slette denne prikken?`} onConfirm={deleteHandler} startIcon={<Delete />}>
                Slett prikk
              </VerifyDialog>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default StrikeListItem;
