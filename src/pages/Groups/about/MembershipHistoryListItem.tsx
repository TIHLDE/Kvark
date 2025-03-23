import { parseISO } from 'date-fns';
import { User } from 'lucide-react';
import { Link } from 'react-router';
import URLS from '~/URLS';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import Expandable from '~/components/ui/expandable';
import { Separator } from '~/components/ui/separator';
import type { MembershipHistory } from '~/types';
import { formatDate, getMembershipType, getUserAffiliation } from '~/utils';

import DeleteMembershipHistory from './DeleteMembershipHistory';
import UpdateMembershipHistory from './UpdateMembershipHistory';

export type MembershipHistoryListItemProps = {
  membership: MembershipHistory;
  isAdmin?: boolean;
};

const MembershipHistoryListItem = ({ membership, isAdmin }: MembershipHistoryListItemProps) => {
  const user = membership.user;

  const UserAvatar = () => (
    <Avatar>
      <AvatarImage alt={user.first_name} src={user.image} />
      <AvatarFallback>{user.first_name[0] + user.last_name[0]}</AvatarFallback>
    </Avatar>
  );

  return (
    <Expandable
      description={`${formatDate(parseISO(membership.start_date), { time: false, fullMonth: true })} -> ${formatDate(parseISO(membership.end_date), {
        time: false,
        fullMonth: true,
      })} - ${getMembershipType(membership.membership_type)}`}
      icon={<UserAvatar />}
      title={`${user.first_name} ${user.last_name}`}
    >
      <div className='space-y-4'>
        <div className='text-sm'>
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

              <UpdateMembershipHistory membership={membership} />
              <DeleteMembershipHistory membership={membership} />
            </div>
          </>
        )}
      </div>
    </Expandable>
  );
};

export default MembershipHistoryListItem;
