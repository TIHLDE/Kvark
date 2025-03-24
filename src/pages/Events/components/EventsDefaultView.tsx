'use client';

import EventListItem, { EventListItemLoading } from '~/components/miscellaneous/EventListItem';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import { Badge } from '~/components/ui/badge';
import { Button, PaginateButton } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import Expandable from '~/components/ui/expandable';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Separator } from '~/components/ui/separator';
import { Switch } from '~/components/ui/switch';
import { useCategories } from '~/hooks/Categories';
import { useEvents } from '~/hooks/Event';
import useMediaQuery, { LARGE_SCREEN } from '~/hooks/MediaQuery';
import { useIsAuthenticated } from '~/hooks/User';
import { useAnalytics, useDebounce } from '~/hooks/Utils';
import { argsToParams } from '~/utils';
import { FilterX, Search, SlidersHorizontal } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';

type Filters = {
  search?: string;
  category?: string;
  open_for_sign_up?: boolean;
  user_favorite?: boolean;
  expired: boolean;
  activity?: boolean;
};

const formSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  open_for_sign_up: z.boolean().optional(),
  user_favorite: z.boolean().optional(),
  expired: z.boolean(),
  activity: z.boolean().optional(),
});

const EventsDefaultView = () => {
  const isAuthenticated = useIsAuthenticated();
  const { event } = useAnalytics();
  const getInitialFilters = useCallback((): Filters => {
    const params = new URLSearchParams(location.search);
    const expired = params.get('expired') ? Boolean(params.get('expired') === 'true') : false;
    const open_for_sign_up = params.get('open_for_sign_up') ? Boolean(params.get('open_for_sign_up') === 'true') : undefined;
    const user_favorite = params.get('user_favorite') ? Boolean(params.get('user_favorite') === 'true') : undefined;
    const category = params.get('category') || undefined;
    const search = params.get('search') || undefined;
    const activity = false;
    return { expired, category, search, open_for_sign_up, user_favorite, activity };
  }, []);
  const navigate = useNavigate();
  const isDesktop = useMediaQuery(LARGE_SCREEN);
  const { data: categories = [] } = useCategories();
  const [filters, setFilters] = useState<Filters>(getInitialFilters());
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useEvents(filters);
  const events = useMemo(() => (data ? data.pages.flatMap((page) => page.results) : []), [data]);
  const form = useForm<z.infer<typeof formSchema>>({ defaultValues: getInitialFilters() });
  const isEmpty = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);

  const resetFilters = () => {
    form.setValue('category', '');
    form.setValue('search', '');
    form.setValue('expired', false);
    form.setValue('user_favorite', false);
    form.setValue('open_for_sign_up', false);
    setFilters({ expired: false, open_for_sign_up: false, user_favorite: false });
    navigate(`${location.pathname}${argsToParams({ expired: false })}`, { replace: true });
  };

  const search = (values: z.infer<typeof formSchema>) => {
    event('search', 'events', JSON.stringify(values));
    setFilters(values);
    navigate(`${location.pathname}${argsToParams(values)}`, { replace: true });
    isDesktop || setSearchFormExpanded((prev) => !prev);
  };

  const [searchFormExpanded, setSearchFormExpanded] = useState<boolean>(false);

  const hasActiveFilters = Boolean(filters.search || filters.category || filters.expired || filters.open_for_sign_up || filters.user_favorite);

  const activeFilterCount = [filters.search, filters.category, filters.expired, filters.open_for_sign_up, filters.user_favorite].filter(Boolean).length;

  const getCategoryName = (id?: string) => {
    if (!id) {
      return '';
    }
    const category = categories.find((c) => c.id.toString() === id);
    return category ? category.text : '';
  };

  const SearchForm = () => (
    <Form {...form}>
      <form className='space-y-6' onSubmit={form.handleSubmit(search)}>
        <FormField
          control={form.control}
          name='search'
          render={({ field }) => (
            <FormItem className='space-y-2'>
              <FormLabel className='text-sm font-medium'>Søk</FormLabel>
              <div className='flex gap-2'>
                <FormControl>
                  <Input {...field} className='flex-1' placeholder='Skriv her...' />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem className='space-y-2'>
              <FormLabel className='text-sm font-medium'>Kategori</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Velg kategori' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='all'>Alle kategorier</SelectItem>
                  {categories
                    .filter((c) => c.text !== 'Aktivitet')
                    .map((category, index) => (
                      <SelectItem key={index} value={category.id.toString()}>
                        {category.text}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <Separator />

        <div className='space-y-3'>
          <h3 className='text-sm font-medium'>Alternativer</h3>

          <FormField
            control={form.control}
            name='expired'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg bg-muted/50 p-3'>
                <div className='space-y-0.5'>
                  <FormLabel className='text-sm font-medium'>Tidligere</FormLabel>
                  <FormDescription className='text-xs'>Vis tidligere arrangementer</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='open_for_sign_up'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg bg-muted/50 p-3'>
                <div className='space-y-0.5'>
                  <FormLabel className='text-sm font-medium'>Åpen påmelding</FormLabel>
                  <FormDescription className='text-xs'>Vis kun arrangementer med åpen påmelding</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          {isAuthenticated && (
            <FormField
              control={form.control}
              name='user_favorite'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg bg-muted/50 p-3'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-sm font-medium'>Favoritter</FormLabel>
                    <FormDescription className='text-xs'>Vis kun dine favoritter</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
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
      </form>
    </Form>
  );

  return (
    <div className='grid lg:grid-cols-[400px,1fr] gap-6 items-start'>
      <div>
        {isDesktop ? (
          <Card className='shadow-sm'>
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
                    <FilterX className='mr-1' size={18} />
                    <span className='text-sm'>Nullstill</span>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className='p-4'>
              <SearchForm />
            </CardContent>
          </Card>
        ) : (
          <Expandable
            description='Filtrer arrangementer'
            icon={<SlidersHorizontal className='w-5 h-5 stroke-[1.5px]' />}
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
              <SearchForm />
            </div>
          </Expandable>
        )}
      </div>

      <div className='space-y-4'>
        {/* Active filters display */}
        {hasActiveFilters && (
          <div className='flex flex-wrap gap-2 mb-4'>
            {filters.search && (
              <Badge className='flex items-center gap-1 px-3 py-1' variant='outline'>
                <span>Søk: {filters.search}</span>
                <button
                  aria-label='Fjern søkefilter'
                  className='ml-1 hover:bg-secondary rounded-full p-1'
                  onClick={() => {
                    form.setValue('search', '');
                    search({ ...filters, search: '' });
                  }}>
                  <FilterX size={14} />
                </button>
              </Badge>
            )}

            {filters.category && (
              <Badge className='flex items-center gap-1 px-3 py-1' variant='outline'>
                <span>Kategori: {getCategoryName(filters.category)}</span>
                <button
                  aria-label='Fjern kategorifilter'
                  className='ml-1 hover:bg-secondary rounded-full p-1'
                  onClick={() => {
                    form.setValue('category', '');
                    search({ ...filters, category: '' });
                  }}>
                  <FilterX size={14} />
                </button>
              </Badge>
            )}

            {filters.expired && (
              <Badge className='flex items-center gap-1 px-3 py-1' variant='outline'>
                <span>Tidligere arrangementer</span>
                <button
                  aria-label='Fjern tidligere arrangementer filter'
                  className='ml-1 hover:bg-secondary rounded-full p-1'
                  onClick={() => {
                    form.setValue('expired', false);
                    search({ ...filters, expired: false });
                  }}>
                  <FilterX size={14} />
                </button>
              </Badge>
            )}

            {filters.open_for_sign_up && (
              <Badge className='flex items-center gap-1 px-3 py-1' variant='outline'>
                <span>Åpen påmelding</span>
                <button
                  aria-label='Fjern åpen påmelding filter'
                  className='ml-1 hover:bg-secondary rounded-full p-1'
                  onClick={() => {
                    form.setValue('open_for_sign_up', false);
                    search({ ...filters, open_for_sign_up: false });
                  }}>
                  <FilterX size={14} />
                </button>
              </Badge>
            )}

            {filters.user_favorite && (
              <Badge className='flex items-center gap-1 px-3 py-1' variant='outline'>
                <span>Favoritter</span>
                <button
                  aria-label='Fjern favoritter filter'
                  className='ml-1 hover:bg-secondary rounded-full p-1'
                  onClick={() => {
                    form.setValue('user_favorite', false);
                    search({ ...filters, user_favorite: false });
                  }}>
                  <FilterX size={14} />
                </button>
              </Badge>
            )}
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
        {isEmpty && <NotFoundIndicator header='Fant ingen arrangementer' />}
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
