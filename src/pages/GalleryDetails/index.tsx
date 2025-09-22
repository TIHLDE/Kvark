import Page from '~/components/navigation/Page';
import { galleryByIdQuery, useGalleryById } from '~/hooks/Gallery';
import { HavePermission } from '~/hooks/User';
import GalleryRenderer, { GalleryRendererLoading } from '~/pages/GalleryDetails/components/GalleryRenderer';
import Http404 from '~/pages/Http404';
import { getQueryClient } from '~/queryClient';
import { PermissionApp } from '~/types/Enums';
import URLS from '~/URLS';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Route } from './+types';
import GalleryEditorDialog from './components/GalleryEditor';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const gallery = await getQueryClient().ensureQueryData(galleryByIdQuery(params.id));
  return {
    gallery,
  };
}

export const meta: Route.MetaFunction = ({ data }) => {
  return [
    { property: 'og:title', content: data?.gallery.title },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: window.location.href },
    { property: 'og:image', content: data?.gallery.image },
  ];
};

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

      {data ? <GalleryRenderer id={data.id} /> : <GalleryRendererLoading />}
    </Page>
  );
};

export default GalleryDetails;
