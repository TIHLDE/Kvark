import { parseISO } from 'date-fns';
import { Trash } from 'lucide-react';
import { formatDate } from 'utils';

import { Strike, UserBase } from 'types';

import { useDeleteStrike } from 'hooks/Strike';
import { useUserPermissions } from 'hooks/User';

import EventListItem from 'components/miscellaneous/EventListItem';
import { Button } from 'components/ui/button';
import Expandable from 'components/ui/expandable';
import ResponsiveAlertDialog from 'components/ui/responsive-alert-dialog';

export type StrikeProps = {
  strike: Strike;
  user: UserBase;
  displayUserInfo?: boolean;
};

const StrikeListItem = ({ strike, user, displayUserInfo = false }: StrikeProps) => {
  const { data: permissions } = useUserPermissions();
  const deleteStrike = useDeleteStrike(user.user_id);
  const deleteHandler = () => deleteStrike.mutate(strike.id);
  const primaryText = displayUserInfo ? `${user.first_name} ${user.last_name}` : strike.description;

  return (
    <Expandable
      className='dark:bg-card'
      description={`Utløper ${formatDate(parseISO(strike.expires_at))}`}
      icon={<h1 className='text-xl font-semibold'>{strike.strike_size}</h1>}
      title={primaryText}>
      <div className='space-y-2'>
        <div className='text-sm'>
          {permissions?.permissions.strike.read && Boolean(strike.creator) && (
            <h1>{`Opprettet av: ${strike.creator?.first_name} ${strike.creator?.last_name}`}</h1>
          )}
          <h1>{`Opprettet: ${formatDate(parseISO(strike.created_at))}`}</h1>
          {displayUserInfo && <h1>{`Begrunnelse: ${strike.description}`}</h1>}
        </div>
        {strike.event !== undefined && <EventListItem event={strike.event} size='large' />}
        {permissions?.permissions.strike.destroy && (
          <ResponsiveAlertDialog
            action={deleteHandler}
            description='Er du sikker på at du vil slette denne prikken?'
            title='Slett prikk'
            trigger={
              <Button className='w-full' variant='destructive'>
                <Trash className='w-5 h-5 stroke-[1.5px]' />
                Slett prikk
              </Button>
            }
          />
        )}
      </div>
    </Expandable>
  );
};

export default StrikeListItem;
