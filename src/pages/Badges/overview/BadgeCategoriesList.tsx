import { createFileRoute } from '@tanstack/react-router';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import { PaginateButton } from '~/components/ui/button';
import { useBadgeCategories } from '~/hooks/Badge';
import BadgeCategoryItem from '~/pages/Badges/components/BadgeCategoryItem';
import { useMemo } from 'react';

export const Route = createFileRoute('/_MainLayout/badges/_index/kategorier')({
  component: BadgeCategoriesList,
});

function BadgeCategoriesList() {
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useBadgeCategories();
  const badgeCategories = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <>
      {!isLoading && !badgeCategories.length && <NotFoundIndicator header='Fant ingen badge kategorier' />}
      {error && <h1 className='text-center mt-4'>{error.detail}</h1>}
      {data !== undefined && (
        <div className='space-y-2 mt-4'>
          {badgeCategories.map((badgeCategory) => (
            <BadgeCategoryItem badgeCategory={badgeCategory} key={badgeCategory.id} />
          ))}
        </div>
      )}
      {hasNextPage && <PaginateButton className='w-full mt-4' isLoading={isFetching} nextPage={fetchNextPage} />}
    </>
  );
}
