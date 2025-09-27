import EventListItem, { EventListItemLoading } from '~/components/miscellaneous/EventListItem';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import { Badge } from '~/components/ui/badge';
import { Button, PaginateButton } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import Expandable from '~/components/ui/expandable';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import { Switch } from '~/components/ui/switch';
import { useEvents } from '~/hooks/Event';
import { useIsAuthenticated } from '~/hooks/User';
import { useDebounce } from '~/hooks/Utils';
import { FilterX, Search, SlidersHorizontal } from 'lucide-react';
import { parseAsBoolean, parseAsString, useQueryState } from 'nuqs';
import { useMemo, useState } from 'react';

function useSearchFilters() {
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const [isExpired, setIsExpired] = useQueryState('expired', parseAsBoolean.withDefault(false));
  const [isOpenForSignUp, setIsOpenForSignUp] = useQueryState('openSignup', parseAsBoolean.withDefault(false));

  function reset() {
    setSearch('');
    setIsExpired(false);
    setIsOpenForSignUp(false);
  }

  return {
    search,
    setSearch,
    isExpired,
    setIsExpired,
    isOpenForSignUp,
    setIsOpenForSignUp,
    reset,
  };
}

function SearchFilters({ isFetching, isFavorite, setIsFavorite }: { isFetching: boolean; isFavorite: boolean; setIsFavorite: (value: boolean) => void }) {
  const isAuthenticated = useIsAuthenticated();
  const { search, setSearch, isExpired, setIsExpired, isOpenForSignUp, setIsOpenForSignUp } = useSearchFilters();
  return (
    <div className='space-y-6'>
      <Label>
        Søk
        <Input placeholder='Skriv her...' value={search} onChange={(e) => setSearch(e.target.value)} />
      </Label>

      <Separator />

      <div className='space-y-2'>
        <div className='flex justify-between w-full rounded-lg bg-muted/50 p-4 items-center'>
          <div className='flex flex-col'>
            <span>Tidligere</span>
            <span className='text-sm text-muted-foreground'>Vis tidligere aktiviteter</span>
          </div>
          <Switch checked={isExpired} onCheckedChange={setIsExpired} />
        </div>

        <div className='flex justify-between w-full rounded-lg bg-muted/50 p-4 items-center'>
          <div className='flex flex-col'>
            <span>Åpen påmelding</span>
            <span className='text-sm text-muted-foreground'>Vis kun aktiviteter med åpen påmelding</span>
          </div>
          <Switch checked={isOpenForSignUp} onCheckedChange={setIsOpenForSignUp} />
        </div>

        {isAuthenticated && (
          <div className='flex justify-between w-full rounded-lg bg-muted/50 p-4 items-center'>
            <div className='flex flex-col'>
              <span>Favoritter</span>
              <span className='text-sm text-muted-foreground'>Vis kun dine favoritter</span>
            </div>
            <Switch checked={isFavorite} onCheckedChange={setIsFavorite} />
          </div>
        )}
      </div>

      <Button aria-label='Søk' className='w-full' disabled={isFetching} size='icon' type='submit'>
        {isFetching ? (
          <span className='animate-spin'>⟳</span>
        ) : (
          <div className='flex items-center gap-1'>
            <Search className='h-4 w-4' />
            <span>Søk</span>
          </div>
        )}
      </Button>
    </div>
  );
}

const ActivitiesDefaultView = () => {
  const [isFavorite, setIsFavorite] = useState(false);

  const { search, setSearch, isExpired, setIsExpired, isOpenForSignUp, setIsOpenForSignUp, reset: resetFilters } = useSearchFilters();

  const debouncedSearch = useDebounce(search, 200);

  const filters = useMemo(
    () => ({
      activity: true,
      expired: isExpired,
      open_for_sign_up: isOpenForSignUp,
      user_favorite: isFavorite,
      search: debouncedSearch,
    }),
    [isExpired, isOpenForSignUp, isFavorite, debouncedSearch],
  );

  const activeFilters = useMemo(() => {
    return Object.entries({
      Søk: {
        value: filters.search,
        clear: () => setSearch(''),
      },
      'Tidligere Arrangementer': {
        value: filters.expired,
        clear: () => setIsExpired(false),
      },
      'Åpen påmelding': {
        value: filters.open_for_sign_up,
        clear: () => setIsOpenForSignUp(false),
      },
      Favoritter: {
        value: filters.user_favorite,
        clear: () => setIsFavorite(false),
      },
    }).filter((v) => Boolean(v[1].value));
  }, [filters, setSearch, setIsExpired, setIsOpenForSignUp, setIsFavorite]);

  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useEvents(filters);
  const events = useMemo(() => (data ? data.pages.flatMap((page) => page.results) : []), [data]);

  return (
    <div className='grid lg:grid-cols-[400px,1fr] gap-6 items-start'>
      <div>
        <Card className='hidden lg:block shadow-sm'>
          <CardHeader className='pb-3 border-b'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-2'>
                <CardTitle className='text-lg font-medium'>Filter</CardTitle>
                {activeFilters.length > 0 && (
                  <Badge className='ml-2' variant='secondary'>
                    {activeFilters.length}
                  </Badge>
                )}
              </div>
              {activeFilters.length > 0 && (
                <Button aria-label='Nullstill filter' className='h-8 px-2' onClick={resetFilters} size='sm' variant='ghost'>
                  <FilterX className='mr-1' size={18} />
                  <span className='text-sm'>Nullstill</span>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className='p-4'>
            <SearchFilters isFetching={isFetching} isFavorite={isFavorite} setIsFavorite={setIsFavorite} />
          </CardContent>
        </Card>
        <Expandable
          description='Filtrer aktiviteter'
          icon={<SlidersHorizontal className='w-5 h-5 stroke-[1.5px]' />}
          className='lg:hidden'
          title={
            <div className='flex items-center gap-2'>
              <span>Filter</span>
              {activeFilters.length > 0 && (
                <Badge className='ml-1' variant='secondary'>
                  {activeFilters.length}
                </Badge>
              )}
            </div>
          }>
          <div className='pt-4'>
            <SearchFilters isFetching={isFetching} isFavorite={isFavorite} setIsFavorite={setIsFavorite} />
          </div>
        </Expandable>
      </div>

      <div className='space-y-4'>
        {/* Active filters display */}
        {activeFilters.length > 0 && (
          <div className='flex flex-wrap gap-2 mb-4'>
            {activeFilters.map(([label, filter]) => (
              <Badge key={label} className='flex items-center gap-1 px-3 py-1' variant='outline'>
                <span>{typeof filter.value === 'boolean' ? label : `${label}: ${filter.value}`}</span>
                <button aria-label={`Fjern ${label} filter`} className='ml-1 hover:bg-secondary rounded-full p-1' onClick={filter.clear}>
                  <FilterX size={14} />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Results count */}
        {data !== undefined && (
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-lg font-medium'>
              {events.length} {events.length === 1 ? 'aktivitet' : 'aktiviteter'} funnet
            </h2>
          </div>
        )}

        {isLoading && <EventListItemLoading />}
        {events.length === 0 && <NotFoundIndicator header='Fant ingen aktiviteter' />}
        {error && (
          <div className='text-center py-12 bg-muted/30 rounded-lg'>
            <h3 className='text-xl font-medium mb-2'>Noe gikk galt</h3>
            <p className='text-muted-foreground'>{error.detail}</p>
          </div>
        )}

        {data !== undefined && (
          <div className='space-y-4'>
            {events.map((event, index) => (
              <EventListItem event={event} key={index} size='large' />
            ))}
          </div>
        )}

        {hasNextPage && <PaginateButton className='w-full mt-6' isLoading={isFetching} nextPage={fetchNextPage} />}
      </div>
    </div>
  );
};

export default ActivitiesDefaultView;
