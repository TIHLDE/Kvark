import Page from '~/components/navigation/Page';
import { jobPostByIdQuery, useJobPostById } from '~/hooks/JobPost';
import Http404 from '~/pages/Http404';
import JobPostRenderer, { JobPostRendererLoading } from '~/pages/JobPostDetails/components/JobPostRenderer';
import { getQueryClient } from '~/queryClient';
import URLS from '~/URLS';
import { urlEncode } from '~/utils';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Route } from './+types';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const jobPost = await getQueryClient().ensureQueryData(jobPostByIdQuery(Number(params.id)));
  return {
    jobPost,
  };
}

export const meta: Route.MetaFunction = ({ data }) => {
  return [
    { property: 'og:title', content: data?.jobPost.title },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: window.location.href },
    { property: 'og:image', content: data?.jobPost.image },
  ];
};

function JobPostDetails() {
  const { id } = useParams();
  const { data, isLoading, isError } = useJobPostById(Number(id));
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      const urlWithTitle = `${URLS.jobposts}${id}/${urlEncode(data.title)}/`;
      if (urlWithTitle !== window.location.pathname) {
        navigate(urlWithTitle, { replace: true });
      }
    }
  }, [id, navigate, data]);

  if (isError) {
    return <Http404 />;
  }

  return <Page>{isLoading ? <JobPostRendererLoading /> : data !== undefined && <JobPostRenderer data={data} />}</Page>;
}

export default JobPostDetails;
