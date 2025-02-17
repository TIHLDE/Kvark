import { parseISO } from 'date-fns';
import { BriefcaseBusiness, CalendarClock, GraduationCap, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate, getJobpostType, urlEncode } from 'utils';

import { JobPost } from 'types';

import AspectRatioImg from 'components/miscellaneous/AspectRatioImg';
import { Skeleton } from 'components/ui/skeleton';

import TIHLDE_LOGO from '../../assets/img/TihldeBackground.jpg';
import { Separator } from "../ui/separator";

export type JobPostListItemProps = {
  jobPost: JobPost;
};

const JobPostListItem = ({ jobPost }: JobPostListItemProps) => {
  const [imgUrl, setImgUrl] = useState(jobPost.image || TIHLDE_LOGO);

  useEffect(() => {
    setImgUrl(jobPost.image || TIHLDE_LOGO);
  }, [jobPost.image]);

  return (
    <Link className='border rounded-md bg-card space-y-4 text-black dark:text-white' to={`${URLS.jobposts}${jobPost.id}/${urlEncode(jobPost.title)}/`}>
      <div className={'flex flex-col sm:flex-row'}>
        <AspectRatioImg alt={jobPost.image_alt || jobPost.title} className='!rounded-b-none sm:rounded-r-none' ratio={'16:9'} src={jobPost.image} />

        <div className={'flex flex-col justify-between py-2'}>
          <div className='flex flex-row'>
            <div className='px-4 py-2 flex-wrap w-full items-start gap-2 flex flex-col'>
              <h1 className='truncate text-wrap text-xl md:text-2xl font-bold'>{jobPost.title}</h1>
              <div className={'flex gap-2'}>
                <div className={'px-3 bg-green-600 rounded-full'}>{jobPost.job_type.toLowerCase()}</div>
                <div className={'px-3 bg-green-600 rounded-full'}>{jobPost.company}</div>
              </div>
              <Separator className={'h-[3px]'} />
            </div>
          </div>

          <div className={'flex flex-col gap-2 px-4'}>
            <div className={'flex flex-row gap-2 item-center'}>
              <MapPin />
              <h1 className='text-sm'>{jobPost.location}</h1>
            </div>
            <div className={'flex flex-row gap-2 items-center'}>
              <GraduationCap />
              <h1 className='text-sm'>
                {`${jobPost.class_start === jobPost.class_end ? `${jobPost.class_start}.` : `${jobPost.class_start}. - ${jobPost.class_end}. klasse`}`}
              </h1>
            </div>
            <div className={'flex flex-row gap-2 items-center'}>
              <CalendarClock />
              <h1 className='text-sm'>{jobPost.is_continuously_hiring ? 'Fortløpende' : formatDate(parseISO(jobPost.deadline), { time: false })}</h1>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default JobPostListItem;

export const JobPostListItemLoading = () => (
  <div className='grid lg:grid-cols-1 gap-4'>
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
