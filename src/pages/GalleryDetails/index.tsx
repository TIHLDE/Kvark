import { createFileRoute, redirect, useParams } from '@tanstack/react-router';
import Page from '~/components/navigation/Page';
import Http404 from '~/components/shells/Http404';
import { galleryByIdQuery, useGalleryById } from '~/hooks/Gallery';
import { HavePermission } from '~/hooks/User';
import GalleryRenderer, { GalleryRendererLoading } from '~/pages/GalleryDetails/components/GalleryRenderer';
import { getQueryClient } from '~/queryClient';
import { PermissionApp } from '~/types/Enums';

import GalleryEditorDialog from './components/GalleryEditor';
import PictureUpload from './components/PictureUpload';

export const Route = createFileRoute('/_MainLayout/galleri/$id/{-$urlTitle}')({
  loader: async ({ params }) => {
    try {
      const gallery = await getQueryClient().ensureQueryData(galleryByIdQuery(params.id));
      if (!gallery) {
        throw redirect({ to: '/galleri' });
      }
      return {
        gallery,
      };
    } catch {
      throw redirect({ to: '/galleri' });
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { property: 'og:title', content: loaderData?.gallery.title },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: typeof window !== 'undefined' ? window.location.href : '' },
      { property: 'og:image', content: loaderData?.gallery.image },
    ],
  }),
  component: GalleryDetails,
});

function GalleryDetails() {
  const { id } = useParams({ strict: false });
  const { data, isError } = useGalleryById(String(id));

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
                  <PictureUpload id={data.id} />
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
}
