import ArrowBackIcon from '@mui/icons-material/ArrowBackRounded';
import { IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import { parseISO } from 'date-fns';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate } from 'utils';

import { useBadge, useBadgeLeaderboard } from 'hooks/Badge';

import BadgeItem from 'pages/Badges/components/BadgeItem';

import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import { PrimaryTopBox } from 'components/layout/TopBox';
import Avatar from 'components/miscellaneous/Avatar';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import Page from 'components/navigation/Page';

const BadgeDetails = () => {
  const { badgeId } = useParams<'badgeId'>();
  const { data: badge } = useBadge(badgeId || '_');
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useBadgeLeaderboard(badgeId || '_');
  const leaderboardEntries = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <Page banner={<PrimaryTopBox />} options={{ title: badge?.title || 'Laster...' }}>
      <Paper sx={{ margin: '-60px auto 60px', position: 'relative' }}>
        <Stack direction='row' gap={1} sx={{ alignItems: 'center', flex: 1 }}>
          <IconButton component={Link} to={URLS.badges.categories()}>
            <ArrowBackIcon />
          </IconButton>
          {badge && <BadgeItem badge={badge} />}
        </Stack>
        <Typography sx={{ mt: 2 }} variant='h3'>
          Ledertavle
        </Typography>
        {!isLoading && !leaderboardEntries.length && <NotFoundIndicator header='Ingen har mottatt dette badget enda' />}
        {error && <Paper>{error.detail}</Paper>}
        {data !== undefined && (
          <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
            <Stack component={List} gap={1}>
              {leaderboardEntries.map((entry) => (
                <ListItem component={Paper} disablePadding key={entry.user.user_id} noOverflow noPadding>
                  <ListItemButton component={Link} to={`${URLS.profile}${entry.user.user_id}/`}>
                    <ListItemAvatar>
                      <Avatar user={entry.user} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${entry.user.first_name} ${entry.user.last_name}`}
                      secondary={`Mottatt: ${formatDate(parseISO(entry.created_at))}`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </Stack>
          </Pagination>
        )}
      </Paper>
    </Page>
  );
};

export default BadgeDetails;
