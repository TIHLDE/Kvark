import { createFileRoute } from '@tanstack/react-router';
import { authClientWithRedirect } from '~/api/auth';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { PaginateButton } from '~/components/ui/button';
import { useBadges } from '~/hooks/Badge';
import BadgeItem, { BadgeItemLoading } from '~/pages/Badges/components/BadgeItem';
import { Info } from 'lucide-react';
import { useMemo } from 'react';

export const Route = createFileRoute('/_MainLayout/badges/kategorier/$categoryId/badges')({
  async beforeLoad({ location }) {
    await authClientWithRedirect(location.href);
  },
  component: CategoryBadgesList,
});

function CategoryBadgesList() {
  const { categoryId } = Route.useParams();
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useBadges({ badge_category: categoryId });
  const badges = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <div className='mt-4 space-y-4'>
      <Alert>
        <Info className='w-5 h-5' />
        <AlertTitle>Her vises kun offentlige badges</AlertTitle>
        <AlertDescription>
          Det kan finnes andre badges som er mulig å få, men som ikke vises her for å hindre at det blir for lett å finne dem.
        </AlertDescription>
      </Alert>

      {isLoading && <BadgeItemLoading />}
      {!isLoading && !badges.length && <NotFoundIndicator header='Fant ingen offentlige badges' />}
      {error && <h1 className='text-center mt-4'>{error.detail}</h1>}
      {data !== undefined && (
        <div className='w-full grid lg:grid-cols-2 gap-4'>
          {badges.map((badge, index) => (
            <BadgeItem badge={badge} key={index} />
          ))}
        </div>
      )}
      {hasNextPage && <PaginateButton className='w-full mt-4' isLoading={isFetching} nextPage={fetchNextPage} />}
    </div>
  );
}
