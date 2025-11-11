import { createFileRoute } from '@tanstack/react-router';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import Page from '~/components/navigation/Page';
import { PaginateButton } from '~/components/ui/button';
import { useToddels } from '~/hooks/Toddel';
import { HavePermission } from '~/hooks/User';
import ToddelListItem, { ToddelListItemLoading } from '~/pages/Toddel/components/ToddelListItem';
import { PermissionApp } from '~/types/Enums';
import { useMemo } from 'react';

import CreateToddelDialog from './components/CreateToddelDialog';

export const Route = createFileRoute('/_MainLayout/toddel')({
  ssr: false,
  component: ToddelPage,
});

function ToddelPage() {
  const { data, error, isLoading, isFetching, hasNextPage, fetchNextPage } = useToddels();
  const toddels = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <Page className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <h1 className='text-3xl md:text-5xl font-bold'>TÖDDEL</h1>
          <p className='text-muted-foreground ml-2'>Linjeforeningsbladet til TIHLDE</p>
        </div>

        <HavePermission apps={[PermissionApp.TODDEL]}>
          <CreateToddelDialog />
        </HavePermission>
      </div>

      <div>
        {isLoading && <ToddelListItemLoading />}
        {!isLoading && !toddels.length && <NotFoundIndicator header='Fant ingen publikasjoner' />}
        {error && <h1 className='text-center mt-12'>{error.detail}</h1>}
        {data !== undefined && (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {toddels.map((toddel, index) => (
              <ToddelListItem key={index} toddel={toddel} />
            ))}
          </div>
        )}

        {hasNextPage && <PaginateButton className='mt-8 w-full' isLoading={isFetching} nextPage={fetchNextPage} />}
      </div>
    </Page>
  );
}
