import { Box } from '@mui/material';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import URLS from 'URLS';
import { urlEncode } from 'utils';

import { useEventById } from 'hooks/Event';

import EventRenderer, { EventRendererLoading } from 'pages/EventDetails/components/EventRenderer';
import Http404 from 'pages/Http404';

import Container from 'components/layout/Container';

import TIHLDELOGO from 'assets/img/TihldeBackground.jpg';

const EventDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useEventById(Number(id));
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      const urlWithTitle = `${URLS.events}${id}/${urlEncode(data.title)}/`;
      if (urlWithTitle !== window.location.pathname) {
        navigate(urlWithTitle, { replace: true });
      }
    }
  }, [id, data, navigate]);

  if (isError) {
    return <Http404 />;
  }

  return (
    <div>
      {data && (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Helmet>
          <meta content={data.title} property='og:title' />
          <meta content='website' property='og:type' />
          <meta content={window.location.href} property='og:url' />
          <meta content={data.image || 'https://tihlde.org' + TIHLDELOGO} property='og:image' />
        </Helmet>
      )}
      <Box sx={{ background: (theme) => theme.palette.background.paper, minHeight: '101vh', pt: 8, pb: 1 }}>
        <Container sx={{ px: { xl: 9, lg: 5 } }}>{isLoading ? <EventRendererLoading /> : data !== undefined && <EventRenderer data={data} />}</Container>
      </Box>
    </div>
  );
};

export default EventDetails;
