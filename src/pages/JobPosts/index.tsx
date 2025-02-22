import { zodResolver } from '@hookform/resolvers/zod';
import { FilterX } from 'lucide-react';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { argsToParams, getJobpostType } from 'utils';
import { z } from 'zod';
import { JobPostType } from 'types/Enums';

import { useJobPosts } from 'hooks/JobPost';
import { useAnalytics } from 'hooks/Utils';

import JobPostListItem, { JobPostListItemLoading } from 'components/miscellaneous/JobPostListItem';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import Page from 'components/navigation/Page';
import { PaginateButton } from 'components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from 'components/ui/form';

import FormMultiCheckbox from '../../components/inputs/MultiCheckbox';
import { FormSelect } from '../../components/inputs/Select';

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

  const handleFilterChange = (values: z.infer<typeof formSchema>) => {
    event('search', 'jobposts', JSON.stringify(values));

    const filters = {
      search: values.search,
      expired: values.expired,
      classes: values.classes !== 'all' ? values.classes : undefined,
    };

    setFilters(filters);
    navigate('${location.pathname}${argsToParams(filters)}', { replace: true });
  };

  // useEffect(() => {
  //   handleFilterChange(filters);
  // }, [filters]);

  const grade = useMemo(
    () =>
      [...Array(5).keys()].map((index) => {
        return {
          label: (index + 1).toString() + '. klasse',
          value: (index + 1).toString(),
        };
      }),
    [],
  );

  const jobType = useMemo(() => {
    return Object.keys(JobPostType).map((key) => ({
      label: getJobpostType(key as JobPostType),
      value: key as JobPostType,
    }));
  }, [JobPostType]);

  const locations = [
    { label: 'Oslo', value: 'Oslo' },
    { label: 'Bergen', value: 'Bergen' },
    { label: 'Trondheim', value: 'Trondheim' },
    { label: 'Tromsø', value: 'Tromsø' },
    { label: 'Annet', value: 'Annet' },
  ];

  const filterType = [
    { label: 'Frist', value: 'Frist' },
    { label: 'Bedrift', value: 'Bedrift' },
    { label: 'Publisert', value: 'Publisert' },
  ];

  const SearchForm = () => (
    <Form {...form}>
      <form className='space-y-4 pb-2' onSubmit={form.handleSubmit(onSubmit)}>
        <div className={'flex flex-row gap-2 items-center justify-between'}>
          <FormLabel className={'text-2xl'}>Filter</FormLabel>
          <div className={'cursor-pointer hover:bg-secondary rounded-md p-2'} onClick={resetFilters}>
            <FilterX size={25} />
          </div>
        </div>

        <FormField
          control={form.control}
          name='classes'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FormSelect form={form} label={'Filtrer etter'} name={'search'} options={filterType} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='classes'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FormMultiCheckbox form={form} items={grade} label={'Klassetrinn'} name='search' />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='classes'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FormMultiCheckbox form={form} items={jobType} label={'Jobbtype'} name='search' />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='classes'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FormMultiCheckbox form={form} items={locations} label={'Sted'} name='search' />
              </FormControl>
            </FormItem>
          )}
        />

{/*
        <div className='space-y-2'>
          <Button className='w-full' type='submit'>
            {isFetching ? 'Søker...' : 'Søk'}
          </Button>

          <Button className='w-full' onClick={resetFilters} variant='secondary'>
            Tilbakestill
          </Button>
        </div>
*/}
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
