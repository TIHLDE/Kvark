import Page from '~/components/navigation/Page';
import { useGalleryById } from '~/hooks/Gallery';
import { HavePermission } from '~/hooks/User';
import GalleryRenderer, { GalleryRendererLoading } from '~/pages/GalleryDetails/components/GalleryRenderer';
import Http404 from '~/pages/Http404';
import { PermissionApp } from '~/types/Enums';
import URLS from '~/URLS';
import { useEffect } from 'react';
import Helmet from 'react-helmet';
import { useNavigate, useParams } from 'react-router';

import GalleryEditorDialog from './components/GalleryEditor';

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
    <Page className='space-y-12'>
      <div className='space-y-4 space-x-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between'>
        <div className='space-y-4 w-full'>
          <div className='flex flex-col gap-2 md:flex-row md:justify-between md:items-center'>
            <h1 className='text-3xl lg:text-5xl font-bold'>{data?.title || 'Laster galleri...'}</h1>

            <HavePermission apps={[PermissionApp.PICTURE]}>
              {data && (
                <div className='flex items-center space-x-2'>
                  {/* <PictureUpload id={data.id} /> */}
                  <GalleryEditorDialog id={data.id} />
                </div>
              )}
            </HavePermission>
          </div>
          <p className='text-muted-foreground break-all'>{data?.description}</p>
        </div>
      </div>

      {data ? (
        <>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
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
