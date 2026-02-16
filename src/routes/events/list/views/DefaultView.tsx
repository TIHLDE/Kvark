import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { listEventInfiniteQuery } from '~/api/queries/events';
import { EventListItem, EventListLoading } from '~/components/miscellaneous/EventListItem';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import { Badge } from '~/components/ui/badge';
import { Button, PaginateButton } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import Expandable from '~/components/ui/expandable';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Separator } from '~/components/ui/separator';
import { Switch } from '~/components/ui/switch';
import { useDebounce } from '~/hooks/Utils';
import { FilterXIcon, SlidersHorizontalIcon } from 'lucide-react';
import { Suspense, useEffect, useMemo, useState } from 'react';

import { Route } from '../index';

type DefaultEventViewProps = {
  type: 'event' | 'activity';
  resetFilters: () => void;
};

export function DefaultEventView({ type, resetFilters }: DefaultEventViewProps) {
  const { search, expired, signUpOpen } = Route.useSearch();
  const [searchFormExpanded, setSearchFormExpanded] = useState(false);

  const { hasActiveFilters, activeFilterCount } = useMemo(() => {
    let count = 0;
    if (search) count++;
    if (expired) count++;
    if (signUpOpen) count++;

    return { hasActiveFilters: count > 0, activeFilterCount: count };
  }, [search, expired, signUpOpen]);

  return (
    <div className='grid lg:grid-cols-[400px_1fr] gap-6 items-start'>
      <div>
        {/* Dekstop Filters */}
        <Card className='not-lg:hidden'>
          <CardHeader className='pb-3 border-b'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-2'>
                <CardTitle className='text-lg font-medium'>Filter</CardTitle>
                {hasActiveFilters && (
                  <Badge className='ml-2' variant='secondary'>
                    {activeFilterCount}
                  </Badge>
                )}
              </div>
              {hasActiveFilters && (
                <Button aria-label='Nullstill filter' className='h-8 px-2' onClick={resetFilters} size='sm' variant='ghost'>
                  <FilterXIcon className='mr-1' size={18} />
                  <span className='text-sm'>Nullstill</span>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className='p-4'>
            <SearchFilters />
          </CardContent>
        </Card>
        {/* Mobile Filters */}
        <Expandable
          description='Filtrer arrangementer'
          icon={<SlidersHorizontalIcon className='w-5 h-5 stroke-[1.5px]' />}
          className='lg:hidden'
          onOpenChange={setSearchFormExpanded}
          open={searchFormExpanded}
          title={
            <div className='flex items-center gap-2'>
              <span>Filter</span>
              {hasActiveFilters && (
                <Badge className='ml-1' variant='secondary'>
                  {activeFilterCount}
                </Badge>
              )}
            </div>
          }>
          <div className='pt-4'>
            <SearchFilters />
          </div>
        </Expandable>
      </div>
      <div className='space-y-4'>
        {/* <ErrorBoundary
          fallbackRender={({ error }) => (
            <div className='text-center py-12 bg-muted/30 rounded-lg'>
              <h3 className='text-xl font-medium mb-2'>Noe gikk galt</h3>
              <p className='text-muted-foreground'>{(error as { detail: string }).detail}</p>
            </div>
          )}> */}
        <Suspense fallback={<EventListLoading />}>
          <EventList type={type} search={search} expired={expired} signUpOpen={signUpOpen} />
        </Suspense>
        {/* </ErrorBoundary> */}
      </div>
    </div>
  );
}

type EventListProps = {
  type: 'event' | 'activity';
  search: string;
  expired?: boolean;
  signUpOpen?: boolean;
};

function EventList({ expired, signUpOpen, search }: EventListProps) {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery({
    ...listEventInfiniteQuery({
      ...(search ? { search } : undefined),
      ...(expired === true ? { expired } : undefined),
      ...(signUpOpen === true ? { openSignUp: signUpOpen } : undefined),
    }),
    select: (data) => data.pages.flatMap((page) => page.items),
  });

  if (data.length === 0) {
    return <NotFoundIndicator header='Fant ingen arrangementer' />;
  }

  return (
    <>
      <div className='space-y-4'>
        {data.map((v) => (
          <EventListItem key={v.id} event={v} size='large' />
        ))}
      </div>
      {/* Pagination */}
      {hasNextPage && <PaginateButton className='w-full mt-6' nextPage={fetchNextPage} isLoading={isFetchingNextPage} />}
    </>
  );
}

function SearchFilters() {
  const params = Route.useSearch();
  const navigate = Route.useNavigate();
  const [search, setSearch] = useState(params.search);

  function setFilter<T extends keyof typeof params>(key: T, value: (typeof params)[T]) {
    navigate({ search: (old) => ({ ...old, [key]: value }) });
  }

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch !== params.search) {
      setFilter('search', debouncedSearch);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (params.search !== search) {
      setSearch(params.search);
    }
  }, [params.search]);

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <Label htmlFor='event-search' className='text-sm font-medium'>
          Søk
        </Label>
        <Input placeholder='Søk...' id='event-search' value={search} onChange={(v) => setSearch(v.target.value)} />
      </div>

      <Separator />

      {params.tab !== 'activity' && (
        <>
          <div className='space-y-2'>
            <Label htmlFor='category' className='text-sm font-medium'>
              Kategori
            </Label>
            <Select onValueChange={(value) => setFilter('category', value)} value={params.category || ''}>
              <SelectTrigger>
                <SelectValue placeholder='Velg kategori' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='alle'>Alle kategorier</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />
        </>
      )}

      <div className='space-y-3'>
        <h3 className='text-sm font-medium'>Alternativer</h3>

        <div className='flex flex-row items-center justify-between rounded-lg bg-muted/50 p-3'>
          <div className='space-y-0.5'>
            <Label className='text-sm font-medium'>Tidligere</Label>
            <p className='text-xs'>Vis tidligere arrangementer</p>
          </div>
          <Switch checked={params.expired} onCheckedChange={(value) => setFilter('expired', value)} />
        </div>

        <div className='flex flex-row items-center justify-between rounded-lg bg-muted/50 p-3'>
          <div className='space-y-0.5'>
            <Label className='text-sm font-medium'>Åpen påmelding</Label>
            <p className='text-xs'>Vis kun arrangementer med åpen påmelding</p>
          </div>
          <Switch checked={params.signUpOpen} onCheckedChange={(value) => setFilter('signUpOpen', value)} />
        </div>
      </div>
    </div>
  );
}
