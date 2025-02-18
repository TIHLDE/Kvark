import { useBadgesOverallLeaderboard } from '~/hooks/Badge';
import BadgesLeaderboard from '~/pages/Badges/BadgesLeaderboard';
import { useParams } from 'react-router';

export const BadgesOverallLeaderboard = () => {
  const { categoryId } = useParams<'categoryId'>();
  return <BadgesLeaderboard filters={{ category: categoryId || '_' }} options={{ enabled: Boolean(categoryId) }} useHook={useBadgesOverallLeaderboard} />;
};

export default BadgesOverallLeaderboard;
