import { createFileRoute } from '@tanstack/react-router';
import Page from '~/components/navigation/Page';

import { NewsListView } from './views/ListView';

export const Route = createFileRoute('/_MainLayout/nyheter/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Page className='space-y-8 max-w-(--breakpoint-2xl) mx-auto'>
      <div>
        <h1 className='text-3xl md:text-5xl font-bold'>Nyheter</h1>
      </div>
      <NewsListView />
    </Page>
  );
}
