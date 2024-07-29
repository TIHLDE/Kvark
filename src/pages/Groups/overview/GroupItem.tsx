import { Mail, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';

import { GroupList } from 'types';

import AspectRatioImg from 'components/miscellaneous/AspectRatioImg';
import { Skeleton } from 'components/ui/skeleton';

export type GroupItemProps = {
  group: GroupList;
};

const GroupItem = ({ group }: GroupItemProps) => (
  <Link className='flex space-x-4 text-black dark:text-white rounded-md bg-card border p-1 hover:border-primary' to={URLS.groups.details(group.slug)}>
    <AspectRatioImg alt={group?.image_alt || ''} className='w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] rounded-md ratio-[1]' src={group?.image || ''} />

    <div className='flex flex-col flex-1 overflow-hidden'>
      <h1 className='text-ellipsis md:text-lg font-bold text-start'>{group.name}</h1>
      {group.leader && (
        <div className='flex items-center space-x-1'>
          <User className='w-4 h-4 stroke-[1.5px]' />
          <p className='text-sm'>
            {group.leader.first_name} {group.leader.last_name}
          </p>
        </div>
      )}
      {group.contact_email && (
        <div className='flex items-center space-x-1 w-full overflow-hidden'>
          <Mail className='w-4 h-4 stroke-[1.5px]' />
          <p className='text-sm overflow-hidden whitespace-nowrap text-ellipsis'>{group.contact_email}</p>
        </div>
      )}
    </div>
  </Link>
);

export default GroupItem;

export const GroupItemLoading = () => (
  <div className='rounded-md bg-card border p-4 flex items-center space-x-4'>
    <Skeleton className='w-20 h-20' />
    <div className='space-y-2 w-3/5'>
      <Skeleton className='w-full h-4' />
      <div className='flex items-center space-x-2'>
        <User className='w-5 h-5 text-muted-foreground' />
        <Skeleton className='w-4/5 h-3' />
      </div>
      <div className='flex items-center space-x-2'>
        <Mail className='w-5 h-5 text-muted-foreground' />
        <Skeleton className='w-4/5 h-3' />
      </div>
    </div>
  </div>
);
