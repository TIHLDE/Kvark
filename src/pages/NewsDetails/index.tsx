import TIHLDELOGO from '~/assets/img/TihldeBackground.jpg';
import Page from '~/components/navigation/Page';
import { newsByIdQuery, useNewsById } from '~/hooks/News';
import Http404 from '~/pages/Http404';
import NewsRenderer, { NewsRendererLoading } from '~/pages/NewsDetails/components/NewsRenderer';
import { getQueryClient } from '~/queryClient';
import URLS from '~/URLS';
import { urlEncode } from '~/utils';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Route } from './+types';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const news = await getQueryClient().ensureQueryData(newsByIdQuery(Number(params.id)));

  return {
    news,
  };
}

export const meta: Route.MetaFunction = ({ data }) => {
  return [
    { property: 'og:title', content: data?.news.title },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: window.location.href },
    { property: 'og:image', content: data?.news.image || 'https://tihlde.org' + TIHLDELOGO },
  ];
};

const NewsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useNewsById(Number(id));

  useEffect(() => {
    if (data) {
      const urlWithTitle = `${URLS.news}${id}/${urlEncode(data.title)}/`;
      if (urlWithTitle !== window.location.pathname) {
        navigate(urlWithTitle, { replace: true });
      }
    }
  }, [id, navigate, data]);

  if (isError) {
    return <Http404 />;
  }

  return (
    <Page>
      <div className='pb-4'>{isLoading ? <NewsRendererLoading /> : data !== undefined && <NewsRenderer data={data} />}</div>
    </Page>
  );
};

export default NewsDetails;
