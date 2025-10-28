import { createFileRoute } from '@tanstack/react-router';
import BadgesLeaderboard from '~/pages/Badges/BadgesLeaderboard';

export const Route = createFileRoute('/_MainLayout/badges/_index/')({
  component: BadgesLeaderboard,
});
