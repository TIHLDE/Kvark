import { createFileRoute, useParams } from '@tanstack/react-router';
import TIHLDELOGO from '~/assets/img/TihldeBackground.jpg';
import Page from '~/components/navigation/Page';
import Http404 from '~/components/shells/Http404';
import { newsByIdQuery, useNewsById } from '~/hooks/News';
import NewsRenderer, { NewsRendererLoading } from '~/pages/NewsDetails/components/NewsRenderer';
import { getQueryClient } from '~/queryClient';

export const Route = createFileRoute('/_MainLayout/nyheter/$id/{-$urlTitle}')({
  loader: async ({ params }) => {
    const news = await getQueryClient().ensureQueryData(newsByIdQuery(Number(params.id)));

    return {
      news,
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      { property: 'og:title', content: loaderData?.news.title },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: typeof window !== 'undefined' ? window.location.href : '' },
      { property: 'og:image', content: loaderData?.news.image || 'https://tihlde.org' + TIHLDELOGO },
    ],
  }),
  component: NewsDetails,
});

function NewsDetails() {
  const { id } = useParams({ strict: false });
  const { data, isLoading, isError } = useNewsById(Number(id));

  if (isError) {
    return <Http404 />;
  }

  return (
    <Page>
      <div className='pb-4'>{isLoading ? <NewsRendererLoading /> : data !== undefined && <NewsRenderer data={data} />}</div>
    </Page>
  );
}
