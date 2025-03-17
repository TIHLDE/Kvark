import AspectRatioImg from '~/components/miscellaneous/AspectRatioImg';
import { Separator } from '~/components/ui/separator';
import { Skeleton } from '~/components/ui/skeleton';
import type { JobPost } from '~/types';
import { formatDate, getJobpostType, urlEncode } from '~/utils';
import { parseISO } from 'date-fns';
import { CalendarClock, MapPin } from 'lucide-react';

import NavLink from '../ui/navlink';

export type JobPostListItemProps = {
  jobPost: JobPost;
};

const JobPostListItem = ({ jobPost }: JobPostListItemProps) => (
  <NavLink
    className='border rounded-md bg-card space-y-4 text-black dark:text-white'
    params={{ id: jobPost.id.toString(), urlTitle: urlEncode(jobPost.title) }}
    to='/stillingsannonser/:id/:urlTitle?'>
    <div className={'flex flex-col sm:flex-row'}>
      <div className={'w-full'}>
        <AspectRatioImg
          alt={jobPost.image_alt || jobPost.title}
          className='!rounded-b-none sm:!rounded-l-md sm:!rounded-r-none w-full h-full !object-cover'
          ratio={'16:7'}
          src={jobPost.image}
        />
      </div>

      <div className={'flex flex-col w-full justify-between py-2'}>
        <div className='flex flex-row'>
          <div className='px-4 py-2 flex-wrap w-full items-start gap-2 flex flex-col'>
            <h1 className='truncate text-wrap text-ml md:text-xl font-bold'>{jobPost.title}</h1>
            <div className={'flex gap-2'}>
              <div className={'px-4 bg-primary text-white text-sm dark:text-black rounded-full'}>{getJobpostType(jobPost.job_type)}</div>
              <div className={'px-4 bg-primary text-white text-sm dark:text-black rounded-full'}>{jobPost.company}</div>
              <div className={'px-4 bg-primary text-white text-sm dark:text-black rounded-full'}>
                {`${jobPost.class_start === jobPost.class_end ? `${jobPost.class_start}.` : `${jobPost.class_start}. - ${jobPost.class_end}. klasse`}`}
              </div>
            </div>
            <Separator className={'bg-secondary h-[2px]'} />
          </div>
        </div>

        <div className={'flex flex-col gap-2 px-4 py-2'}>
          <div className={'flex flex-row gap-2 item-center'}>
            <MapPin className={'xl:size-7'} />
            <h1 className='text-sm'>{jobPost.location}</h1>
          </div>
          <div className={'flex flex-row gap-2 items-center'}>
            <CalendarClock className={'xl:size-7'} />
            <h1 className='text-sm'>{jobPost.is_continuously_hiring ? 'Fortløpende' : formatDate(parseISO(jobPost.deadline), { time: false })}</h1>
          </div>
        </div>
      </div>
    </div>
  </NavLink>
);

export default JobPostListItem;

export const JobPostListItemLoading = () => (
  <div className='grid lg:grid-cols-1 gap-4'>
    {Array.from(Array(6).keys()).map((index) => (
      <div className={'flex flex-col sm:flex-row bg-card border rounded-md'} key={index}>
        <Skeleton className='!rounded-b-none sm:!rounded-l-md sm:!rounded-r-none h-[225px] sm:h-[180px] w-full sm:w-[700px] xl:w-[700px]' />
        <div className={'flex flex-col w-full justify-between py-2'}>
          <div className='flex flex-row'>
            <div className='px-4 py-2 flex-wrap w-full items-start gap-2 flex flex-col'>
              <Skeleton className='h-6 w-3/4' />
              <div className={'flex gap-2'}>
                <Skeleton className='h-5 w-20 rounded-full' />
                <Skeleton className='h-5 w-20 rounded-full' />
                <Skeleton className='h-5 w-20 rounded-full' />
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
          </div>
        </div>
      </div>
    ))}
  </div>
);
