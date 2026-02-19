import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { listJobInfiniteQuery, type JobListEntry } from '~/api/queries/jobs';
import AspectRatioImg from '~/components/miscellaneous/AspectRatioImg';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import { Badge } from '~/components/ui/badge';
import { Button, PaginateButton } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import Expandable from '~/components/ui/expandable';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Separator } from '~/components/ui/separator';
import { Skeleton } from '~/components/ui/skeleton';
import { Switch } from '~/components/ui/switch';
import { useDebounce } from '~/hooks/Utils';
import { formatDate, urlEncode } from '~/utils';
import { CalendarClock, FilterXIcon, MapPin, SlidersHorizontalIcon } from 'lucide-react';
import { Suspense, useEffect, useMemo, useState } from 'react';

import { Route } from '../index';

type JobType = NonNullable<JobListEntry['jobType']>;
type ClassLevel = JobListEntry['classStart'];

const JOB_TYPE_LABELS: Record<JobType, string> = {
  full_time: 'Fulltid',
  part_time: 'Deltid',
  summer_job: 'Sommerjobb',
  other: 'Annet',
};

const CLASS_LEVEL_LABEL: Record<NonNullable<ClassLevel>, string> = {
  first: '1',
  second: '2',
  third: '3',
  fourth: '4',
  fifth: '5',
  alumni: 'Alumni',
};

function getClassRange(start: ClassLevel, end: ClassLevel): string | null {
  if (!start || !end) return null;
  const s = CLASS_LEVEL_LABEL[start];
  const e = CLASS_LEVEL_LABEL[end];
  return s === e ? `${s}. klasse` : `${s}. - ${e}. klasse`;
}

type JobListViewProps = {
  resetFilters: () => void;
};

export function JobListView({ resetFilters }: JobListViewProps) {
  const { search, jobType, year, expired } = Route.useSearch();
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const { hasActiveFilters, activeFilterCount } = useMemo(() => {
    let count = 0;
    if (search) count++;
    if (jobType) count++;
    if (year) count++;
    if (expired) count++;
    return { hasActiveFilters: count > 0, activeFilterCount: count };
  }, [search, jobType, year, expired]);

  return (
    <div className='grid lg:grid-cols-[400px_1fr] gap-6 items-start'>
      <div>
        {/* Desktop filters */}
        <Card className='not-lg:hidden'>
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
                  <FilterXIcon className='mr-1' size={18} />
                  <span className='text-sm'>Nullstill</span>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className='p-4'>
            <SearchFilters />
          </CardContent>
        </Card>

        {/* Mobile filters */}
        <Expandable
          className='lg:hidden'
          description='Filtrer stillingsannonser'
          icon={<SlidersHorizontalIcon className='w-5 h-5 stroke-[1.5px]' />}
          onOpenChange={setFiltersExpanded}
          open={filtersExpanded}
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
            <SearchFilters />
          </div>
        </Expandable>
      </div>

      <div className='space-y-4'>
        <Suspense fallback={<JobListLoading />}>
          <JobList search={search} jobType={jobType} year={year} expired={expired} />
        </Suspense>
      </div>
    </div>
  );
}

type JobListProps = {
  search: string;
  jobType?: JobType;
  year?: ClassLevel;
  expired?: boolean;
};

function JobList({ search, jobType, year, expired }: JobListProps) {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery({
    ...listJobInfiniteQuery({
      ...(search ? { search } : undefined),
      ...(jobType ? { jobType } : undefined),
      ...(year ? { year } : undefined),
      ...(expired === true ? { expired } : undefined),
    }),
    select: (data) => data.pages.flatMap((page) => page.items),
  });

  if (!data.length) {
    return <NotFoundIndicator header='Fant ingen stillingsannonser' />;
  }

  return (
    <>
      <div className='space-y-4'>
        {data.map((job) => (
          <JobListItem job={job} key={job.id} />
        ))}
      </div>
      {hasNextPage && <PaginateButton className='w-full mt-6' nextPage={fetchNextPage} isLoading={isFetchingNextPage} />}
    </>
  );
}

function JobListItem({ job }: { job: JobListEntry }) {
  const deadline = job.isContinuouslyHiring ? 'Fortløpende' : job.deadline ? formatDate(job.deadline, { time: false }) : null;
  const classRange = getClassRange(job.classStart, job.classEnd);

  return (
    <Link className='block bg-muted rounded-lg' params={{ id: job.id, urlTitle: urlEncode(job.title) }} to='/stillingsannonser/$id/{-$urlTitle}'>
      <div className='group rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 bg-muted/30'>
        <div className='flex flex-col xl:flex-row h-full'>
          <div className='w-full xl:w-3/6'>
            <AspectRatioImg alt={job.imageAlt ?? job.title} className='w-full object-cover!' ratio={'16:7'} src={job.imageUrl ?? undefined} />
          </div>
          <div className='flex-1 p-4 flex flex-col justify-between'>
            <div className='space-y-3'>
              <h2 className='text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors'>{job.title}</h2>
              <div className='flex flex-wrap gap-2'>
                <Badge className='font-medium px-3 py-1 rounded-full'>{JOB_TYPE_LABELS[job.jobType]}</Badge>
                <Badge className='font-medium px-3 py-1 rounded-full'>{job.company}</Badge>
                {classRange && <Badge className='font-medium px-3 py-1 rounded-full'>{classRange}</Badge>}
              </div>
            </div>
            <div className='mt-4 gap-2 md:space-y-2 space-x-2 flex md:flex-col md:space-x-0'>
              <div className='flex items-center gap-2 text-sm'>
                <MapPin className='h-5 w-5 text-muted-foreground' />
                <span>{job.location}</span>
              </div>
              {deadline && (
                <div className='flex items-center gap-2 text-sm'>
                  <CalendarClock className='h-5 w-5 text-muted-foreground' />
                  <span>{deadline}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SearchFilters() {
  const params = Route.useSearch();
  const navigate = Route.useNavigate();
  const [search, setSearch] = useState(params.search);

  function setFilter<K extends keyof typeof params>(key: K, value: (typeof params)[K]) {
    navigate({ search: (old) => ({ ...old, [key]: value }) });
  }

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch !== params.search) {
      setFilter('search', debouncedSearch);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (params.search !== search) {
      setSearch(params.search);
    }
  }, [params.search]);

  const years: [NonNullable<ClassLevel>, string][] = [
    ['first', '1. klasse'],
    ['second', '2. klasse'],
    ['third', '3. klasse'],
    ['fourth', '4. klasse'],
    ['fifth', '5. klasse'],
    ['alumni', 'Alumni'],
  ];

  const jobTypes: [JobType, string][] = [
    ['summer_job', 'Sommerjobb'],
    ['part_time', 'Deltid'],
    ['full_time', 'Fulltid'],
    ['other', 'Annet'],
  ];

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <Label className='text-sm font-medium' htmlFor='job-search'>
          Søk
        </Label>
        <Input id='job-search' onChange={(e) => setSearch(e.target.value)} placeholder='Søk etter tittel, firma...' value={search} />
      </div>

      <Separator />

      <div className='space-y-3'>
        <Label className='text-sm font-medium'>Klassetrinn</Label>
        <RadioGroup className='space-y-2' onValueChange={(value) => setFilter('year', value as NonNullable<ClassLevel>)} value={params.year ?? ''}>
          {years.map(([value, label]) => (
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
        <RadioGroup className='space-y-2' onValueChange={(value) => setFilter('jobType', value as JobType)} value={params.jobType ?? ''}>
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

      <Separator />

      <div className='space-y-3'>
        <h3 className='text-sm font-medium'>Alternativer</h3>
        <div className='flex flex-row items-center justify-between rounded-lg bg-muted/50 p-3'>
          <div className='space-y-0.5'>
            <Label className='text-sm font-medium'>Utgåtte</Label>
            <p className='text-xs'>Vis utgåtte stillingsannonser</p>
          </div>
          <Switch checked={params.expired ?? false} onCheckedChange={(value) => setFilter('expired', value)} />
        </div>
      </div>
    </div>
  );
}

function JobListLoading() {
  return (
    <div className='space-y-4'>
      {Array.from({ length: 3 }).map((_, i) => (
        <div className='rounded-lg overflow-hidden shadow-xs flex flex-col sm:flex-row h-full bg-muted/30' key={i}>
          <div className='w-full sm:w-2/5'>
            <Skeleton className='w-full h-[120px]' />
          </div>
          <div className='flex-1 p-4 flex flex-col justify-between'>
            <div className='space-y-3'>
              <Skeleton className='h-7 w-3/4' />
              <div className='flex flex-wrap gap-2'>
                <Skeleton className='h-6 w-20 rounded-full' />
                <Skeleton className='h-6 w-24 rounded-full' />
                <Skeleton className='h-6 w-28 rounded-full' />
              </div>
            </div>
            <div className='mt-4 space-y-2'>
              <Skeleton className='h-5 w-32' />
              <Skeleton className='h-5 w-36' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
