import { getUserAffiliation } from 'utils';

import { UserList } from 'types';

import { useUserStrikes } from 'hooks/User';

import StrikeListItem from 'components/miscellaneous/StrikeListItem';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import Expandable from 'components/ui/expandable';

export type StrikeListProps = {
  user: UserList;
};

const StrikeList = ({ user }: StrikeListProps) => {
  const { data = [] } = useUserStrikes(user.user_id);
  return (
    <div className='space-y-2'>
      {data.map((strike) => (
        <StrikeListItem key={strike.id} strike={strike} user={user} />
      ))}
    </div>
  );
};

export type UserListItemProps = {
  user: UserList;
};

const UserStrikeListItem = ({ user }: UserListItemProps) => {
  const UserAvatar = (
    <Avatar>
      <AvatarImage alt={user.first_name} src={user.image} />
      <AvatarFallback>
        {user.first_name[0]}
        {user.last_name[0]}
      </AvatarFallback>
    </Avatar>
  );

  const TotalStrikes = <h1 className='text-2xl font-bold'>{user.number_of_strikes}</h1>;

  return (
    <Expandable
      className='dark:bg-card'
      description={getUserAffiliation(user)}
      extra={TotalStrikes}
      icon={UserAvatar}
      title={`${user.first_name} ${user.last_name}`}>
      <StrikeList user={user} />
    </Expandable>
  );
};

export default UserStrikeListItem;
