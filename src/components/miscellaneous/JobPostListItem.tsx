import { Link } from '@tanstack/react-router';
import AspectRatioImg from '~/components/miscellaneous/AspectRatioImg';
import { Badge } from '~/components/ui/badge';
import { Skeleton } from '~/components/ui/skeleton';
import type { JobPost } from '~/types';
import { formatDate, getJobpostType, urlEncode } from '~/utils';
import { parseISO } from 'date-fns';
import { CalendarClock, MapPin } from 'lucide-react';

export type JobPostListItemProps = {
  jobPost: JobPost;
};

const JobPostListItem = ({ jobPost }: JobPostListItemProps) => {
  const deadline = jobPost.is_continuously_hiring ? 'Fortløpende' : formatDate(parseISO(jobPost.deadline), { time: false });

  const classRange = jobPost.class_start === jobPost.class_end ? `${jobPost.class_start}. klasse` : `${jobPost.class_start}. - ${jobPost.class_end}. klasse`;

  return (
    <Link
      className='block bg-muted rounded-lg'
      to='/stillingsannonser/$id/{-$urlTitle}'
      params={{ id: jobPost.id.toString(), urlTitle: urlEncode(jobPost.title) }}>
      <div className='group rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 bg-muted/30'>
        {/* Responsive layout - vertical on mobile, horizontal on sm and up */}
        <div className='flex flex-col xl:flex-row h-full'>
          {/* Card Image */}
          <div className='w-full xl:w-3/6'>
            <AspectRatioImg alt={jobPost.image_alt || jobPost.title} className='w-full object-cover!' ratio={'16:7'} src={jobPost.image} />
          </div>

          {/* Card Content */}
          <div className='flex-1 p-4 flex flex-col justify-between'>
            {/* Title and Badges */}
            <div className='space-y-3'>
              <h2 className='text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors'>{jobPost.title}</h2>

              <div className='flex flex-wrap gap-2'>
                <Badge className='bg-primary test-primary-foreground font-medium px-3 py-1 rounded-full w-fit'>{getJobpostType(jobPost.job_type)}</Badge>
                <Badge className='bg-primary test-primary-foreground font-medium px-3 py-1 rounded-full w-fit'>{jobPost.company}</Badge>
                <Badge className='bg-primary test-primary-foreground font-medium px-3 py-1 rounded-full w-fit'>{classRange}</Badge>
              </div>
            </div>

            {/* Location and Deadline */}
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
        {/* Skeleton Image */}
        <div className='w-full sm:w-2/5'>
          <Skeleton className='w-full h-[120px]' />
        </div>

        {/* Skeleton Content */}
        <div className='flex-1 p-4 flex flex-col justify-between'>
          <div className='space-y-3'>
            {/* Title */}
            <Skeleton className='h-7 w-3/4' />

            {/* Badges */}
            <div className='flex flex-wrap gap-2'>
              <Skeleton className='h-6 w-20 rounded-full' />
              <Skeleton className='h-6 w-24 rounded-full' />
              <Skeleton className='h-6 w-28 rounded-full' />
            </div>
          </div>

          {/* Location and Deadline */}
          <div className='mt-4 space-y-2'>
            <Skeleton className='h-5 w-32' />
            <Skeleton className='h-5 w-36' />
          </div>
        </div>
      </div>
    ))}
  </div>
);
