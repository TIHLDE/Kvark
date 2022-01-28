import { useEffect } from 'react';
import URLS from 'URLS';
import Helmet from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { useAlbumsById } from 'hooks/Gallery';

// Project components
import Http404 from 'pages/Http404';
import Page from 'components/navigation/Page';
import GalleryRenderer from './components/GalleryRenderer';
import { ImageGridLoading } from './components/ImageGrid';

const GalleryDetails = () => {
  const { slug } = useParams();
  const { data, isLoading, isError } = useAlbumsById(String(slug));
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      navigate(`${URLS.gallery}${slug}/`, { replace: true });
    }
  }, [slug, data, navigate]);

  if (isError) {
    return <Http404 />;
  }

  return (
    <Page options={{ title: data ? data.title : 'Laster album...', gutterTop: true, filledTopbar: true, lightColor: 'blue' }}>
      {isLoading ? (
        <ImageGridLoading />
      ) : (
        data !== undefined && (
          <>
            <Helmet>
              <meta content={data.title} property='og:title' />
              <meta content='website' property='og:type' />
              <meta content={window.location.href} property='og:url' />
              <meta content={data.image} property='og:image' />
            </Helmet>
            <GalleryRenderer data={data} />
          </>
        )
      )}
    </Page>
  );
};

export default GalleryDetails;
