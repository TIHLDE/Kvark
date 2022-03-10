import { Grid } from '@mui/material';
import { useEffect } from 'react';
import Helmet from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import URLS from 'URLS';

import { PermissionApp } from 'types/Enums';

import { useGalleriesById } from 'hooks/Gallery';
import { HavePermission } from 'hooks/User';

import GalleryEditorDialog from 'pages/GalleryDetails/components/GalleryEditor';
import GalleryRenderer from 'pages/GalleryDetails/components/GalleryRenderer';
import { ImageGridLoading } from 'pages/GalleryDetails/components/ImageGrid';
import PictureUpload from 'pages/GalleryDetails/components/PictureUpload';
import Http404 from 'pages/Http404';

import Banner from 'components/layout/Banner';
import Page from 'components/navigation/Page';

const GalleryDetails = () => {
  const { slug } = useParams();
  const { data, isLoading, isError } = useGalleriesById(String(slug));
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
            <Grid alignItems='center' container direction='row' gap={2} wrap='nowrap'>
              <HavePermission apps={[PermissionApp.PICTURE]}>
                <PictureUpload slug={data.slug} />
              </HavePermission>
              <HavePermission apps={[PermissionApp.PICTURE]}>
                <GalleryEditorDialog slug={data.slug} />
              </HavePermission>
            </Grid>
          </Banner>
        )
      }
      options={{ title: data ? data.title : 'Laster galleri...', gutterTop: false, filledTopbar: true, lightColor: 'blue' }}>
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
            <GalleryRenderer gallery={data} />
          </>
        )
      )}
    </Page>
  );
};

export default GalleryDetails;
