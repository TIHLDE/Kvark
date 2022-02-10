import { Box } from '@mui/material';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import URLS from 'URLS';
import { urlEncode } from 'utils';

import { useNewsById } from 'hooks/News';

import Http404 from 'pages/Http404';
import NewsRenderer, { NewsRendererLoading } from 'pages/NewsDetails/components/NewsRenderer';

import Page from 'components/navigation/Page';

import TIHLDELOGO from 'assets/img/TihldeBackground.jpg';

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
    <Page maxWidth={false} options={{ title: data ? data.title : 'Laster nyhet...' }}>
      {data && (
        <Helmet>
          <meta content={data.title} property='og:title' />
          <meta content='website' property='og:type' />
          <meta content={window.location.href} property='og:url' />
          <meta content={data.image || 'https://tihlde.org' + TIHLDELOGO} property='og:image' />
        </Helmet>
      )}
      <Box sx={{ pb: 2 }}>{isLoading ? <NewsRendererLoading /> : data !== undefined && <NewsRenderer data={data} />}</Box>
    </Page>
  );
};

export default NewsDetails;
