import { parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate } from 'utils';

import { MembershipHistory } from 'types';

import { Card, CardContent } from 'components/ui/card';
import { Separator } from 'components/ui/separator';
import { Skeleton } from 'components/ui/skeleton';

import TIHLDE_LOGO from 'assets/img/TihldeBackground.jpg';

export type MembershipItemProps = {
  membershipHistory: MembershipHistory;
};

const MembershipHistoryItem = ({ membershipHistory }: MembershipItemProps) => (
  <Card className='hover:bg-secondary'>
    <CardContent className='p-0'>
      <Link className='px-3 py-2 flex items-center space-x-4' to={URLS.groups.details(membershipHistory.group.slug)}>
        <img alt={membershipHistory.group.image_alt || ''} className='w-16 h-16 rounded-sm object-cover' src={membershipHistory.group.image || TIHLDE_LOGO} />
        <Separator className='h-16' orientation='vertical' />
        <div className='space-y-1'>
          <h1 className='text-lg break-words font-semibold text-black dark:text-white'>{membershipHistory.group.name}</h1>
          <h1 className='text-sm text-muted-foreground'>
            {`${formatDate(parseISO(membershipHistory.start_date), { time: false, fullMonth: true })} -> ${formatDate(parseISO(membershipHistory.end_date), {
              time: false,
              fullMonth: true,
            })}`}
          </h1>
        </div>
      </Link>
    </CardContent>
  </Card>
);

export default MembershipHistoryItem;

export const MembershipHistoryItemLoading = () => (
  <div className='grid lg:grid-cols-2 gap-2'>
    {Array.from({ length: 2 }).map((_, i) => (
      <Skeleton className='h-16' key={i} />
    ))}
  </div>
);
