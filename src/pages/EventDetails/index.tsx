import TIHLDELOGO from '~/assets/img/TihldeBackground.jpg';
import Page from '~/components/navigation/Page';
import { useEventById } from '~/hooks/Event';
import EventRenderer, { EventRendererLoading } from '~/pages/EventDetails/components/EventRenderer';
import Http404 from '~/pages/Http404';
import URLS from '~/URLS';
import { urlEncode } from '~/utils';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router';

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
    <Page>
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
      <div>
        <div>{isLoading ? <EventRendererLoading /> : data !== undefined && <EventRenderer data={data} />}</div>
      </div>
    </Page>
  );
};

export default EventDetails;
