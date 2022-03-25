import { Mail } from '@mui/icons-material';
import MembersIcon from '@mui/icons-material/PersonRounded';
import { Box, ButtonBase, Divider, Skeleton, Stack, Theme, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import URLS from 'URLS';

import { Group } from 'types';

import Paper from 'components/layout/Paper';
import AspectRatioImg, { AspectRatioLoading } from 'components/miscellaneous/AspectRatioImg';
export type GroupItemProps = {
  group: Group;
  background?: keyof Theme['palette']['background'];
};

const GroupItem = ({ group, background = 'paper' }: GroupItemProps) => (
  <Paper noOverflow noPadding sx={{ background: (theme) => theme.palette.background[background] }}>
    <ButtonBase
      component={Link}
      focusRipple
      sx={{ width: '100%', height: '100%', minHeight: 90, justifyContent: 'flex-start' }}
      to={URLS.groups.details(group.slug)}>
      <Stack
        alignItems='center'
        direction='row'
        divider={<Divider flexItem orientation='vertical' />}
        gap={1}
        justifyContent='flex-start'
        sx={{ pl: 1, overflow: 'hidden' }}>
        <Box sx={{ display: 'block', height: 70, width: 70 }}>
          <AspectRatioImg alt={group?.image_alt || ''} borderRadius ratio={1} src={group?.image || ''} sx={{ width: 70, height: 70 }} />
        </Box>
        <Stack>
          <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} variant='h3'>
            {group.name}
          </Typography>
          {group.leader && (
            <Stack alignItems='center' direction='row'>
              <MembersIcon sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }} />
              <Typography sx={{ fontSize: '0.8rem', ml: 1 }}>
                {group.leader.first_name} {group.leader.last_name}
              </Typography>
            </Stack>
          )}
          {group.contact_email && (
            <Stack alignItems='center' direction='row'>
              <Mail sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }} />
              <Typography sx={{ fontSize: '0.8rem', ml: 1 }}>{group.contact_email}</Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </ButtonBase>
  </Paper>
);

export default GroupItem;

export const GroupItemLoading = ({ background = 'paper' }: Pick<GroupItemProps, 'background'>) => (
  <Paper noOverflow noPadding sx={{ background: (theme) => theme.palette.background[background] }}>
    <ButtonBase focusRipple sx={{ width: '100%', height: '100%', minHeight: 90, justifyContent: 'flex-start' }}>
      <Stack alignItems='center' direction='row' divider={<Divider flexItem orientation='vertical' />} gap={1} justifyContent='flex-start' sx={{ pl: 1 }}>
        <AspectRatioLoading sx={{ width: 70, height: 70 }} />
        <Stack>
          <Skeleton width={100} />

          <Stack direction='row'>
            <MembersIcon sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }} />
            <Skeleton sx={{ fontSize: '0.8rem', ml: 1 }} width={120} />
          </Stack>
          <Stack direction='row'>
            <Mail sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }} />
            <Skeleton sx={{ fontSize: '0.8rem', ml: 1 }} width={120} />
          </Stack>
        </Stack>
      </Stack>
    </ButtonBase>
  </Paper>
);
