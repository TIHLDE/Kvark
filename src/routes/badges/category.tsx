import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, notFound } from '@tanstack/react-router';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import { Button, PaginateButton } from '~/components/ui/button';
import { badgeCategoryQueryOptions } from '~/hooks/Badge';
import { Loader2Icon } from 'lucide-react';

import BadgeCategoryItem from './components/BadgeCategoryItem';

export const Route = createFileRoute('/_MainLayout/badges/_layout/kategorier')({
  loader: async ({ context }) => {
    const data = await context.queryClient.ensureInfiniteQueryData(badgeCategoryQueryOptions());
    if (data == null || data.pages.length === 0) throw notFound();
  },
  component: BadgeCategoriesList,
  pendingComponent: LoadingComponent,
  notFoundComponent: () => <NotFoundIndicator header='Fant ingen badge kategorier' />,
  errorComponent: ({ error, reset }) => (
    <div className='flex flex-col items-center justify-center w-full gap-2 h-full mt-3'>
      <span className='text-red-500'>{error.message}</span>
      <Button onClick={reset} variant='outline'>
        Prøv igjen
      </Button>
    </div>
  ),
});

function LoadingComponent() {
  return (
    <div>
      <Loader2Icon className='animate-spin size-6' />
      <span>Laster inn kategorier...</span>
    </div>
  );
}

function BadgeCategoriesList() {
  const { data, error, isLoading, hasNextPage, fetchNextPage } = useSuspenseInfiniteQuery({
    ...badgeCategoryQueryOptions(),
    select: ({ pages }) => pages.flatMap((page) => page.results),
  });
  if (error) throw error;
  if (data == null || data.length === 0) throw notFound();

  return (
    <>
      <div className='space-y-2 mt-4'>
        {data.map((badgeCategory) => (
          <BadgeCategoryItem badgeCategory={badgeCategory} key={badgeCategory.id} />
        ))}
      </div>
      {hasNextPage && <PaginateButton className='w-full mt-4' isLoading={isLoading} nextPage={fetchNextPage} />}
    </>
  );
}
