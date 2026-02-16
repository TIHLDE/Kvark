import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import Page from '~/components/navigation/Page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { CalendarIcon, ListIcon, PartyPopperIcon } from 'lucide-react';
import z from 'zod';

import { CalendarEventView } from './views/CalendarView';
import { DefaultEventView } from './views/DefaultView';

const defaultSearchParams = {
  tab: 'list',
  search: '',
  signUpOpen: undefined,
  expired: undefined,
  category: undefined,
} as const;

const SearchParamSchema = z.object({
  tab: z.enum(['list', 'activity', 'calendar']).default(defaultSearchParams.tab),
  search: z.string().default(defaultSearchParams.search),
  expired: z.boolean().optional(),
  signUpOpen: z.boolean().optional(),
  category: z.string().optional(),
});

export const Route = createFileRoute('/_MainLayout/arrangementer/')({
  validateSearch: SearchParamSchema,
  search: {
    middlewares: [stripSearchParams(defaultSearchParams)],
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();

  function gotoTab(newTab: string) {
    navigate({ search: (old) => ({ ...old, tab: newTab as typeof tab }) });
  }

  function resetFilters() {
    navigate({
      search: (old) => ({
        ...defaultSearchParams,
        tab: old.tab,
      }),
    });
  }

  return (
    <Page className='space-y-8 max-w-(--breakpoint-2xl) mx-auto'>
      <div>
        <h1 className='text-3xl md:text-5xl font-bold'>Arrangementer</h1>
        <p className='text-muted-foreground mt-2'>Finn arrangementer for studenter</p>
      </div>

      <Tabs value={tab} onValueChange={gotoTab}>
        <TabsList>
          <TabsTrigger value='list'>
            <ListIcon className='mr-2 w-5 h-5 stroke-[1.5px]' />
            Liste
          </TabsTrigger>
          <TabsTrigger value='activity'>
            <PartyPopperIcon className='mr-2 w-5 h-5 stroke-[1.5px]' />
            Aktiviteter
          </TabsTrigger>
          <TabsTrigger value='calendar'>
            <CalendarIcon className='mr-2 w-5 h-5 stroke-[1.5px]' />
            Kalender
          </TabsTrigger>
        </TabsList>
        <TabsContent value='list'>
          <DefaultEventView type='event' resetFilters={resetFilters} />
        </TabsContent>
        <TabsContent value='activity'>
          <DefaultEventView type='activity' resetFilters={resetFilters} />
        </TabsContent>
        <TabsContent value='calendar'>
          <CalendarEventView />
        </TabsContent>
      </Tabs>
    </Page>
  );
}
