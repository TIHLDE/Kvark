import { parseISO } from 'date-fns';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate, getUserAffiliation } from 'utils';

import { Membership, UserList } from 'types';

import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Button } from 'components/ui/button';
import Expandable from 'components/ui/expandable';
import { Separator } from 'components/ui/separator';

import PromoteMember from './PromoteMember';
import RemoveMember from './RemoveMember';

export type MembershipListItemProps = {
  membership: Membership;
  isAdmin?: boolean;
};

const MembershipListItem = ({ membership, isAdmin }: MembershipListItemProps) => {
  const user = membership.user as UserList;

  const UserAvatar = () => (
    <Avatar>
      <AvatarImage alt={user.first_name} src={user.image} />
      <AvatarFallback>{user.first_name[0] + user.last_name[0]}</AvatarFallback>
    </Avatar>
  );

  return (
    <Expandable
      description={`${formatDate(parseISO(membership.created_at), { time: false, fullMonth: true })} -> nå`}
      icon={<UserAvatar />}
      title={`${user.first_name} ${user.last_name}`}>
      <div className='space-y-4'>
        <div className='text-sm'>
          {isAdmin && (
            <p>
              <strong>Allergier:</strong> {user.allergy ? user.allergy : 'Har ingen allergier'}
            </p>
          )}
          <p>
            <strong>E-post:</strong> {user.email}
          </p>
          <p>{getUserAffiliation(user)}</p>
        </div>

        {isAdmin && (
          <>
            <Separator />

            <div className='space-y-2 md:flex md:items-center md:space-x-2 md:space-y-0'>
              <Button asChild className='w-full text-black dark:text-white' variant='outline'>
                <Link to={`${URLS.profile}${user.user_id}/`}>
                  <User className='mr-2 w-5 h-5 stroke-[1.5px]' />
                  Se profil
                </Link>
              </Button>
              <PromoteMember membership={membership} user={user} />
              <RemoveMember membership={membership} user={user} />
            </div>
          </>
        )}
      </div>
    </Expandable>
  );
};

export default MembershipListItem;
