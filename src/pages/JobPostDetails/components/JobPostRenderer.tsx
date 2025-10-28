import { Link } from '@tanstack/react-router';
import AspectRatioImg from '~/components/miscellaneous/AspectRatioImg';
import DetailContent from '~/components/miscellaneous/DetailContent';
import MarkdownRenderer from '~/components/miscellaneous/MarkdownRenderer';
import ShareButton from '~/components/miscellaneous/ShareButton';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { HavePermission } from '~/hooks/User';
import { useAnalytics } from '~/hooks/Utils';
import type { JobPost } from '~/types';
import { PermissionApp } from '~/types/Enums';
import { formatDate, getJobpostType } from '~/utils';
import { parseISO } from 'date-fns';
import { PencilIcon } from 'lucide-react';

export type JobPostRendererProps = {
  data: JobPost;
  preview?: boolean;
};

const JobPostRenderer = ({ data, preview = false }: JobPostRendererProps) => {
  const { event } = useAnalytics();
  const deadline = formatDate(parseISO(data.deadline));
  const publishedAt = formatDate(parseISO(data.created_at));

  const goToApplyLink = () => event('apply', 'jobposts', `Apply to: ${data.company}, ${data.title}`);

  return (
    <div className='grid lg:grid-cols-[3fr_1fr] gap-4 items-start'>
      <div className='space-y-4'>
        <AspectRatioImg alt={data.image_alt || data.title} className='rounded-md' src={data.image} />

        <Card>
          <CardHeader>
            <CardTitle>{data.title}</CardTitle>
            <CardDescription>Publisert: {publishedAt}</CardDescription>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer value={data.ingress || ''} />
            <MarkdownRenderer value={data.body} />
          </CardContent>
        </Card>
      </div>

      <div className='space-y-4'>
        <Card>
          <CardContent className='p-4 space-y-2'>
            <DetailContent info={data.company} title='Bedrift: ' />
            <DetailContent info={data.is_continuously_hiring ? 'Fortløpende opptak' : deadline} title='Søknadsfrist: ' />
            <DetailContent
              info={data.class_start === data.class_end ? data.class_start + '.' : data.class_start + '. - ' + data.class_end + '.'}
              title='Årstrinn: '
            />
            <DetailContent info={getJobpostType(data.job_type)} title='Stillingstype: ' />
            <DetailContent info={data.location} title='Sted: ' />
          </CardContent>
        </Card>

        <div className='space-y-2'>
          {data.email && (
            <DetailContent
              info={
                <a href={`mailto:${data.email}`} rel='noreferrer' target='_blank'>
                  {data.email}
                </a>
              }
              title='Kontakt: '
            />
          )}
          {data.link && (
            <Button asChild className='w-full'>
              <a href={data.link} onClick={goToApplyLink} rel='noreferrer' target='_blank'>
                Søk
              </a>
            </Button>
          )}
          <ShareButton shareId={data.id} shareType='jobpost' title={data.title} />
          {!preview && (
            <HavePermission apps={[PermissionApp.JOBPOST]}>
              <Button asChild className='w-full text-black dark:text-white' variant='outline'>
                <Link to='/admin/stillingsannonser/{-$jobPostId}' params={{ jobPostId: data.id.toString() }}>
                  <PencilIcon className='mr-2 w-5 h-5 stroke-[1.5px]' />
                  Endre annonse
                </Link>
              </Button>
            </HavePermission>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobPostRenderer;

export const JobPostRendererLoading = () => {
  return (
    <div className='grid lg:grid-cols-[3fr_1fr] items-start gap-4'>
      <div className='space-y-4'>
        <Skeleton className='h-96' />
        <Skeleton className='h-60' />
      </div>

      <div>
        <Skeleton className='h-60' />
      </div>
    </div>
  );
};
