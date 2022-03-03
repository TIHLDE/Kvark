import { useEffect } from 'react';
import Helmet from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import URLS from 'URLS';

import { PermissionApp } from 'types/Enums';

import { useAlbumsById } from 'hooks/Gallery';
import { HavePermission } from 'hooks/User';

// Project components
import Http404 from 'pages/Http404';

import Banner from 'components/layout/Banner';
import Page from 'components/navigation/Page';

import GalleryRenderer from './components/GalleryRenderer';
import { ImageGridLoading } from './components/ImageGrid';
import PictureUploadDialog from './components/PictureUpload';

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
    <Page
      banner={
        data &&
        !undefined && (
          <Banner text={data.description} title={data.title}>
            <HavePermission apps={[PermissionApp.PICTURE]}>
              <PictureUploadDialog slug={data.slug} />
            </HavePermission>
          </Banner>
        )
      }
      options={{ title: data ? data.title : 'Laster album...', gutterTop: false, filledTopbar: true, lightColor: 'blue' }}>
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
