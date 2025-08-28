import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import type { Reaction } from '~/types';
import { href, Link } from 'react-router';

export const ReactionListItem = (reaction: Reaction) => {
  return (
    <Link
      className='w-full px-4 py-2 rounded-md border bg-card flex justify-between items-center hover:bg-border transition-all duration-150'
      to={reaction.user?.user_id ? href('/profil/:userId?', { userId: reaction.user.user_id }) : href('/profil/:userId?')}>
      <div className='flex items-center space-x-2'>
        <Avatar>
          <AvatarImage alt={reaction.user?.first_name} src={reaction.user?.image} />
          <AvatarFallback>{(reaction.user && reaction.user.first_name[0] + reaction.user.last_name[0]) || 'TB'}</AvatarFallback>
        </Avatar>
        <h1>
          {reaction.user?.first_name} {reaction.user?.last_name}
        </h1>
      </div>

      <p className='text-2xl'>{reaction.emoji}</p>
    </Link>
  );
};
