import BadgesLeaderboard from '~/pages/Badges/BadgesLeaderboard';

import { Route } from './+types/BadgesCategoryLeaderboard';

export function clientLoader({ params }: Route.ClientLoaderArgs) {
  const { categoryId } = params;
  return {
    categoryId,
  };
}

export default function BadgesOverallLeaderboard({ loaderData: { categoryId } }: Route.ComponentProps) {
  return <BadgesLeaderboard filters={{ category: categoryId }} />;
}
