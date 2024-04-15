import { ButtonBase, Divider, Skeleton, Stack } from '@mui/material';
import { parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate } from 'utils';

import { MembershipHistory } from 'types';

import Paper from 'components/layout/Paper';
import { AspectRatioLoading } from 'components/miscellaneous/AspectRatioImg';
import { Card, CardContent } from 'components/ui/card';
import { Separator } from 'components/ui/separator';

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
          <h1 className='text-lg break-words font-semibold'>{membershipHistory.group.name}</h1>
          <h1 className='text-sm'>
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
  <Paper noOverflow noPadding>
    <ButtonBase focusRipple sx={{ width: '100%', height: '100%', minHeight: 90, justifyContent: 'flex-start' }}>
      <Stack alignItems='center' direction='row' divider={<Divider flexItem orientation='vertical' />} gap={1} justifyContent='flex-start' sx={{ pl: 1 }}>
        <AspectRatioLoading sx={{ width: 70, height: 70 }} />
        <Stack>
          <Skeleton width={100} />
          <Skeleton sx={{ fontSize: '0.8rem', ml: 1 }} width={120} />
        </Stack>
      </Stack>
    </ButtonBase>
  </Paper>
);
