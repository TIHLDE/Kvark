import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import URLS from 'URLS';
import Helmet from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { urlEncode } from 'utils';
import { useEventById } from 'api/hooks/Event';

// Project components
import Http404 from 'containers/Http404';
import Navigation from 'components/navigation/Navigation';
import EventRenderer, { EventRendererLoading } from 'containers/EventDetails/components/EventRenderer';
import TIHLDELOGO from 'assets/img/TihldeBackground.jpg';
import Container from 'components/layout/Container';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    background: theme.palette.background.paper,
    minHeight: '101vh',
  },
  container: {
    padding: theme.spacing(8, 9),
    [theme.breakpoints.down('lg')]: {
      padding: theme.spacing(8, 5),
    },
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(8, 1, 5),
    },
  },
}));

const EventDetails = () => {
  const classes = useStyles();
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
    <Navigation fancyNavbar maxWidth={false} topbarProps={{ whiteOnLight: true }}>
      {data && (
        <Helmet>
          <title>{data.title} - TIHLDE</title>
          <meta content={data.title} property='og:title' />
          <meta content='website' property='og:type' />
          <meta content={window.location.href} property='og:url' />
          <meta content={data.image || 'https://tihlde.org' + TIHLDELOGO} property='og:image' />
        </Helmet>
      )}
      <div className={classes.wrapper}>
        <Container className={classes.container} maxWidth='xl'>
          {isLoading ? <EventRendererLoading /> : data !== undefined && <EventRenderer data={data} />}
        </Container>
      </div>
    </Navigation>
  );
};

export default EventDetails;
