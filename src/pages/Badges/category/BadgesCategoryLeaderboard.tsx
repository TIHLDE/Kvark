import { useParams } from 'react-router-dom';

import { useBadgesOverallLeaderboard } from 'hooks/Badge';

import BadgesLeaderboard from 'pages/Badges/BadgesLeaderboard';

export const BadgesOverallLeaderboard = () => {
  const { categoryId } = useParams<'categoryId'>();
  const queryResult = useBadgesOverallLeaderboard({ category: categoryId || '_' }, { enabled: Boolean(categoryId) });
  return <BadgesLeaderboard queryResult={queryResult} />;
};

export default BadgesOverallLeaderboard;
