import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import JobPostListItem, { JobPostListItemLoading } from '~/components/miscellaneous/JobPostListItem';
import Page from '~/components/navigation/Page';
import { Badge } from '~/components/ui/badge';
import { Button, PaginateButton } from '~/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Separator } from '~/components/ui/separator';
import { getJobsInfiniteQuery } from '~/api/queries/jobs';
import { JOB_TYPE_LABELS } from '~/routes/jobs/-components/job-labels';
import { useDebounce } from '~/hooks/Utils';
import { ChevronRightIcon, FilterX, Search } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

const JOB_TYPE_ENTRIES = Object.entries(JOB_TYPE_LABELS);

type YearValue = 'first' | 'second' | 'third' | 'fourth' | 'fifth' | 'alumni';

const YEAR_OPTIONS: { label: string; value: YearValue }[] = [
  { label: '1. klasse', value: 'first' },
  { label: '2. klasse', value: 'second' },
  { label: '3. klasse', value: 'third' },
  { label: '4. klasse', value: 'fourth' },
  { label: '5. klasse', value: 'fifth' },
];

const YEAR_LABELS: Record<string, string> = {
  first: '1. klasse',
  second: '2. klasse',
  third: '3. klasse',
  fourth: '4. klasse',
  fifth: '5. klasse',
  alumni: 'Alumni',
};

const defaultJobPostsSearch = { search: '', year: '', jobType: '' };

const jobPostsSearchSchema = z.object({
  search: z.string().optional().default(defaultJobPostsSearch.search),
  year: z.string().optional().default(defaultJobPostsSearch.year),
  jobType: z.string().optional().default(defaultJobPostsSearch.jobType),
});

type JobPostsSearch = z.infer<typeof jobPostsSearchSchema>;

export const Route = createFileRoute('/_MainLayout/stillingsannonser/')({
  validateSearch: jobPostsSearchSchema,
  search: {
    middlewares: [stripSearchParams(defaultJobPostsSearch)],
  },
  loaderDeps: ({ search }) => search,
  component: JobPosts,
});

function JobPosts() {
  const queryFilters = Route.useSearch();
  const navigate = Route.useNavigate();

  function setQueryFilters(newFilters: JobPostsSearch) {
    navigate({ search: newFilters, replace: true });
  }

  const debouncedSearch = useDebounce(queryFilters.search, 500);
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(
    getJobsInfiniteQuery({
      search: debouncedSearch || undefined,
      jobType: (queryFilters.jobType as 'full_time' | 'part_time' | 'summer_job' | 'other') || undefined,
      year: (queryFilters.year as YearValue) || undefined,
    }),
  );

  const jobs = data?.pages.flatMap((page) => page.items) ?? [];
  const jobCount = jobs.length;

  function resetFilters() {
    setQueryFilters({ search: '', year: '', jobType: '' });
  }

  const [isOpen, setIsOpen] = useState<boolean>(typeof window !== 'undefined' && window.innerWidth > 1000);
  const hasActiveFilters = queryFilters.search || queryFilters.year || queryFilters.jobType;

  return (
    <Page className='space-y-8 max-w-(--breakpoint-2xl) mx-auto'>
      <div>
        <h1 className='text-3xl md:text-5xl font-bold'>Stillingsannonser</h1>
        <p className='text-muted-foreground mt-2'>Finn relevante jobber for studenter</p>
      </div>

      <div className='grid lg:grid-cols-[400px_1fr] gap-6 items-start'>
        <div className='border rounded-lg bg-card shadow-xs'>
          <Collapsible className='group' onOpenChange={setIsOpen} open={isOpen}>
            <div className='flex justify-between items-center p-4 border-b'>
              <div className='flex items-center gap-2'>
                <h3 className='font-medium text-lg'>Filter</h3>
                {hasActiveFilters && (
                  <Badge className='ml-2' variant='secondary'>
                    {(queryFilters.year ? 1 : 0) + (queryFilters.jobType ? 1 : 0) + (queryFilters.search ? 1 : 0)}
                  </Badge>
                )}
              </div>
              <div className='flex items-center gap-2'>
                {hasActiveFilters && (
                  <Button aria-label='Nullstill filter' className='h-8 px-2' onClick={resetFilters} size='sm' variant='ghost'>
                    <FilterX className='mr-1' size={18} />
                    <span className='text-sm'>Nullstill</span>
                  </Button>
                )}
                <CollapsibleTrigger className='xl:hidden flex items-center justify-center h-8 w-8 rounded-md hover:bg-secondary'>
                  <ChevronRightIcon className='w-5 h-5 group-data-[state=open]:rotate-90 transition-transform' />
                </CollapsibleTrigger>
              </div>
            </div>
            <CollapsibleContent className='lg:block'>
              <SearchForm queryFilters={queryFilters} setQueryFilters={setQueryFilters} />
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className='space-y-4'>
          {hasActiveFilters && (
            <div className='flex flex-wrap gap-2 mb-4'>
              {queryFilters.search && (
                <Badge className='flex items-center gap-1 px-3 py-1' variant='outline'>
                  <span>Søk: {queryFilters.search}</span>
                  <button
                    aria-label='Fjern søkefilter'
                    className='ml-1 hover:bg-secondary rounded-full p-1'
                    onClick={() => setQueryFilters({ ...queryFilters, search: '' })}>
                    <FilterX size={14} />
                  </button>
                </Badge>
              )}

              {queryFilters.jobType && (
                <Badge className='flex items-center gap-1 px-3 py-1' variant='outline'>
                  <span>Type: {JOB_TYPE_LABELS[queryFilters.jobType] ?? queryFilters.jobType}</span>
                  <button
                    aria-label='Fjern jobbtype-filter'
                    className='ml-1 hover:bg-secondary rounded-full p-1'
                    onClick={() => setQueryFilters({ ...queryFilters, jobType: '' })}>
                    <FilterX size={14} />
                  </button>
                </Badge>
              )}

              {queryFilters.year && (
                <Badge className='flex items-center gap-1 px-3 py-1' variant='outline'>
                  <span>Klasse: {YEAR_LABELS[queryFilters.year] ?? queryFilters.year}</span>
                  <button
                    aria-label='Fjern klassefilter'
                    className='ml-1 hover:bg-secondary rounded-full p-1'
                    onClick={() => setQueryFilters({ ...queryFilters, year: '' })}>
                    <FilterX size={14} />
                  </button>
                </Badge>
              )}
            </div>
          )}

          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-lg font-medium'>
              {jobCount} {jobCount === 1 ? 'stilling' : 'stillinger'} funnet
            </h2>
          </div>

          <div className='space-y-4'>
            {jobs.length > 0 ? (
              jobs.map((jobPost) => <JobPostListItem jobPost={jobPost} key={jobPost.id} />)
            ) : !isLoading ? (
              <div className='text-center py-12 bg-muted/30 rounded-lg'>
                <h3 className='text-xl font-medium mb-2'>Ingen stillinger funnet</h3>
                <p className='text-muted-foreground'>Prøv å justere filtrene dine for å se flere resultater</p>
              </div>
            ) : null}

            {isLoading && (
              <div className='space-y-4'>
                <JobPostListItemLoading />
                <JobPostListItemLoading />
              </div>
            )}

            {hasNextPage && <PaginateButton className='w-full mt-6' isLoading={isLoading} nextPage={fetchNextPage} />}
          </div>
        </div>
      </div>
    </Page>
  );
}

type SearchFormProps = {
  queryFilters: JobPostsSearch;
  setQueryFilters: (newFilters: JobPostsSearch) => void;
};

function SearchForm({ queryFilters, setQueryFilters }: SearchFormProps) {
  const [localSearch, setLocalSearch] = useState(queryFilters.search);
  const debouncedLocalSearch = useDebounce(localSearch, 500);

  // Sync debounced local search to URL params
  if (debouncedLocalSearch !== queryFilters.search) {
    setQueryFilters({ ...queryFilters, search: debouncedLocalSearch });
  }

  // Reset local input when search is cleared externally (e.g. "clear all filters")
  if (queryFilters.search === '' && localSearch !== '' && debouncedLocalSearch === localSearch) {
    setLocalSearch('');
  }

  return (
    <div className='p-4 space-y-6'>
      <div className='space-y-2'>
        <Label className='text-sm font-medium' htmlFor='search-input'>
          Søk etter stillinger
        </Label>
        <div className='flex gap-2'>
          <Input
            className='flex-1'
            id='search-input'
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder='Søk etter tittel, firma...'
            value={localSearch}
          />
          <Button aria-label='Søk' size='icon'>
            <Search className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <Separator />

      <div className='space-y-3'>
        <Label className='text-sm font-medium'>Klassetrinn</Label>
        <RadioGroup
          className='space-y-2'
          onValueChange={(year) => setQueryFilters({ ...queryFilters, year })}
          value={queryFilters.year}>
          {YEAR_OPTIONS.map(({ value, label }) => (
            <div className='flex items-center space-x-2' key={value}>
              <RadioGroupItem id={`year-${value}`} value={value} />
              <Label className='font-normal text-sm cursor-pointer' htmlFor={`year-${value}`}>
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      <div className='space-y-3'>
        <Label className='text-sm font-medium'>Jobbtype</Label>
        <RadioGroup className='space-y-2' onValueChange={(jobType) => setQueryFilters({ ...queryFilters, jobType })} value={queryFilters.jobType}>
          {JOB_TYPE_ENTRIES.map(([value, label]) => (
            <div className='flex items-center space-x-2' key={value}>
              <RadioGroupItem id={`job-type-${value}`} value={value} />
              <Label className='font-normal text-sm cursor-pointer' htmlFor={`job-type-${value}`}>
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
