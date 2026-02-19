import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import Page from '~/components/navigation/Page';
import z from 'zod';

import { NewsListView } from './views/ListView';

const defaultSearchParams = {
  search: '',
};

const SearchParamSchema = z.object({
  search: z.string().default(defaultSearchParams.search),
});

export const Route = createFileRoute('/_MainLayout/nyheter/')({
  validateSearch: SearchParamSchema,
  search: {
    middlewares: [stripSearchParams(defaultSearchParams)],
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();

  function resetFilters() {
    navigate({ search: () => ({ ...defaultSearchParams }) });
  }

  return (
    <Page className='space-y-8 max-w-(--breakpoint-2xl) mx-auto'>
      <div>
        <h1 className='text-3xl md:text-5xl font-bold'>Nyheter</h1>
      </div>
      <NewsListView resetFilters={resetFilters} />
    </Page>
  );
}
