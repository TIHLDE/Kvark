import EventListItem, { EventListItemLoading } from '~/components/miscellaneous/EventListItem';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import { Button, PaginateButton } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
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
import { useAnalytics } from '~/hooks/Utils';
import { argsToParams } from '~/utils';
import { Search } from 'lucide-react';
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
  const events = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  const form = useForm<z.infer<typeof formSchema>>({ defaultValues: getInitialFilters() });
  const isEmpty = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);

  const resetFilters = () => {
    form.setValue('category', '');
    form.setValue('search', '');
    form.setValue('expired', false);
    form.setValue('user_favorite', false);
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

  const SearchForm = () => (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(search)}>
        <FormField
          control={form.control}
          name='search'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Søk</FormLabel>
              <FormControl>
                <Input {...field} placeholder='Skriv her...' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Kategori' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
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

        <div className='space-y-2'>
          <FormField
            control={form.control}
            name='expired'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-md border p-2'>
                <div className='space-y-0.5'>
                  <FormLabel className='text-sm'>Tidligere</FormLabel>
                  <FormDescription>Vis tidligere arrangementer</FormDescription>
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
              <FormItem className='flex flex-row items-center justify-between rounded-md border p-2'>
                <div className='space-y-0.5'>
                  <FormLabel className='text-sm'>Åpen påmelding</FormLabel>
                  <FormDescription>Vis kun arrangementer med åpen påmelding</FormDescription>
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
                <FormItem className='flex flex-row items-center justify-between rounded-md border p-2'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-sm'>Favoritter</FormLabel>
                    <FormDescription>Vis kun dine favoritter</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </div>

        <Button className='w-full' disabled={isFetching} type='submit'>
          Søk
        </Button>
      </form>

      <Separator className='my-4' />

      <Button className='w-full' onClick={resetFilters} variant='destructive'>
        Tilbakestill
      </Button>
    </Form>
  );

  return (
    <div className='grid lg:grid-cols-[4fr,2fr] items-start gap-4'>
      <div>
        {isLoading && <EventListItemLoading />}
        {isEmpty && <NotFoundIndicator header='Fant ingen arrangementer' />}
        {error && <h1 className='text-center mt-8'>{error.detail}</h1>}
        {data !== undefined && (
          <div className='space-y-2'>
            {events.map((event, index) => (
              <EventListItem event={event} key={index} size='large' />
            ))}
          </div>
        )}
        {hasNextPage && <PaginateButton className='w-full mt-4' isLoading={isFetching} nextPage={fetchNextPage} />}
      </div>

      <div className='-order-1 lg:order-2'>
        {isDesktop ? (
          <Card>
            <CardContent className='p-4'>
              <SearchForm />
            </CardContent>
          </Card>
        ) : (
          <Expandable
            description='Filtrer arrangementer'
            icon={<Search className='w-5 h-5 stroke-[1.5px]' />}
            onOpenChange={setSearchFormExpanded}
            open={searchFormExpanded}
            title='Søk'>
            <SearchForm />
          </Expandable>
        )}
      </div>
    </div>
  );
};

export default EventsDefaultView;
