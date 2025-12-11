'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { FormMultiCheckboxComponent } from '~/components/inputs/MultiCheckbox';
import JobPostListItem, { JobPostListItemLoading } from '~/components/miscellaneous/JobPostListItem';
import Page from '~/components/navigation/Page';
import { Badge } from '~/components/ui/badge';
import { Button, PaginateButton } from '~/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Separator } from '~/components/ui/separator';
import { jobPostsQuery } from '~/hooks/JobPost';
import { useDebounce } from '~/hooks/Utils';
import { ChevronRightIcon, FilterX, LoaderCircle, Search } from 'lucide-react';
import { parseAsArrayOf, parseAsString, useQueryStates, type inferParserType } from 'nuqs';
import { useState } from 'react';

const urlParamFilters = {
  search: parseAsString.withDefault(''),
  classes: parseAsArrayOf(parseAsString).withDefault([]),
  job_type: parseAsString.withDefault(''),
};

export const Route = createFileRoute('/_MainLayout/stillingsannonser/')({
  loaderDeps: ({ search }) => search,
  component: JobPosts,
});

function JobPosts() {
  const [queryFilters, setQueryFilters] = useQueryStates(urlParamFilters);

  const debouncedSearch = useDebounce(queryFilters.search, 500);
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(
    jobPostsQuery({
      ...queryFilters,
      search: debouncedSearch,
    }),
  );

  const jobs = data?.pages.flatMap((page) => page.results) ?? [];
  const jobCount = jobs.length;

  function resetFilters() {
    setQueryFilters({
      search: '',
      classes: [],
      job_type: '',
    });
  }

  const [isOpen, setIsOpen] = useState<boolean>(typeof window !== 'undefined' && window.innerWidth > 1000);

  const hasActiveFilters = queryFilters.search || queryFilters.classes.length > 0 || queryFilters.job_type;

  const jobTypes = [
    ['SUMMER_JOB', 'Sommerjobb'],
    ['PART_TIME', 'Deltid'],
    ['FULL_TIME', 'Fulltid'],
    ['OTHER', 'Annet'],
  ];

  const getJobTypeLabel = (value: string) => {
    const jobType = jobTypes.find(([type]) => type === value);
    return jobType ? jobType[1] : '';
  };

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
                    {queryFilters.classes.length + (queryFilters.job_type ? 1 : 0) + (queryFilters.search ? 1 : 0)}
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
              <SearchForm isSearching={isLoading} queryFilters={queryFilters} search={() => {}} setQueryFilters={setQueryFilters} />
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className='space-y-4'>
          {/* Active filters display */}
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

              {queryFilters.job_type && (
                <Badge className='flex items-center gap-1 px-3 py-1' variant='outline'>
                  <span>Type: {getJobTypeLabel(queryFilters.job_type)}</span>
                  <button
                    aria-label='Fjern jobbtype-filter'
                    className='ml-1 hover:bg-secondary rounded-full p-1'
                    onClick={() => setQueryFilters({ ...queryFilters, job_type: '' })}>
                    <FilterX size={14} />
                  </button>
                </Badge>
              )}

              {queryFilters.classes.map((classValue) => (
                <Badge className='flex items-center gap-1 px-3 py-1' key={classValue} variant='outline'>
                  <span>Klasse: {classValue}. klasse</span>
                  <button
                    aria-label={`Fjern klasse ${classValue} filter`}
                    className='ml-1 hover:bg-secondary rounded-full p-1'
                    onClick={() =>
                      setQueryFilters({
                        ...queryFilters,
                        classes: queryFilters.classes.filter((c) => c !== classValue),
                      })
                    }>
                    <FilterX size={14} />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Results count */}
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-lg font-medium'>
              {jobCount} {jobCount === 1 ? 'stilling' : 'stillinger'} funnet
            </h2>
          </div>

          {/* Job listings */}
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
    <div className='p-4 space-y-6'>
      {/* Search input */}
      <div className='space-y-2'>
        <Label className='text-sm font-medium' htmlFor='search-input'>
          Søk etter stillinger
        </Label>
        <div className='flex gap-2'>
          <Input
            className='flex-1'
            id='search-input'
            onChange={(e) => setQueryFilters({ ...queryFilters, search: e.target.value })}
            placeholder='Søk etter tittel, firma...'
            value={queryFilters.search}
          />
          <Button aria-label='Søk' disabled={isSearching} onClick={() => search()} size='icon'>
            {isSearching ? <LoaderCircle className='h-4 w-4 animate-spin' /> : <Search className='h-4 w-4' />}
          </Button>
        </div>
      </div>

      <Separator />

      {/* Class/grade filter */}
      <div className='space-y-3'>
        <Label className='text-sm font-medium'>Klassetrinn</Label>
        <FormMultiCheckboxComponent
          items={grade}
          label={''}
          onChange={(classes) => setQueryFilters({ ...queryFilters, classes })}
          value={queryFilters.classes}
        />
      </div>

      <Separator />

      {/* Job type filter */}
      <div className='space-y-3'>
        <Label className='text-sm font-medium'>Jobbtype</Label>
        <RadioGroup className='space-y-2' onValueChange={(job_type) => setQueryFilters({ ...queryFilters, job_type })} value={queryFilters.job_type}>
          {jobTypes.map(([value, label]) => (
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
