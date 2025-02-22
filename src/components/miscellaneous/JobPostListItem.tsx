import { parseISO } from 'date-fns';
import { CalendarClock, GraduationCap, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate, getJobpostType, urlEncode } from 'utils';

import { JobPost } from 'types';

import AspectRatioImg from 'components/miscellaneous/AspectRatioImg';
import { Skeleton } from 'components/ui/skeleton';

import { Separator } from '../ui/separator';

export type JobPostListItemProps = {
  jobPost: JobPost;
};

const JobPostListItem = ({ jobPost }: JobPostListItemProps) => (
  <Link className='border rounded-md bg-card space-y-4 text-black dark:text-white' to={`${URLS.jobposts}${jobPost.id}/${urlEncode(jobPost.title)}/`}>
    <div className={'flex flex-col sm:flex-row'}>
      <AspectRatioImg
        alt={jobPost.image_alt || jobPost.title}
        className='!rounded-b-none sm:!rounded-l-md sm:!rounded-r-none sm:w-[350px] xl:w-[400px]'
        ratio={'16:9'}
        src={jobPost.image}
      />

      <div className={'flex flex-col w-full justify-between py-2'}>
        <div className='flex flex-row'>
          <div className='px-4 py-2 flex-wrap w-full items-start gap-2 flex flex-col'>
            <h1 className='truncate text-wrap text-xl md:text-2xl font-bold'>{jobPost.title}</h1>
            <div className={'flex gap-2'}>
              <div className={'px-4 bg-primary text-white dark:text-black rounded-full'}>{getJobpostType(jobPost.job_type)}</div>
              <div className={'px-4 bg-primary text-white dark:text-black rounded-full'}>{jobPost.company}</div>
            </div>
            <Separator className={'bg-secondary h-[3px]'} />
          </div>
        </div>

        <div className={'flex flex-col gap-2 px-4 py-2'}>
          <div className={'flex flex-row gap-2 item-center'}>
            <MapPin className={'xl:size-7'} />
            <h1 className='text-sm'>{jobPost.location}</h1>
          </div>
          <div className={'flex flex-row gap-2 items-center'}>
            <GraduationCap className={'xl:size-7'} />
            <h1 className='text-sm'>
              {`${jobPost.class_start === jobPost.class_end ? `${jobPost.class_start}.` : `${jobPost.class_start}. - ${jobPost.class_end}. klasse`}`}
            </h1>
          </div>
          <div className={'flex flex-row gap-2 items-center'}>
            <CalendarClock className={'xl:size-7'} />
            <h1 className='text-sm'>{jobPost.is_continuously_hiring ? 'Fortløpende' : formatDate(parseISO(jobPost.deadline), { time: false })}</h1>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

export default JobPostListItem;

export const JobPostListItemLoading = () => (
  <div className='grid lg:grid-cols-1 gap-4'>
    {Array.from(Array(6).keys()).map((index) => (
      <div className={'flex flex-col sm:flex-row bg-card border rounded-md '} key={index}>
        <Skeleton className='!rounded-b-none sm:!rounded-l-md sm:!rounded-r-none sm:w-[350px] xl:w-[400px]' />
        <div className={'flex flex-col w-full justify-between py-2'}>
          <div className='flex flex-row'>
            <div className='px-4 py-2 flex-wrap w-full items-start gap-2 flex flex-col'>
              <Skeleton className='h-6 w-3/4' />
              <div className={'flex gap-2'}>
                <Skeleton className='h-6 w-20 rounded-full' />
                <Skeleton className='h-6 w-28 rounded-full' />
              </div>
              <Separator className={'bg-secondary h-[3px]'} />
            </div>
          </div>

          <div className={'flex flex-col gap-5 px-4 py-2 mt-1'}>
            <div className={'flex flex-row gap-2 item-center'}>
              <Skeleton className='h-4 w-28 rounded-full' />
            </div>
            <div className={'flex flex-row gap-2 items-center'}>
              <Skeleton className='h-4 w-28 rounded-full' />
            </div>
            <div className={'flex flex-row gap-2 items-center'}>
              <Skeleton className='h-4 w-36 rounded-full' />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);
