import { parseISO } from 'date-fns';
import { Link } from 'react-router';
import URLS from '~/URLS';
import TIHLDE_LOGO from '~/assets/img/TihldeBackground.jpg';
import { Card, CardContent } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { Skeleton } from '~/components/ui/skeleton';
import type { Membership } from '~/types';
import { formatDate, getMembershipType } from '~/utils';

export type MembershipItemProps = {
  membership: Membership;
};

const MembershipItem = ({ membership }: MembershipItemProps) => (
  <Card className='hover:bg-secondary'>
    <CardContent className='p-0'>
      <Link className='px-3 py-2 flex items-center space-x-4' to={URLS.groups.details(membership.group.slug)}>
        <img alt={membership.group.image_alt || ''} className='w-16 h-16 rounded-sm object-cover' src={membership.group.image || TIHLDE_LOGO} />
        <Separator className='h-16' orientation='vertical' />
        <div className='space-y-1'>
          <h1 className='text-lg break-words font-semibold text-black dark:text-white'>{membership.group.name}</h1>
          <h1 className='text-sm text-muted-foreground'>
            {`${formatDate(parseISO(membership.created_at), { time: false, fullMonth: true })} -> nå - ${getMembershipType(membership.membership_type)}`}
          </h1>
        </div>
      </Link>
    </CardContent>
  </Card>
);

export default MembershipItem;

export const MembershipItemLoading = () => (
  <div className='grid lg:grid-cols-2 gap-2'>
    {Array.from({ length: 2 }).map((_, i) => (
      <Skeleton className='h-16' key={i} />
    ))}
  </div>
);
