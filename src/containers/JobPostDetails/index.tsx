import { useEffect } from 'react';
import URLS from 'URLS';
import Helmet from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { urlEncode } from 'utils';
import { useJobPostById } from 'api/hooks/JobPost';

// Project Components
import Http404 from 'containers/Http404';
import Navigation from 'components/navigation/Navigation';
import JobPostRenderer, { JobPostRendererLoading } from 'containers/JobPostDetails/components/JobPostRenderer';

function JobPostDetails() {
  const { id } = useParams();
  const { data, isLoading, isError } = useJobPostById(Number(id));
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      navigate(`${URLS.jobposts}${id}/${urlEncode(data.title)}/`, { replace: true });
    }
  }, [id, navigate, data]);

  if (isError) {
    return <Http404 />;
  }

  return (
    <Navigation maxWidth='xl'>
      {isLoading ? (
        <JobPostRendererLoading />
      ) : (
        data !== undefined && (
          <>
            <Helmet>
              <title>{data.title} - TIHLDE</title>
              <meta content={data.title} property='og:title' />
              <meta content='website' property='og:type' />
              <meta content={window.location.href} property='og:url' />
              <meta content={data.image} property='og:image' />
            </Helmet>
            <JobPostRenderer data={data} />
          </>
        )
      )}
    </Navigation>
  );
}

export default JobPostDetails;
