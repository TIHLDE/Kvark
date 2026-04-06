import { Link } from '@tanstack/react-router';
import type { JobDetail } from '@tihlde/sdk';
import AspectRatioImg from '~/components/miscellaneous/AspectRatioImg';
import DetailContent from '~/components/miscellaneous/DetailContent';
import MarkdownRenderer from '~/components/miscellaneous/MarkdownRenderer';
import ShareButton from '~/components/miscellaneous/ShareButton';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { useAnalytics } from '~/hooks/Utils';
import { JOB_TYPE_LABELS, CLASS_LABELS } from '~/routes/jobs/-components/job-labels';
import { formatDate } from '~/utils';
import { parseISO } from 'date-fns';
import { PencilIcon } from 'lucide-react';

export type JobPostRendererProps = {
  data: JobDetail;
  preview?: boolean;
};

const JobPostRenderer = ({ data, preview = false }: JobPostRendererProps) => {
  const { event } = useAnalytics();
  const deadline = data.deadline ? formatDate(parseISO(data.deadline)) : null;
  const publishedAt = formatDate(parseISO(data.createdAt));

  const goToApplyLink = () => event('apply', 'jobposts', `Apply to: ${data.company}, ${data.title}`);

  const startLabel = CLASS_LABELS[data.classStart] ?? data.classStart;
  const endLabel = CLASS_LABELS[data.classEnd] ?? data.classEnd;
  const classDisplay = data.classStart === data.classEnd ? `${startLabel}` : `${startLabel} - ${endLabel}`;

  return (
    <div className='grid lg:grid-cols-[3fr_1fr] gap-4 items-start'>
      <div className='space-y-4'>
        <AspectRatioImg alt={data.imageAlt || data.title} className='rounded-md' src={data.imageUrl ?? ''} />

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
            <DetailContent info={data.isContinuouslyHiring ? 'Fortlopende opptak' : (deadline ?? 'Ingen frist')} title='Soknadsfrist: ' />
            <DetailContent info={classDisplay} title='Arstrinn: ' />
            <DetailContent info={JOB_TYPE_LABELS[data.jobType] ?? data.jobType} title='Stillingstype: ' />
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
                Sok
              </a>
            </Button>
          )}
          <ShareButton shareId={data.id} shareType='jobpost' title={data.title} />
          {/* TODO: Re-add auth protection — previously used HavePermission with PermissionApp.JOBPOST */}
          {!preview && (
            <Button asChild className='w-full text-black dark:text-white' variant='outline'>
              <Link to='/admin/stillingsannonser/{-$jobPostId}' params={{ jobPostId: data.id.toString() }}>
                <PencilIcon className='mr-2 w-5 h-5 stroke-[1.5px]' />
                Endre annonse
              </Link>
            </Button>
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
