import { createFileRoute } from '@tanstack/react-router';

import BadgesLeaderboard from './components/BadgesLeaderboard';

export const Route = createFileRoute('/_MainLayout/badges/_layout/')({
  component: BadgesLeaderboard,
});
