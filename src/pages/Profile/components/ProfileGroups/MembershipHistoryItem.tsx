import { Box, ButtonBase, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate, getMembershipType } from 'utils';

import { MembershipHistory } from 'types';

import Paper from 'components/layout/Paper';
import AspectRatioImg, { AspectRatioLoading } from 'components/miscellaneous/AspectRatioImg';

export type MembershipItemProps = {
  membershipHistory: MembershipHistory;
};

const MembershipHistoryItem = ({ membershipHistory }: MembershipItemProps) => (
  <Paper noOverflow noPadding>
    <ButtonBase
      component={Link}
      focusRipple
      sx={{ width: '100%', height: '100%', minHeight: 90, justifyContent: 'flex-start' }}
      to={URLS.groups.details(membershipHistory.group.slug)}>
      <Stack
        alignItems='center'
        direction='row'
        divider={<Divider flexItem orientation='vertical' />}
        gap={1}
        justifyContent='flex-start'
        sx={{ pl: 1, overflow: 'hidden' }}>
        {/* TODO: fjern div rundt AspectRatioImg når flere nettlesere støtter aspect-ratio i css - https://caniuse.com/mdn-css_properties_aspect-ratio */}
        <Box sx={{ display: 'block', height: 70, width: 70 }}>
          <AspectRatioImg
            alt={membershipHistory.group.image_alt || ''}
            borderRadius
            ratio={1}
            src={membershipHistory.group.image || ''}
            sx={{ width: 70, height: 70 }}
          />
        </Box>
        <Stack>
          <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} variant='h3'>
            {membershipHistory.group.name} - {getMembershipType(membershipHistory.membership_type)}
          </Typography>
          <Typography sx={{ fontSize: '0.8rem' }}>
            {`${formatDate(parseISO(membershipHistory.start_date), { time: false, fullMonth: true })} -> ${formatDate(parseISO(membershipHistory.end_date), {
              time: false,
              fullMonth: true,
            })}`}
          </Typography>
        </Stack>
      </Stack>
    </ButtonBase>
  </Paper>
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
