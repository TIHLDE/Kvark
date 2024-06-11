import { useEffect } from 'react';
import Helmet from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import URLS from 'URLS';

import { useGalleryById } from 'hooks/Gallery';

import GalleryRenderer, { GalleryRendererLoading } from 'pages/GalleryDetails/components/GalleryRenderer';
import Http404 from 'pages/Http404';

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
    // TODO: Add 'edit button' when migration is done
    // <Page
    //   banner={
    //     <Banner text={data?.description} title={data?.title || 'Laster galleri...'}>
    //       <HavePermission apps={[PermissionApp.PICTURE]}>
    //         {data && (
    //           <Stack gap={1}>
    //             <PictureUpload id={data.id} />
    //             <GalleryEditorDialog id={data.id} />
    //           </Stack>
    //         )}
    //       </HavePermission>
    //     </Banner>
    //   }
    //   options={{ title: data?.title || 'Laster galleri...' }}>
    <div className='w-full px-2 md:px-12 mt-40'>
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
    </div>
  );
};

export default GalleryDetails;
