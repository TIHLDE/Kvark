import API from '~/api/api';
import { FormMultiCheckboxComponent } from '~/components/inputs/MultiCheckbox';
import JobPostListItem, { JobPostListItemLoading } from '~/components/miscellaneous/JobPostListItem';
import Page from '~/components/navigation/Page';
import { Button, PaginateButton } from '~/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { analyticsEvent, useDebounce } from '~/hooks/Utils';
import { deepEqual } from '~/utils';
import { ChevronRightIcon, FilterX, LoaderCircle, Search } from 'lucide-react';
import { createLoader, createSerializer, inferParserType, parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs';
import { useEffect, useState } from 'react';
import { useFetcher } from 'react-router';

import { Route } from './+types';

const urlParamFilters = {
  search: parseAsString.withDefault(''),
  classes: parseAsArrayOf(parseAsString).withDefault([]),
  job_type: parseAsString.withDefault(''),
};

const loadUrlParams = createLoader(urlParamFilters);
const urlParamsSerializer = createSerializer(urlParamFilters);

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const filters = loadUrlParams(request);
  let page = Number(new URL(request.url).searchParams.get('page') ?? '1');
  page = Number.isNaN(page) ? 1 : page;

  const jobs = await API.getJobPosts({ ...filters, page });
  return { jobs, filters, page };
}

export default function JobPosts({ loaderData }: Route.ComponentProps) {
  const { jobs: initialJobs, page } = loaderData;
  const [allJobs, setAllJobs] = useState(initialJobs.results);
  const [hasNext, setHasNext] = useState(Boolean(initialJobs.next));
  const [lastFilters, setLastFilters] = useState(loaderData.filters);

  const fetcher = useFetcher<typeof loaderData>();

  // Set up URL query parameters
  const [queryFilters, setQueryFilters] = useQueryStates(urlParamFilters);

  const debouncedSearch = useDebounce(queryFilters.search, 500);

  useEffect(() => {
    // Use debounced search to avoid sending too many requests
    const params: inferParserType<typeof urlParamFilters> = {
      classes: queryFilters.classes,
      job_type: queryFilters.job_type,
      search: debouncedSearch,
    };

    // No changes then don't fetch
    if (deepEqual(lastFilters, params)) {
      return;
    }

    analyticsEvent('search', 'jobposts', JSON.stringify(params));

    // Reset page to 1
    const searchParams = new URLSearchParams(urlParamsSerializer(params));
    searchParams.set('page', '1');

    fetcher.load(`?${searchParams.toString()}`);
  }, [debouncedSearch, queryFilters.classes, queryFilters.job_type, lastFilters]);

  useEffect(() => {
    if (fetcher.state !== 'idle') {
      return;
    }
    const data = fetcher.data;
    if (!data) {
      return;
    }

    setLastFilters(data.filters);
    setHasNext(Boolean(data.jobs.next));

    if (data.page === 1) {
      setAllJobs(data.jobs.results);
    } else {
      setAllJobs((prev) => [...prev, ...data.jobs.results]);
    }
  }, [fetcher]);

  function fetchNewPage(params?: inferParserType<typeof urlParamFilters>) {
    const searchParams = new URLSearchParams(urlParamsSerializer(params ?? queryFilters));
    searchParams.set('page', '1');

    fetcher.load(`?${urlParamsSerializer(queryFilters)}`);
  }

  function fetchNextPage() {
    const searchParams = new URLSearchParams(urlParamsSerializer(queryFilters));
    searchParams.set('page', String(page + 1));

    fetcher.load(`?${searchParams.toString()}`);
  }

  function resetFilters() {
    setQueryFilters({
      search: '',
      classes: [],
      job_type: '',
    });
  }

  const [isOpen, setIsOpen] = useState<boolean>(window.innerWidth > 1000);

  return (
    <Page className='space-y-8 container'>
      <div>
        <h1 className='text-3xl md:text-5xl font-bold'>Stillingsannonser</h1>
      </div>
      <div className='grid lg:grid-cols-[1fr,3fr] gap-4 items-start'>
        <div className='border rounded-md bg-card p-4'>
          <Collapsible className='group' onOpenChange={setIsOpen} open={isOpen}>
            <div className={'flex flex-row justify-between'}>
              <div className={'flex flex-row gap-2'}>
                <div className='flex items-center space-x-4'>
                  <span className='font-medium truncate max-w-md'>Filter</span>
                </div>
                <div className={'cursor-pointer hover:bg-secondary rounded-md p-2 h-10 w-10'} onClick={resetFilters}>
                  <FilterX size={25} />
                </div>
              </div>
              <CollapsibleTrigger className='w-10 flex items-center justify-center py-2'>
                <div className='flex items-center space-x-4 group-data-[state=open]:rotate-90 transition-transform'>
                  {<ChevronRightIcon className='w-4 h-4' />}
                </div>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <SearchForm isSearching={fetcher.state !== 'idle'} {...{ queryFilters, setQueryFilters, search: fetchNewPage }} />
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div>
          <div className='space-y-4'>
            <div className='grid lg:grid-cols-1 gap-4'>
              {allJobs.map((jobPost) => (
                <JobPostListItem jobPost={jobPost} key={jobPost.id} />
              ))}
              {fetcher.state === 'loading' && <JobPostListItemLoading />}
              {/* {isEmpty && allJobs.length === 0 && <NotFoundIndicator header='Fant ingen annonser' />} */}
            </div>
            {hasNext && <PaginateButton className='w-full' isLoading={fetcher.state !== 'idle'} nextPage={fetchNextPage} />}
          </div>
        </div>
      </div>
    </Page>
  );
}

type SearchFormProps = {
  queryFilters: inferParserType<typeof urlParamFilters>;
  setQueryFilters: (newFilters: inferParserType<typeof urlParamFilters>) => void;
  search: () => void;
  isSearching: boolean;
};

function SearchForm({ queryFilters, setQueryFilters, search, isSearching }: SearchFormProps) {
  const grade = [
    { label: '1. klasse', value: '1' },
    { label: '2. klasse', value: '2' },
    { label: '3. klasse', value: '3' },
    { label: '4. klasse', value: '4' },
    { label: '5. klasse', value: '5' },
  ];

  const jobTypes = [
    ['SUMMER_JOB', 'Sommerjobb'],
    ['PART_TIME', 'Deltid'],
    ['FULL_TIME', 'Fulltid'],
    ['OTHER', 'Annet'],
  ];

  return (
    <div className={'flex flex-row gap-2 justify-between'}>
      <div className={'space-y-4 py-2 pl-1 w-full'}>
        <Label>Søk</Label>
        <div className='flex flex-row gap-3 w-full'>
          <Input className='w-full' onChange={(v) => setQueryFilters({ ...queryFilters, search: v.target.value })} value={queryFilters.search} />
          <Button className='p-3 h-9 w-9 ' onClick={() => search()}>
            {isSearching ? <LoaderCircle className={'animate-spin'} /> : <Search size={25} />}
          </Button>
        </div>
        <div className='grid gap-2 grid-cols-1 min-[350px]:grid-cols-2 lg:grid-cols-1'>
          <FormMultiCheckboxComponent
            items={grade}
            label={'Klassetrinn'}
            onChange={(classes) => setQueryFilters({ ...queryFilters, classes })}
            value={queryFilters.classes}
          />

          <div className='space-y-3'>
            <Label>Jobbtype</Label>
            <RadioGroup
              className='flex flex-col space-y-1'
              onValueChange={(job_type) => setQueryFilters({ ...queryFilters, job_type })}
              value={queryFilters.job_type}>
              {jobTypes.map(([value, label]) => (
                <div className='flex items-center space-x-3 space-y-0' key={value}>
                  <RadioGroupItem value={value} />
                  <Label className='font-normal'>{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
