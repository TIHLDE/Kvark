import { useEffect } from 'react';
import URLS from 'URLS';
import Helmet from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { urlEncode } from 'utils';
import { useJobPostById } from 'hooks/JobPost';

// Project Components
import Http404 from 'containers/Http404';
import Page from 'components/navigation/Page';
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
    <Page options={{ title: data ? data.title : 'Laster annonse...', gutterTop: true, filledTopbar: true, lightColor: 'blue' }}>
      {isLoading ? (
        <JobPostRendererLoading />
      ) : (
        data !== undefined && (
          <>
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
