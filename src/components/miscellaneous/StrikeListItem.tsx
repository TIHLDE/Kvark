import Delete from '@mui/icons-material/DeleteRounded';
import { parseISO } from 'date-fns';
import { formatDate } from 'utils';

import { Strike, UserBase } from 'types';

import { useDeleteStrike } from 'hooks/Strike';
import { useUserPermissions } from 'hooks/User';

import VerifyDialog from 'components/layout/VerifyDialog';
import EventListItem from 'components/miscellaneous/EventListItem';
import Expandable from 'components/ui/expandable';

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
    </Expandable>
  );
};

export default StrikeListItem;
