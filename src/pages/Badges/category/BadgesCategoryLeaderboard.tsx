import { createFileRoute } from '@tanstack/react-router';
import { authClientWithRedirect } from '~/api/auth';
import BadgesLeaderboard from '~/pages/Badges/BadgesLeaderboard';

export const Route = createFileRoute('/_MainLayout/badges/kategorier/$categoryId/')({
  component: BadgesCategoryLeaderboard,
  async beforeLoad({ location }) {
    await authClientWithRedirect(location.href);
  },
});

function BadgesCategoryLeaderboard() {
  const { categoryId } = Route.useParams();
  return <BadgesLeaderboard filters={{ category: categoryId }} />;
}
