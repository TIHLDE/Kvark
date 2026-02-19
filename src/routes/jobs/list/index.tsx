import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import Page from '~/components/navigation/Page';
import z from 'zod';

import { JobListView } from './views/ListView';

const defaultSearchParams = {
  search: '',
  jobType: undefined as 'full_time' | 'part_time' | 'summer_job' | 'other' | undefined,
  year: undefined as 'first' | 'second' | 'third' | 'fourth' | 'fifth' | 'alumni' | undefined,
  expired: undefined as boolean | undefined,
};

const SearchParamSchema = z.object({
  search: z.string().default(defaultSearchParams.search),
  jobType: z.enum(['full_time', 'part_time', 'summer_job', 'other']).optional(),
  year: z.enum(['first', 'second', 'third', 'fourth', 'fifth', 'alumni']).optional(),
  expired: z.boolean().optional(),
});

export const Route = createFileRoute('/_MainLayout/stillingsannonser/')({
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
        <h1 className='text-3xl md:text-5xl font-bold'>Stillingsannonser</h1>
        <p className='text-muted-foreground mt-2'>Finn relevante jobber for studenter</p>
      </div>
      <JobListView resetFilters={resetFilters} />
    </Page>
  );
}
