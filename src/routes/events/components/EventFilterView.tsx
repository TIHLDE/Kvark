import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import { Badge } from '~/components/ui/badge';
import { Button, PaginateButton } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import Expandable from '~/components/ui/expandable';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Separator } from '~/components/ui/separator';
import { Switch } from '~/components/ui/switch';
import { getEventsInfiniteQuery } from '~/api/queries/events';
import { useAuthQuery } from '~/hooks/auth';
import { useAnalytics } from '~/hooks/Utils';
import { argsToParams } from '~/utils';
import EventListCard, { EventListCardLoading } from './EventListCard';
import { FilterX, Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
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

type EventFilterViewProps = {
  /** Force activity filter on (for the activities tab) */
  activityMode?: boolean;
  labels?: {
    filterDescription: string;
    expiredDescription: string;
    signUpDescription: string;
    emptyMessage: string;
    resultSingular: string;
    resultPlural: string;
  };
};

const DEFAULT_LABELS = {
  filterDescription: 'Filtrer arrangementer',
  expiredDescription: 'Vis tidligere arrangementer',
  signUpDescription: 'Vis kun arrangementer med apen pamelding',
  emptyMessage: 'Fant ingen arrangementer',
  resultSingular: 'arrangement',
  resultPlural: 'arrangementer',
};

const ACTIVITY_LABELS = {
  filterDescription: 'Filtrer aktiviteter',
  expiredDescription: 'Vis tidligere aktiviteter',
  signUpDescription: 'Vis kun aktiviteter med apen pamelding',
  emptyMessage: 'Fant ingen aktiviteter',
  resultSingular: 'aktivitet',
  resultPlural: 'aktiviteter',
};

function getInitialFilters(activityMode: boolean): Filters {
  const params = new URLSearchParams(location.search);
  const expired = params.get('expired') === 'true';
  const open_for_sign_up = params.get('open_for_sign_up') ? params.get('open_for_sign_up') === 'true' : undefined;
  const user_favorite = params.get('user_favorite') ? params.get('user_favorite') === 'true' : undefined;
  const category = activityMode ? undefined : params.get('category') || undefined;
  const search = params.get('search') || undefined;
  return { expired, category, search, open_for_sign_up, user_favorite, activity: activityMode || false };
}

const EventFilterView = ({ activityMode = false, labels: labelOverrides }: EventFilterViewProps) => {
  const labels = labelOverrides ?? (activityMode ? ACTIVITY_LABELS : DEFAULT_LABELS);
  const { auth } = useAuthQuery();
  const isAuthenticated = auth != null;
  const { event: analyticsEvent } = useAnalytics();
  const navigate = useNavigate();

  const [initialFilters] = useState(() => getInitialFilters(activityMode));
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useInfiniteQuery(getEventsInfiniteQuery(filters));
  const events = useMemo(() => (data ? data.pages.flatMap((page) => page.items) : []), [data]);
  const isEmpty = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.items.length)) : false), [data]);
  const form = useForm<z.infer<typeof formSchema>>({ defaultValues: initialFilters });

  const [searchFormExpanded, setSearchFormExpanded] = useState(false);

  const resetFilters = () => {
    form.setValue('category', '');
    form.setValue('search', '');
    form.setValue('expired', false);
    form.setValue('user_favorite', false);
    form.setValue('open_for_sign_up', false);
    const reset: Filters = { expired: false, open_for_sign_up: false, user_favorite: false, activity: activityMode };
    setFilters(reset);
    navigate({ href: `${location.pathname}${argsToParams({ expired: false })}`, replace: true });
  };

  const onSearch = (values: z.infer<typeof formSchema>) => {
    const searchValues = activityMode ? { ...values, activity: true } : values;
    analyticsEvent('search', activityMode ? 'activities' : 'events', JSON.stringify(searchValues));
    setFilters(searchValues);
    if (activityMode) {
      navigate({ href: `${location.pathname}${argsToParams(searchValues)}`, replace: true });
    }
    setSearchFormExpanded(false);
  };

  const hasActiveFilters = Boolean(filters.search || filters.category || filters.expired || filters.open_for_sign_up || filters.user_favorite);
  const activeFilterCount = [filters.search, filters.category, filters.expired, filters.open_for_sign_up, filters.user_favorite].filter(Boolean).length;

  return (
    <div className='grid lg:grid-cols-[400px_1fr] gap-6 items-start'>
      <div>
        {/* Desktop: always-visible card */}
        <div className='hidden lg:block'>
          <Card className='shadow-xs'>
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
              <SearchForm
                form={form}
                onSubmit={onSearch}
                isFetching={isFetching}
                isAuthenticated={isAuthenticated}
                showCategory={!activityMode}
                labels={labels}
              />
            </CardContent>
          </Card>
        </div>
        {/* Mobile: expandable panel */}
        <div className='lg:hidden'>
          <Expandable
            description={labels.filterDescription}
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
              <SearchForm
                form={form}
                onSubmit={onSearch}
                isFetching={isFetching}
                isAuthenticated={isAuthenticated}
                showCategory={!activityMode}
                labels={labels}
              />
            </div>
          </Expandable>
        </div>
      </div>

      <div className='space-y-4'>
        {hasActiveFilters && (
          <ActiveFilterBadges filters={filters} form={form} onSearch={onSearch} activityMode={activityMode} />
        )}

        {data !== undefined && (
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-lg font-medium'>
              {events.length} {events.length === 1 ? labels.resultSingular : labels.resultPlural} funnet
            </h2>
          </div>
        )}

        {isLoading && <EventListCardLoading />}
        {isEmpty && <NotFoundIndicator header={labels.emptyMessage} />}
        {error && (
          <div className='text-center py-12 bg-muted/30 rounded-lg'>
            <h3 className='text-xl font-medium mb-2'>Noe gikk galt</h3>
            <p className='text-muted-foreground'>{String(error)}</p>
          </div>
        )}

        {data !== undefined && (
          <div className='space-y-4'>
            {events.map((event) => (
              <EventListCard event={event} key={event.id} />
            ))}
          </div>
        )}

        {hasNextPage && <PaginateButton className='w-full mt-6' isLoading={isFetching} nextPage={fetchNextPage} />}
      </div>
    </div>
  );
};

export default EventFilterView;

// --- Extracted sub-components (not inline to avoid remounting) ---

type SearchFormProps = {
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isFetching: boolean;
  isAuthenticated: boolean;
  showCategory: boolean;
  labels: typeof DEFAULT_LABELS;
};

function SearchForm({ form, onSubmit, isFetching, isAuthenticated, labels }: SearchFormProps) {
  return (
    <Form {...form}>
      <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='search'
          render={({ field }) => (
            <FormItem className='space-y-2'>
              <FormLabel className='text-sm font-medium'>Sok</FormLabel>
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

        {/* TODO: Re-add category select — previously used useCategories() which is no longer available */}

        <div className='space-y-3'>
          <h3 className='text-sm font-medium'>Alternativer</h3>

          <FormField
            control={form.control}
            name='expired'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg bg-muted/50 p-3'>
                <div className='space-y-0.5'>
                  <FormLabel className='text-sm font-medium'>Tidligere</FormLabel>
                  <FormDescription className='text-xs'>{labels.expiredDescription}</FormDescription>
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
                  <FormLabel className='text-sm font-medium'>Apen pamelding</FormLabel>
                  <FormDescription className='text-xs'>{labels.signUpDescription}</FormDescription>
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
          <Button aria-label='Sok' className='w-full' disabled={isFetching} type='submit'>
            {isFetching ? (
              <span className='animate-spin'>&#x27F3;</span>
            ) : (
              <div className='flex items-center gap-1'>
                <Search className='h-4 w-4' />
                <span>Sok</span>
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

type ActiveFilterBadgesProps = {
  filters: Filters;
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
  onSearch: (values: z.infer<typeof formSchema>) => void;
  activityMode: boolean;
};

function ActiveFilterBadges({ filters, form, onSearch, activityMode }: ActiveFilterBadgesProps) {
  return (
    <div className='flex flex-wrap gap-2 mb-4'>
      {filters.search && (
        <Badge className='flex items-center gap-1 px-3 py-1' variant='outline'>
          <span>Sok: {filters.search}</span>
          <button
            aria-label='Fjern sokefilter'
            className='ml-1 hover:bg-secondary rounded-full p-1'
            onClick={() => {
              form.setValue('search', '');
              onSearch({ ...filters, search: '' });
            }}>
            <FilterX size={14} />
          </button>
        </Badge>
      )}

      {filters.category && (
        <Badge className='flex items-center gap-1 px-3 py-1' variant='outline'>
          <span>Kategori: {filters.category}</span>
          <button
            aria-label='Fjern kategorifilter'
            className='ml-1 hover:bg-secondary rounded-full p-1'
            onClick={() => {
              form.setValue('category', '');
              onSearch({ ...filters, category: '' });
            }}>
            <FilterX size={14} />
          </button>
        </Badge>
      )}

      {filters.expired && (
        <Badge className='flex items-center gap-1 px-3 py-1' variant='outline'>
          <span>{activityMode ? 'Tidligere aktiviteter' : 'Tidligere arrangementer'}</span>
          <button
            aria-label='Fjern tidligere filter'
            className='ml-1 hover:bg-secondary rounded-full p-1'
            onClick={() => {
              form.setValue('expired', false);
              onSearch({ ...filters, expired: false });
            }}>
            <FilterX size={14} />
          </button>
        </Badge>
      )}

      {filters.open_for_sign_up && (
        <Badge className='flex items-center gap-1 px-3 py-1' variant='outline'>
          <span>Apen pamelding</span>
          <button
            aria-label='Fjern apen pamelding filter'
            className='ml-1 hover:bg-secondary rounded-full p-1'
            onClick={() => {
              form.setValue('open_for_sign_up', false);
              onSearch({ ...filters, open_for_sign_up: false });
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
              onSearch({ ...filters, user_favorite: false });
            }}>
            <FilterX size={14} />
          </button>
        </Badge>
      )}
    </div>
  );
}
