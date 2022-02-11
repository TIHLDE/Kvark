import CategoryIcon from '@mui/icons-material/CategoryRounded';
import BadgesIcon from '@mui/icons-material/EmojiEventsRounded';
import LeaderboardIcon from '@mui/icons-material/LeaderboardRounded';
import { Typography } from '@mui/material';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import URLS from 'URLS';

import Paper from 'components/layout/Paper';
import { RouterTabs } from 'components/layout/Tabs';
import { PrimaryTopBox } from 'components/layout/TopBox';
import Page from 'components/navigation/Page';

const Badges = () => {
  const leaderboardTab = { to: URLS.badges.index, label: 'Ledertavle', icon: LeaderboardIcon };
  const badgesTab = { to: URLS.badges.public_badges(), label: 'Offentlige badges', icon: BadgesIcon };
  const categoriesTab = { to: URLS.badges.categories(), label: 'Kategorier', icon: CategoryIcon };
  const tabs = [leaderboardTab, badgesTab, categoriesTab];

  return (
    <Page banner={<PrimaryTopBox />} options={{ title: 'Badges' }}>
      <Paper sx={{ margin: '-60px auto 60px', position: 'relative' }}>
        <Typography variant='h1'>Badges</Typography>
        <RouterTabs tabs={tabs} />
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </Paper>
    </Page>
  );
};

export default Badges;
