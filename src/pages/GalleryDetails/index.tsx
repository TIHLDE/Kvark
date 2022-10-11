import { Stack } from '@mui/material';
import { useEffect } from 'react';
import Helmet from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import URLS from 'URLS';

import { PermissionApp } from 'types/Enums';

import { useGalleryById } from 'hooks/Gallery';
import { HavePermission } from 'hooks/User';

import GalleryEditorDialog from 'pages/GalleryDetails/components/GalleryEditor';
import GalleryRenderer, { GalleryRendererLoading } from 'pages/GalleryDetails/components/GalleryRenderer';
import PictureUpload from 'pages/GalleryDetails/components/PictureUpload';
import Http404 from 'pages/Http404';

import Banner from 'components/layout/Banner';
import Page from 'components/navigation/Page';

const GalleryDetails = () => {
  const { id } = useParams<'id'>();
  const { data, isError } = useGalleryById(String(id));
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      navigate(`${URLS.gallery}${id}/`, { replace: true });
    }
  }, [id, data, navigate]);

  if (isError) {
    return <Http404 />;
  }

  return (
    <Page
      banner={
        <Banner text={data?.description} title={data?.title || 'Laster galleri...'}>
          <HavePermission apps={[PermissionApp.PICTURE]}>
            {data && (
              <Stack gap={1}>
                <PictureUpload id={data.id} />
                <GalleryEditorDialog id={data.id} />
              </Stack>
            )}
          </HavePermission>
        </Banner>
      }
      options={{ title: data?.title || 'Laster galleri...' }}>
      {data ? (
        <>
          <Helmet>
            <meta content={data.title} property='og:title' />
            <meta content='website' property='og:type' />
            <meta content={window.location.href} property='og:url' />
            <meta content={data.image} property='og:image' />
          </Helmet>
          <GalleryRenderer id={data.id} />
        </>
      ) : (
        <GalleryRendererLoading />
      )}
    </Page>
  );
};

export default GalleryDetails;
