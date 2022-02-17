import { useParams } from 'react-router-dom';

import { useBadgeCategoryLeaderboard } from 'hooks/Badge';

import BadgesLeaderboard from 'pages/Badges/BadgesLeaderboard';

export const BadgesOverallLeaderboard = () => {
  const { categoryId } = useParams<'categoryId'>();
  const queryResult = useBadgeCategoryLeaderboard(categoryId || '_');
  return <BadgesLeaderboard queryResult={queryResult} />;
};

export default BadgesOverallLeaderboard;
