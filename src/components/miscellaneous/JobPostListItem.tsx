import { parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate, getJobpostType, urlEncode } from 'utils';

import { JobPost } from 'types';

import AspectRatioImg from 'components/miscellaneous/AspectRatioImg';
import { Skeleton } from 'components/ui/skeleton';

export type JobPostListItemProps = {
  jobPost: JobPost;
};

const JobPostListItem = ({ jobPost }: JobPostListItemProps) => (
  <Link className='border rounded-md bg-card space-y-4 text-black dark:text-white' to={`${URLS.jobposts}${jobPost.id}/${urlEncode(jobPost.title)}/`}>
    <AspectRatioImg alt={jobPost.image_alt || jobPost.title} className='rounded-t-sm' src={jobPost.image} />

    <div>
      <div className='px-6'>
        <h1 className='text-xl font-bold whitespace-nowrap text-ellipsis overflow-hidden'>{jobPost.title}</h1>
        <p className='text-muted-foreground text-sm'>
          {jobPost.company} • {jobPost.location}
        </p>
      </div>
    </div>

    <div className='border-t py-2 px-6 flex items-center justify-between'>
      <div className='text-center'>
        <h1 className='font-bold'>Type</h1>
        <h1 className='text-sm'>{getJobpostType(jobPost.job_type)}</h1>
      </div>

      <div className='text-center'>
        <h1 className='font-bold'>Årstrinn</h1>
        <h1 className='text-sm'>
          {`${jobPost.class_start === jobPost.class_end ? `${jobPost.class_start}.` : `${jobPost.class_start}. - ${jobPost.class_end}.`}`}
        </h1>
      </div>

      <div className='text-center'>
        <h1 className='font-bold'>Frist</h1>
        <h1 className='text-sm'>{jobPost.is_continuously_hiring ? 'Fortløpende' : formatDate(parseISO(jobPost.deadline), { time: false })}</h1>
      </div>
    </div>
  </Link>
);

export default JobPostListItem;

export const JobPostListItemLoading = () => (
  <div className='grid lg:grid-cols-2 gap-4'>
    {Array.from(Array(6).keys()).map((index) => (
      <div className='rounded-md bg-card space-y-2 p-4' key={index}>
        <Skeleton className='h-60 w-full' />

        <div className='space-y-2'>
          <Skeleton className='h-6 w-3/4' />
          <Skeleton className='h-4 w-1/2' />
        </div>
      </div>
    ))}
  </div>
);
