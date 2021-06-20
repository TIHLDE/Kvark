import { useEffect } from 'react';
import URLS from 'URLS';
import Helmet from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { urlEncode } from 'utils';
import { useEventById } from 'api/hooks/Event';
import { Box } from '@material-ui/core';

// Project components
import Http404 from 'containers/Http404';
import Page from 'components/navigation/Page';
import EventRenderer, { EventRendererLoading } from 'containers/EventDetails/components/EventRenderer';
import TIHLDELOGO from 'assets/img/TihldeBackground.jpg';
import Container from 'components/layout/Container';

const EventDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useEventById(Number(id));
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      navigate(`${URLS.events}${id}/${urlEncode(data.title)}/`, { replace: true });
    }
  }, [id, data, navigate]);

  if (isError) {
    return <Http404 />;
  }

  return (
    <Page maxWidth={false} options={{ lightColor: 'blue', title: `${data ? data.title : 'Laster arrangement...'}` }}>
      {data && (
        <Helmet>
          <meta content={data.title} property='og:title' />
          <meta content='website' property='og:type' />
          <meta content={window.location.href} property='og:url' />
          <meta content={data.image || 'https://tihlde.org' + TIHLDELOGO} property='og:image' />
        </Helmet>
      )}
      <Box sx={{ background: (theme) => theme.palette.background.paper, minHeight: '101vh', pt: 8 }}>
        <Container sx={{ px: { xl: 9, lg: 5 } }}>{isLoading ? <EventRendererLoading /> : data !== undefined && <EventRenderer data={data} />}</Container>
      </Box>
    </Page>
  );
};

export default EventDetails;
