'use client';

import EventListItem, { EventListItemLoading } from '~/components/miscellaneous/EventListItem';
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
import { useCategories } from '~/hooks/Categories';
import { useEvents } from '~/hooks/Event';
import { useIsAuthenticated } from '~/hooks/User';
import { FilterX, Search, SlidersHorizontal } from 'lucide-react';
import { parseAsBoolean, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';

function useSearchFilters() {
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const [category, setCategory] = useQueryState('category', parseAsString.withDefault(''));
  const [isExpired, setIsExpired] = useQueryState('expired', parseAsBoolean.withDefault(false));
  const [isOpenSignup, setIsOpenSignup] = useQueryState('openSignup', parseAsBoolean.withDefault(false));
  const [isUserFavorite, setIsUserFavorite] = useQueryState('userFavorite', parseAsBoolean.withDefault(false));

  function reset() {
    setSearch('');
    setCategory('');
    setIsExpired(false);
    setIsOpenSignup(false);
    setIsUserFavorite(false);
  }

  return {
    search,
    setSearch,
    category,
    setCategory,
    isExpired,
    setIsExpired,
    isOpenSignup,
    setIsOpenSignup,
    isUserFavorite,
    setIsUserFavorite,
    reset,
  };
}

function SearchForm({ isFetching }: { isFetching: boolean }) {
  const isAuthenticated = useIsAuthenticated();
  const filters = useSearchFilters();
  const { data: categories = [] } = useCategories();

  function handleCategoryChange(value: string) {
    if (value === 'all') {
      filters.setCategory('');
    } else {
      filters.setCategory(value);
    }
  }

  return (
    <div className='space-y-6'>
      <Label>
        Søk
        <Input placeholder='Skriv her...' value={filters.search} onChange={(e) => filters.setSearch(e.target.value)} />
      </Label>

      <Separator />

      <Select value={filters.category} onValueChange={handleCategoryChange}>
        <SelectTrigger>
          <SelectValue placeholder='Velg kategori' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Alle</SelectItem>
          {categories
            .filter((c) => c.text !== 'Aktivitet')
            .map((c) => (
              <SelectItem key={c.id} value={c.id.toString()}>
                {c.text}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Separator />

      <div className='space-y-3'>
        <h3 className='text-sm font-medium'>Alternativer</h3>

        <div className='flex justify-between w-full rounded-lg bg-muted/50 p-4 items-center'>
          <div className='flex flex-col'>
            <span>Tidligere</span>
            <span className='text-sm text-muted-foreground'>Vis tidligere arrangementer</span>
          </div>
          <Switch checked={filters.isExpired} onCheckedChange={filters.setIsExpired} />
        </div>

        <div className='flex justify-between w-full rounded-lg bg-muted/50 p-4 items-center'>
          <div className='flex flex-col'>
            <span>Åpen påmelding</span>
            <span className='text-sm text-muted-foreground'>Vis kun arrangementer med åpen påmelding</span>
          </div>
          <Switch checked={filters.isOpenSignup} onCheckedChange={filters.setIsOpenSignup} />
        </div>

        {isAuthenticated && (
          <div className='flex justify-between w-full rounded-lg bg-muted/50 p-4 items-center'>
            <div className='flex flex-col'>
              <span>Favoritter</span>
              <span className='text-sm text-muted-foreground'>Vis kun dine favoritter</span>
            </div>
            <Switch checked={filters.isUserFavorite} onCheckedChange={filters.setIsUserFavorite} />
          </div>
        )}
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
    </div>
  );
}

const EventsDefaultView = () => {
  const {
    search,
    setSearch,
    category,
    setCategory,
    isExpired,
    setIsExpired,
    isOpenSignup,
    setIsOpenSignup,
    isUserFavorite,
    setIsUserFavorite,
    reset: resetFilters,
  } = useSearchFilters();

  const filters = useMemo(
    () => ({
      search,
      category,
      expired: isExpired,
      open_for_sign_up: isOpenSignup,
      user_favorite: isUserFavorite,
      activity: false,
    }),
    [search, category, isExpired, isOpenSignup, isUserFavorite],
  );

  const { data: categories = [] } = useCategories();
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useEvents(filters);
  const events = useMemo(() => (data ? data.pages.flatMap((page) => page.results) : []), [data]);

  const selectedCategoryName = useMemo(() => {
    if (!filters.category) {
      return '';
    }
    const category = categories.find((c) => c.id.toString() === filters.category);
    return category ? category.text : '';
  }, [categories, filters.category]);


  const activeFilters = useMemo(() => {
    return Object.entries({
      Søk: {
        value: filters.search,
        clear: () => setSearch(''),
      },
      Kategori: {
        value: selectedCategoryName,
        clear: () => setCategory(''),
      },
      'Tidligere Arrangementer': {
        value: filters.expired,
        clear: () => setIsExpired(false),
      },
      'Åpen påmelding': {
        value: filters.open_for_sign_up,
        clear: () => setIsOpenSignup(false),
      },
      Favoritter: {
        value: filters.user_favorite,
        clear: () => setIsUserFavorite(false),
      },
    }).filter((v) => Boolean(v[1].value));
  }, [filters, selectedCategoryName, setSearch, setCategory, setIsExpired, setIsOpenSignup, setIsUserFavorite]);

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
            <SearchForm isFetching={isFetching} />
          </CardContent>
        </Card>
        <Expandable
          description='Filtrer arrangementer'
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
            <SearchForm isFetching={isFetching} />
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
              {events.length} {events.length === 1 ? 'arrangement' : 'arrangementer'} funnet
            </h2>
          </div>
        )}

        {isLoading && <EventListItemLoading />}
        {events.length === 0 && <NotFoundIndicator header='Fant ingen arrangementer' />}
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

export default EventsDefaultView;
