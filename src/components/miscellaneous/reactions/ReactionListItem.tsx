import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import NavLink from '~/components/ui/navlink';
import type { Reaction } from '~/types';

export const ReactionListItem = (reaction: Reaction) => {
  return (
    <NavLink
      className='w-full px-4 py-2 rounded-md border bg-card flex justify-between items-center hover:bg-border transition-all duration-150'
      params={{ userId: reaction.user?.user_id }}
      to='/profil/:userId?'
    >
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
    </NavLink>
  );
};
