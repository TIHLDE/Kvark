import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDownIcon, ChevronUpIcon, FilterX, Loader, LoaderCircle, Search } from "lucide-react";
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
import { Button, PaginateButton } from 'components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';

import FormMultiCheckbox from '../../components/inputs/MultiCheckbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible';

type FormState = {
  search?: string;
  classes?: string | 'all';
  expired: boolean;
  job_type?: string;
};

const formSchema = z.object({
  search: z.string().optional(),
  classes: z.string().array().optional(),
  expired: z.boolean(),
  job_type: z.string().array().optional(),
});

const JobPosts = () => {
  const { event } = useAnalytics();

  const getInitialFilters = useCallback((): FormState => {
    const params = new URLSearchParams(location.search);
    const expired = params.get('expired') ? Boolean(params.get('expired') === 'true') : false;
    const search = params.get('search') || undefined;
    const classes = params.get('classes') || undefined;
    const job_type = params.get('job_type') || undefined;
    return { classes, expired, search, job_type };
  }, []);

  const [filters, setFilters] = useState<FormState>(getInitialFilters());

  const navigate = useNavigate();

  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useJobPosts(filters);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getInitialFilters(),
  });

  const isEmpty = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);

  //const classes = formBackEndFilter.watch('classes');

  const resetFilters = () => {
    form.setValue('search', '');
    form.setValue('expired', false);
    form.setValue('classes', ['']);
    form.setValue('job_type', ['']);

    setFilters({ expired: false });

    navigate(`${location.pathname}${argsToParams({ expired: false })}`, { replace: true });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    event('search', 'jobposts', JSON.stringify(values));
    const filters = {
      search: values.search,
      expired: values.expired,
      classes: values.classes !== 'all' ? values.classes : undefined,
      job_type: values.job_type,
    };
    setFilters(filters);
    navigate(`${location.pathname}${argsToParams(filters)}`, { replace: true });
  };

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

  const [isOpen, setIsOpen] = useState<boolean>(window.innerWidth > 1000);

  const SearchForm = () => (
    <>
      <Collapsible onOpenChange={setIsOpen} open={isOpen}>
        <div className={'flex flex-row justify-between'}>
          <div className={'flex flex-row gap-2'}>
            <div className='flex items-center space-x-4'>
              <span className='font-medium truncate max-w-md'>Filter</span>
            </div>
            <div className={'cursor-not-allowed rounded-md p-2 h-10 w-10'} onClick={resetFilters}>
              <FilterX size={25} />
            </div>
          </div>
          <CollapsibleTrigger className='flex items-center justify-between py-2'>
            <div className='flex items-center space-x-4 pr-3'>{isOpen ? <ChevronUpIcon className='w-4 h-4' /> : <ChevronDownIcon className='w-4 h-4' />}</div>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className={'flex flex-row gap-2 justify-between'}>
                <div className={'space-y-4 py-2'}>
                  <FormField
                    control={form.control}
                    name='search'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Søk</FormLabel>
                        <FormControl>
                          <div className={'flex flex-row gap-3'}>
                            <Input className={'flex-2'} {...field} placeholder='Skriv her...' />
                            <Button className='p-3 h-10 w-10' type='submit'>
                              {isFetching ? <LoaderCircle className={'animate-spin'} /> : <Search size={25} />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormMultiCheckbox form={form} items={grade} label={'Klassetrinn'} name='classes' />

                  <FormMultiCheckbox form={form} items={jobType} label={'Jobbtype'} name='job_type' />
                </div>
              </div>
            </form>
          </Form>
        </CollapsibleContent>
      </Collapsible>
    </>
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
