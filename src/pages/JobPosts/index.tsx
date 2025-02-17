import { zodResolver } from '@hookform/resolvers/zod';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { argsToParams } from 'utils';
import { z } from 'zod';

import { useJobPosts } from 'hooks/JobPost';
import { useAnalytics } from 'hooks/Utils';

import JobPostListItem, { JobPostListItemLoading } from 'components/miscellaneous/JobPostListItem';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import Page from 'components/navigation/Page';
import { Button, PaginateButton } from 'components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';
import { Switch } from 'components/ui/switch';

type FormState = {
  search?: string;
  classes?: string | 'all';
  expired: boolean;
};

const formSchema = z.object({
  search: z.string().optional(),
  classes: z.string().optional(),
  expired: z.boolean(),
});

const JobPosts = () => {
  const { event } = useAnalytics();
  const getInitialFilters = useCallback((): FormState => {
    const params = new URLSearchParams(location.search);
    const expired = params.get('expired') ? Boolean(params.get('expired') === 'true') : false;
    const search = params.get('search') || undefined;
    const classes = params.get('classes') || undefined;
    return { classes, expired, search };
  }, []);
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FormState>(getInitialFilters());
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useJobPosts(filters);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getInitialFilters(),
  });
  const isEmpty = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);

  const resetFilters = () => {
    form.setValue('search', '');
    form.setValue('expired', false);
    form.setValue('classes', '');

    setFilters({ expired: false });

    navigate(`${location.pathname}${argsToParams({ expired: false })}`, { replace: true });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    event('search', 'jobposts', JSON.stringify(values));
    const filters = {
      search: values.search,
      expired: values.expired,
      classes: values.classes !== 'all' ? values.classes : undefined,
    };
    setFilters(filters);
    navigate(`${location.pathname}${argsToParams(filters)}`, { replace: true });
  };

  const SearchForm = () => (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
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
          name='classes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Årstrinn</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Velg et årstrinn' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='all'>Alle</SelectItem>
                  {[...Array(5).keys()].map((cls, index) => (
                    <SelectItem key={index} value={(cls + 1).toString()}>
                      {cls + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='expired'
          render={({ field }) => (
            <FormItem className='flex space-x-2'>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel>Tidligere</FormLabel>
            </FormItem>
          )}
        />

        <div className='space-y-2'>
          <Button className='w-full' type='submit'>
            {isFetching ? 'Søker...' : 'Søk'}
          </Button>

          <Button className='w-full' onClick={resetFilters} variant='secondary'>
            Tilbakestill
          </Button>
        </div>
      </form>
    </Form>
  );

  return (
    <Page className='space-y-8 container'>
      <div>
        <h1 className='text-3xl md:text-5xl font-bold'>Stillingsannonser</h1>
      </div>
      <div className='grid lg:grid-cols-[1fr,3fr] gap-4 items-start'>
        <div className='border rounded-md bg-card p-4'>
          <SearchForm />
        </div>
        <div>
          {isLoading && <JobPostListItemLoading />}
          {isEmpty && <NotFoundIndicator header='Fant ingen annonser' />}
          {error && <h1>{error.detail}</h1>}
          {data !== undefined && (
            <div className='space-y-4'>
              <div className='grid lg:grid-cols-1 gap-4'>
                {data.pages.map((page, index) => (
                  <Fragment key={index}>
                    {page.results.map((jobPost) => (
                      <JobPostListItem jobPost={jobPost} key={jobPost.id} />
                    ))}
                  </Fragment>
                ))}
              </div>
              {hasNextPage && <PaginateButton className='w-full' isLoading={isFetching} nextPage={fetchNextPage} />}
            </div>
          )}
        </div>
      </div>
    </Page>
  );
};

export default JobPosts;
