import { Link } from '@tanstack/react-router';
import type { JobListItem as JobListItemType } from '@tihlde/sdk';
import AspectRatioImg from '~/components/miscellaneous/AspectRatioImg';
import { Badge } from '~/components/ui/badge';
import { Skeleton } from '~/components/ui/skeleton';
import { JOB_TYPE_LABELS, CLASS_LABELS } from '~/routes/jobs/-components/job-labels';
import { formatDate, urlEncode } from '~/utils';
import { parseISO } from 'date-fns';
import { CalendarClock, MapPin } from 'lucide-react';

export type JobPostListItemProps = {
  jobPost: JobListItemType;
};

const JobPostListItem = ({ jobPost }: JobPostListItemProps) => {
  const deadline = jobPost.isContinuouslyHiring
    ? 'Fortlopende'
    : jobPost.deadline
      ? formatDate(parseISO(jobPost.deadline), { time: false })
      : 'Ingen frist';

  const startLabel = CLASS_LABELS[jobPost.classStart] ?? jobPost.classStart;
  const endLabel = CLASS_LABELS[jobPost.classEnd] ?? jobPost.classEnd;
  const classRange = jobPost.classStart === jobPost.classEnd ? `${startLabel} klasse` : `${startLabel} - ${endLabel} klasse`;

  return (
    <Link
      className='block bg-muted rounded-lg'
      to='/stillingsannonser/$id/{-$urlTitle}'
      params={{ id: jobPost.id.toString(), urlTitle: urlEncode(jobPost.title) }}>
      <div className='group rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 bg-muted/30'>
        <div className='flex flex-col xl:flex-row h-full'>
          <div className='w-full xl:w-3/6'>
            <AspectRatioImg alt={jobPost.imageAlt || jobPost.title} className='w-full object-cover!' ratio={'16:7'} src={jobPost.imageUrl ?? ''} />
          </div>

          <div className='flex-1 p-4 flex flex-col justify-between'>
            <div className='space-y-3'>
              <h2 className='text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors'>{jobPost.title}</h2>

              <div className='flex flex-wrap gap-2'>
                <Badge className='bg-primary test-primary-foreground font-medium px-3 py-1 rounded-full w-fit'>
                  {JOB_TYPE_LABELS[jobPost.jobType] ?? jobPost.jobType}
                </Badge>
                <Badge className='bg-primary test-primary-foreground font-medium px-3 py-1 rounded-full w-fit'>{jobPost.company}</Badge>
                <Badge className='bg-primary test-primary-foreground font-medium px-3 py-1 rounded-full w-fit'>{classRange}</Badge>
              </div>
            </div>

            <div className='mt-4 gap-2 md:space-y-2 space-x-2  flex md:flex-col md:space-x-0 '>
              <div className='flex items-center gap-2 text-sm'>
                <MapPin className='h-5 w-5 text-muted-foreground' />
                <span>{jobPost.location}</span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <CalendarClock className='h-5 w-5 text-muted-foreground' />
                <span>{deadline}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobPostListItem;

export const JobPostListItemLoading = () => (
  <div className='space-y-4'>
    {Array.from({ length: 3 }).map((_, index) => (
      <div className='rounded-lg overflow-hidden shadow-xs flex flex-col sm:flex-row h-full bg-muted/30' key={index}>
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
