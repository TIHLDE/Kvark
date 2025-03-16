import Page from '~/components/navigation/Page';
import { useJobPostById } from '~/hooks/JobPost';
import Http404 from '~/pages/Http404';
import JobPostRenderer, { JobPostRendererLoading } from '~/pages/JobPostDetails/components/JobPostRenderer';
import URLS from '~/URLS';
import { urlEncode } from '~/utils';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router';

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

  return (
    <Page>
      {isLoading ? (
        <JobPostRendererLoading />
      ) : (
        data !== undefined && (
          <>
            {/* @ts-ignore */}
            <Helmet>
              <meta content={data.title} property='og:title' />
              <meta content='website' property='og:type' />
              <meta content={window.location.href} property='og:url' />
              <meta content={data.image} property='og:image' />
            </Helmet>
            <JobPostRenderer data={data} />
          </>
        )
      )}
    </Page>
  );
}

export default JobPostDetails;
