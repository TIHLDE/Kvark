import { useBadgesOverallLeaderboard } from 'hooks/Badge';

import BadgesLeaderboard from 'pages/Badges/BadgesLeaderboard';

export const BadgesOverallLeaderboard = () => {
  const queryResult = useBadgesOverallLeaderboard();
  return <BadgesLeaderboard queryResult={queryResult} />;
};

export default BadgesOverallLeaderboard;
