import BadgesIcon from '@mui/icons-material/EmojiEventsRounded';
import LeaderboardIcon from '@mui/icons-material/LeaderboardRounded';
import { Typography } from '@mui/material';
import { Suspense } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import URLS from 'URLS';

import { useBadgeCategory } from 'hooks/Badge';

import Paper from 'components/layout/Paper';
import { RouterTabs } from 'components/layout/Tabs';
import { PrimaryTopBox } from 'components/layout/TopBox';
import Page from 'components/navigation/Page';

const BadgeCategory = () => {
  const { categoryId } = useParams<'categoryId'>();
  const { data } = useBadgeCategory(categoryId || '_');
  const leaderboardTab = { to: URLS.badges.category_leaderboard(categoryId || '_'), label: 'Ledertavle', icon: LeaderboardIcon };
  const badgesTab = { to: URLS.badges.category_badges(categoryId || '_'), label: 'Offentlige badges', icon: BadgesIcon };
  const tabs = [leaderboardTab, badgesTab];

  return (
    <Page banner={<PrimaryTopBox />} options={{ title: 'Badge kategori' }}>
      <Paper sx={{ margin: '-60px auto 60px', position: 'relative' }}>
        <Typography variant='h1'>{data?.name}</Typography>
        <RouterTabs tabs={tabs} />
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </Paper>
    </Page>
  );
};

export default BadgeCategory;
