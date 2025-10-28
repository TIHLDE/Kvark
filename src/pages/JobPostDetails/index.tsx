import { createFileRoute, useParams } from '@tanstack/react-router';
import Page from '~/components/navigation/Page';
import { jobPostByIdQuery, useJobPostById } from '~/hooks/JobPost';
import Http404 from '~/pages/Http404';
import JobPostRenderer, { JobPostRendererLoading } from '~/pages/JobPostDetails/components/JobPostRenderer';
import { getQueryClient } from '~/queryClient';

export const Route = createFileRoute('/_MainLayout/stillingsannonser/$id/{-$urlTitle}')({
  loader: async ({ params }) => {
    const jobPost = await getQueryClient().ensureQueryData(jobPostByIdQuery(Number(params.id)));
    return {
      jobPost,
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      { property: 'og:title', content: loaderData?.jobPost.title },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: typeof window !== 'undefined' ? window.location.href : '' },
      { property: 'og:image', content: loaderData?.jobPost.image },
    ],
  }),
  component: JobPostDetails,
});

function JobPostDetails() {
  const { id } = useParams({ strict: false });
  const { data, isLoading, isError } = useJobPostById(Number(id));

  if (isError) {
    return <Http404 />;
  }

  return <Page>{isLoading ? <JobPostRendererLoading /> : data !== undefined && <JobPostRenderer data={data} />}</Page>;
}
